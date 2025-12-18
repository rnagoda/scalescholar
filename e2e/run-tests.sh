#!/bin/bash
# e2e/run-tests.sh
# Usage: ./e2e/run-tests.sh [platform] [test-file]
#
# Platforms: ipad, iphone, android, all (default: all)
#
# This script will:
# 1. Shutdown existing simulators
# 2. Boot a fresh simulator
# 3. Build and install the app
# 4. Run E2E tests
# 5. Shutdown the simulator
# 6. Repeat for each platform

PLATFORM="${1:-all}"
TEST_FILE="${2:-}"

# Device name patterns (adjust these to match your available simulators)
IPAD_PATTERN="iPad Pro 13-inch"
IPHONE_PATTERN="iPhone 17 Pro"

# Maestro path
MAESTRO="$HOME/.maestro/bin/maestro"

# Android SDK path
ANDROID_SDK="$HOME/Library/Android/sdk"
EMULATOR="$ANDROID_SDK/emulator/emulator"
ADB="$ANDROID_SDK/platform-tools/adb"

if [ ! -f "$MAESTRO" ]; then
  echo "ERROR: Maestro not found at $MAESTRO"
  exit 1
fi

# Determine test path
if [ -n "$TEST_FILE" ]; then
  TEST_PATH="e2e/tests/$TEST_FILE"
else
  TEST_PATH="e2e/tests/"
fi

echo "========================================"
echo "E2E Test Runner"
echo "Platform: $PLATFORM"
echo "Tests: $TEST_PATH"
echo "========================================"
echo ""

FAILED_PLATFORMS=""
PASSED_PLATFORMS=""

# Reports directory
REPORTS_DIR="e2e/reports"

# Create reports directory structure
setup_reports_dir() {
  mkdir -p "$REPORTS_DIR/iphone"
  mkdir -p "$REPORTS_DIR/ipad"
  mkdir -p "$REPORTS_DIR/android"
}

# Parse JUnit XML report and extract failure details
# Returns: passed_count failed_count
parse_junit_report() {
  local report_file="$1"

  if [ ! -f "$report_file" ]; then
    echo "0 0"
    return
  fi

  # Extract test counts from JUnit XML
  local tests=$(grep -o 'tests="[0-9]*"' "$report_file" 2>/dev/null | head -1 | grep -o '[0-9]*')
  local failures=$(grep -o 'failures="[0-9]*"' "$report_file" 2>/dev/null | head -1 | grep -o '[0-9]*')
  local errors=$(grep -o 'errors="[0-9]*"' "$report_file" 2>/dev/null | head -1 | grep -o '[0-9]*')

  tests=${tests:-0}
  failures=${failures:-0}
  errors=${errors:-0}

  local total_failures=$((failures + errors))
  local passed=$((tests - total_failures))

  echo "$passed $tests"
}

# Get failure messages from JUnit XML
get_failure_messages() {
  local report_file="$1"

  if [ ! -f "$report_file" ]; then
    return
  fi

  # Extract failure messages - look for <failure> tags and their message attributes
  grep -o 'message="[^"]*"' "$report_file" 2>/dev/null | sed 's/message="//g' | sed 's/"$//g' | head -5
}

# Initialize reports
setup_reports_dir

# Function to shutdown all iOS simulators
shutdown_all_ios_simulators() {
  echo "Shutting down all iOS simulators..."
  xcrun simctl shutdown all 2>/dev/null || true
  sleep 2
}

# Function to find iOS device by name pattern
find_ios_device_by_name() {
  local name_pattern="$1"
  # Find device matching pattern, get UUID
  xcrun simctl list devices available | grep -i "$name_pattern" | grep -v "unavailable" | head -1 | grep -oE "[A-F0-9-]{36}"
}

