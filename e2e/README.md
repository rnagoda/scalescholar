# E2E Testing with Maestro

End-to-end tests for Scale Scholar using [Maestro](https://maestro.mobile.dev/).

## Prerequisites

Install Maestro:
```bash
brew install maestro
```

## Critical: Rebuild Before Testing

**Code changes require an app rebuild before E2E tests will reflect them.**

Hot reload does NOT reliably update all changes. Always rebuild after code changes:

```bash
# Rebuild for iOS
npx expo run:ios

# Rebuild for Android
npx expo run:android

# Then run tests
npm run e2e:ipad
```

## Running Tests

### Using the test runner script (recommended)

The `run-tests.sh` script auto-detects booted simulators/emulators:

```bash
# Run all tests on all platforms (iPad, iPhone, Android)
npm run e2e:all

# Run on specific platform
npm run e2e:ipad
npm run e2e:iphone
npm run e2e:android

# Run specific test on specific platform
./e2e/run-tests.sh ipad ear-school/intervals.yaml

# Run specific test on all platforms
./e2e/run-tests.sh all ear-school/intervals.yaml
```

The script will:
- Auto-detect booted simulators/emulators by UUID
- Run tests on each platform
- Output clear PASS/FAIL per platform
- Return exit code 0 only if all platforms pass

### Run a single test manually

```bash
maestro --device <DEVICE_UUID> test e2e/tests/ear-school/intervals.yaml
```

## Finding Device IDs

**Important:** Maestro requires device UUIDs, not device names.

### iOS Simulators
```bash
# List booted simulators with their UUIDs
xcrun simctl list devices | grep Booted

# Example output:
# iPad Pro 13-inch (M4) (B696F8E6-4CF8-44C3-A023-7815F02A7407) (Booted)
#                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
#                       Use this UUID in --device flag
```

### Android Emulators
```bash
adb devices
```

## Test Structure

```
e2e/
├── tests/
│   ├── app-launch.yaml           # Smoke test - app opens
│   ├── ear-school/
│   │   ├── navigation.yaml       # Menu navigation
│   │   ├── intervals.yaml        # Intervals exercise flow
│   │   ├── scale-degrees.yaml    # Scale degrees exercise
│   │   └── chords.yaml           # Chords exercise
│   ├── voice-school/
│   │   └── ...
│   └── settings/
│       └── reset-progress.yaml
└── README.md
```

## Writing Tests

Each test file starts with the app ID:
```yaml
appId: com.nagodasoft.scalescholar
---
```

Common commands:
```yaml
- launchApp:
    clearState: true          # Fresh start

- tapOn: "Button Text"        # Tap exact text
- tapOn:
    text: ".*Pattern.*"       # Tap regex match

- assertVisible: "Text"       # Verify text visible
- assertVisible:
    text: ".*Pattern.*"       # Verify regex match

- extendedWaitUntil:
    visible: "Text"
    timeout: 5000             # Wait up to 5s
```

See [Maestro docs](https://maestro.mobile.dev/reference/commands) for full command reference.

## Device Management

The `run-tests.sh` script fully automates simulator/emulator management:

1. **Shutdown** - Shuts down any existing simulators
2. **Boot** - Finds and boots a fresh simulator by name pattern
3. **Build** - Builds and installs the app automatically
4. **Test** - Runs all E2E tests
5. **Cleanup** - Shuts down the simulator when complete

### Device Name Patterns

The script uses name patterns to find simulators (configured at top of script):

```bash
IPAD_PATTERN="iPad Pro 13-inch"
IPHONE_PATTERN="iPhone 16 Pro"
```

To change which devices are used, edit these patterns in `e2e/run-tests.sh`.

### Listing Available Simulators

```bash
# List available iPad simulators
xcrun simctl list devices available | grep -i ipad

# List available iPhone simulators
xcrun simctl list devices available | grep -i iphone

# List Android AVDs
emulator -list-avds
```