# Function to boot iOS simulator and wait for it to be ready
boot_ios_simulator() {
  local device_id="$1"
  local device_name="$2"

  echo "Booting $device_name ($device_id)..."
  xcrun simctl boot "$device_id" 2>/dev/null

  # Wait for simulator to boot
  local max_wait=60
  local waited=0
  while [ $waited -lt $max_wait ]; do
    local state=$(xcrun simctl list devices | grep "$device_id" | grep -o "(Booted)")
    if [ -n "$state" ]; then
      echo "Simulator booted successfully"
      sleep 3
      return 0
    fi
    sleep 2
    waited=$((waited + 2))
    echo "  Waiting for boot... ($waited s)"
  done

  echo "ERROR: Simulator failed to boot within $max_wait seconds"
  return 1
}

# Function to build iOS app for a specific simulator
build_ios_app() {
  local device_id="$1"
  echo ""
  echo "Building iOS app..."
  echo "This may take a few minutes..."
  echo ""

  if npx expo run:ios --device "$device_id" --configuration Release --no-bundler; then
    echo "Build completed successfully"
    return 0
  else
    echo "ERROR: Build failed"
    return 1
  fi
}

# Function to find Android emulator
find_android_device() {
  "$ADB" devices 2>/dev/null | grep -v "List" | grep "device$" | cut -f1 | head -1
}

# Function to launch Android emulator
# Note: All informational messages go to stderr, only device ID goes to stdout
launch_android_emulator() {
  local avd_name=$("$EMULATOR" -list-avds 2>/dev/null | head -1)

  if [ -z "$avd_name" ]; then
    echo "ERROR: No Android AVDs found. Create one in Android Studio." >&2
    return 1
  fi

  echo "Launching Android emulator: $avd_name" >&2
  "$EMULATOR" -avd "$avd_name" -no-snapshot-load &>/dev/null &

  local max_wait=120
  local waited=0
  echo "Waiting for emulator to start..." >&2

  while [ $waited -lt $max_wait ]; do
    local device=$(find_android_device)
    if [ -n "$device" ]; then
      local boot_complete=$("$ADB" -s "$device" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')
      if [ "$boot_complete" = "1" ]; then
        echo "Android emulator ready: $device" >&2
        echo "$device"
        return 0
      fi
    fi
    sleep 3
    waited=$((waited + 3))
    echo "  Waiting... ($waited s)" >&2
  done

  echo "ERROR: Android emulator failed to start" >&2
  return 1
}

# Function to build Android app
build_android_app() {
  echo ""
  echo "Building Android app..."
  echo "This may take a few minutes..."
  echo ""

  if npx expo run:android --variant release --no-bundler; then
    echo "Build completed successfully"
    return 0
  else
    echo "ERROR: Build failed"
    return 1
  fi
}

# Function to shutdown Android emulator
shutdown_android_emulator() {
  local device_id="$1"
  echo "Shutting down Android emulator..."
  "$ADB" -s "$device_id" emu kill 2>/dev/null || true
}

# Function to shutdown all Android emulators
shutdown_all_android_emulators() {
  echo "Shutting down all Android emulators..."
  # Get all connected emulator device IDs
  local devices=$("$ADB" devices 2>/dev/null | grep "emulator-" | cut -f1)
  for device in $devices; do
    "$ADB" -s "$device" emu kill 2>/dev/null || true
  done
  sleep 2
}

# Function to run tests on a device
run_tests() {
  local platform_name="$1"
  local device_id="$2"
  local test_failed=0
  local platform_lower=$(echo "$platform_name" | tr '[:upper:]' '[:lower:]')
  local report_dir="$REPORTS_DIR/$platform_lower"

  echo ""
  echo "----------------------------------------"
  echo "RUNNING TESTS: $platform_name"
  echo "Device: $device_id"
  echo "----------------------------------------"

  # Clear previous reports for this platform
  rm -f "$report_dir"/*.xml 2>/dev/null

  if [ -n "$TEST_FILE" ]; then
    local test_name=$(basename "$TEST_FILE" .yaml)
    local report_path="$report_dir/${test_name}.xml"
    if "$MAESTRO" --device "$device_id" test "$TEST_PATH" --format=JUNIT --output="$report_path"; then
      return 0
    else
      return 1
    fi
  fi

  # Find all yaml files and run them
  local test_files
  test_files=$(find e2e/tests -name "*.yaml" -type f | sort)

  for test_file in $test_files; do
    echo ""
    echo "Running: $test_file"
    # Create report filename from test path (e.g., ear-school/intervals.yaml -> ear-school_intervals.xml)
    local test_name=$(echo "$test_file" | sed 's|e2e/tests/||' | sed 's|/|_|g' | sed 's|.yaml$||')
    local report_path="$report_dir/${test_name}.xml"
    if ! "$MAESTRO" --device "$device_id" test "$test_file" --format=JUNIT --output="$report_path"; then
      test_failed=1
    fi
  done

  return $test_failed
}

# Run tests for iPad
run_ipad() {
  echo ""
  echo "========================================"
  echo "PLATFORM: iPad"
  echo "========================================"

  # 1. Shutdown existing simulators
  shutdown_all_ios_simulators

  # 2. Find and boot iPad simulator
  echo "Finding iPad simulator matching: $IPAD_PATTERN"
  local device_id=$(find_ios_device_by_name "$IPAD_PATTERN")

  if [ -z "$device_id" ]; then
    echo "ERROR: No iPad simulator found matching '$IPAD_PATTERN'"
    echo "Available iPads:"
    xcrun simctl list devices available | grep -i "ipad"
    FAILED_PLATFORMS="$FAILED_PLATFORMS iPad"
    return 1
  fi

  echo "Found iPad: $device_id"

  if ! boot_ios_simulator "$device_id" "iPad"; then
    FAILED_PLATFORMS="$FAILED_PLATFORMS iPad"
    return 1
  fi

  # 3. Build the app
  if ! build_ios_app "$device_id"; then
    shutdown_all_ios_simulators
    FAILED_PLATFORMS="$FAILED_PLATFORMS iPad"
    return 1
  fi

  # 4. Run tests
  if run_tests "iPad" "$device_id"; then
    echo ""
    echo "✓ iPad: PASSED"
    PASSED_PLATFORMS="$PASSED_PLATFORMS iPad"
  else
    echo ""
    echo "✗ iPad: FAILED"
    FAILED_PLATFORMS="$FAILED_PLATFORMS iPad"
  fi

  # 5. Shutdown
  echo ""
  shutdown_all_ios_simulators
}

# Run tests for iPhone
run_iphone() {
  echo ""
  echo "========================================"
  echo "PLATFORM: iPhone"
  echo "========================================"

  # 1. Shutdown existing simulators
  shutdown_all_ios_simulators

  # 2. Find and boot iPhone simulator
  echo "Finding iPhone simulator matching: $IPHONE_PATTERN"
  local device_id=$(find_ios_device_by_name "$IPHONE_PATTERN")

  if [ -z "$device_id" ]; then
    echo "ERROR: No iPhone simulator found matching '$IPHONE_PATTERN'"
    echo "Available iPhones:"
    xcrun simctl list devices available | grep -i "iphone"
    FAILED_PLATFORMS="$FAILED_PLATFORMS iPhone"
    return 1
  fi

  echo "Found iPhone: $device_id"

  if ! boot_ios_simulator "$device_id" "iPhone"; then
    FAILED_PLATFORMS="$FAILED_PLATFORMS iPhone"
    return 1
  fi

  # 3. Build the app
  if ! build_ios_app "$device_id"; then
    shutdown_all_ios_simulators
    FAILED_PLATFORMS="$FAILED_PLATFORMS iPhone"
    return 1
  fi

  # 4. Run tests
  if run_tests "iPhone" "$device_id"; then
    echo ""
    echo "✓ iPhone: PASSED"
    PASSED_PLATFORMS="$PASSED_PLATFORMS iPhone"
  else
    echo ""
    echo "✗ iPhone: FAILED"
    FAILED_PLATFORMS="$FAILED_PLATFORMS iPhone"
  fi

  # 5. Shutdown
  echo ""
  shutdown_all_ios_simulators
}

# Run tests for Android
run_android() {
  echo ""
  echo "========================================"
  echo "PLATFORM: Android"
  echo "========================================"

  # 1. Shutdown existing emulators
  shutdown_all_android_emulators

  # 2. Launch fresh emulator
  local device_id=$(launch_android_emulator)
  if [ -z "$device_id" ]; then
    FAILED_PLATFORMS="$FAILED_PLATFORMS Android"
    return 1
  fi

  # 3. Build the app
  if ! build_android_app; then
    FAILED_PLATFORMS="$FAILED_PLATFORMS Android"
    return 1
  fi

  # 4. Run tests
  if run_tests "Android" "$device_id"; then
    echo ""
    echo "✓ Android: PASSED"
    PASSED_PLATFORMS="$PASSED_PLATFORMS Android"
  else
    echo ""
    echo "✗ Android: FAILED"
    FAILED_PLATFORMS="$FAILED_PLATFORMS Android"
  fi

  # 5. Shutdown emulator
  echo ""
  shutdown_android_emulator "$device_id"
}

# Main execution
case "$PLATFORM" in
  ipad)
    run_ipad
    ;;
  iphone)
    run_iphone
    ;;
  android)
    run_android
    ;;
  all)
    run_ipad
    run_iphone
    run_android
    ;;
  *)
    echo "ERROR: Unknown platform '$PLATFORM'"
    echo "Valid platforms: ipad, iphone, android, all"
    exit 1
    ;;
esac

# Function to print platform test summary
print_platform_summary() {
  local platform="$1"
  local platform_lower=$(echo "$platform" | tr '[:upper:]' '[:lower:]')
  local report_dir="$REPORTS_DIR/$platform_lower"

  # Count totals across all report files
  local total_passed=0
  local total_tests=0

  # Use find instead of glob to handle no-match case
  while IFS= read -r report_file; do
    if [ -n "$report_file" ] && [ -f "$report_file" ]; then
      local counts
      counts=$(parse_junit_report "$report_file")
      local passed=$(echo "$counts" | cut -d' ' -f1)
      local tests=$(echo "$counts" | cut -d' ' -f2)
      total_passed=$((total_passed + passed))
      total_tests=$((total_tests + tests))
    fi
  done < <(find "$report_dir" -name "*.xml" -type f 2>/dev/null)

  # If no reports found, show 0/0
  if [ $total_tests -eq 0 ]; then
    printf "%-10s (no reports found)\n" "$platform:"
    return
  fi

  # Determine status
  local status_icon="✓"
  if [ $total_passed -lt $total_tests ]; then
    status_icon="✗"
  fi

  printf "%-10s %d/%d tests passed %s\n" "$platform:" "$total_passed" "$total_tests" "$status_icon"

  # If failures, show details
  if [ $total_passed -lt $total_tests ]; then
    while IFS= read -r report_file; do
      if [ -n "$report_file" ] && [ -f "$report_file" ]; then
        local counts
        counts=$(parse_junit_report "$report_file")
        local passed=$(echo "$counts" | cut -d' ' -f1)
        local tests=$(echo "$counts" | cut -d' ' -f2)
        if [ $passed -lt $tests ]; then
          # Extract test name from filename
          local test_name=$(basename "$report_file" .xml | sed 's|_|/|g')
          echo "  FAILED: ${test_name}.yaml"
          # Show failure messages
          local messages
          messages=$(get_failure_messages "$report_file")
          if [ -n "$messages" ]; then
            echo "$messages" | while read -r msg; do
              echo "    - $msg"
            done
          fi
        fi
      fi
    done < <(find "$report_dir" -name "*.xml" -type f 2>/dev/null)
  fi
}

# Summary
echo ""
echo "========================================"
echo "SUMMARY"
echo "========================================"

# Print detailed results for each platform that was run
case "$PLATFORM" in
  ipad)
    print_platform_summary "iPad"
    ;;
  iphone)
    print_platform_summary "iPhone"
    ;;
  android)
    print_platform_summary "Android"
    ;;
  all)
    print_platform_summary "iPad"
    print_platform_summary "iPhone"
    print_platform_summary "Android"
    ;;
esac

echo ""
if [ -n "$FAILED_PLATFORMS" ]; then
  echo "RESULT: SOME TESTS FAILED"
  exit 1
else
  echo "RESULT: ALL TESTS PASSED"
  exit 0
fi
