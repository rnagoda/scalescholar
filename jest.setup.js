/**
 * Jest Setup File
 *
 * Configure mocks for native modules and extend Jest matchers.
 */

// Note: @testing-library/react-native v12.4+ has built-in matchers
// No additional import needed for basic matchers

// Mock react-native-audio-api
jest.mock('react-native-audio-api', () => {
  const mockGain = {
    gain: { value: 1, setValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn() },
    connect: jest.fn(),
    disconnect: jest.fn(),
  };

  const mockOscillator = {
    type: 'sine',
    frequency: { value: 440, setValueAtTime: jest.fn() },
    connect: jest.fn(),
    disconnect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  };

  const mockAnalyser = {
    fftSize: 2048,
    frequencyBinCount: 1024,
    getFloatTimeDomainData: jest.fn(),
    getByteFrequencyData: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  };

  const mockAudioContext = {
    currentTime: 0,
    sampleRate: 44100,
    state: 'running',
    destination: {},
    createGain: jest.fn(() => mockGain),
    createOscillator: jest.fn(() => mockOscillator),
    createAnalyser: jest.fn(() => mockAnalyser),
    close: jest.fn(),
    resume: jest.fn().mockResolvedValue(undefined),
    suspend: jest.fn().mockResolvedValue(undefined),
  };

  return {
    AudioContext: jest.fn(() => mockAudioContext),
  };
});

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn().mockResolvedValue({
    runAsync: jest.fn().mockResolvedValue({ changes: 1 }),
    getFirstAsync: jest.fn().mockResolvedValue(null),
    getAllAsync: jest.fn().mockResolvedValue([]),
    execAsync: jest.fn().mockResolvedValue(undefined),
    closeAsync: jest.fn().mockResolvedValue(undefined),
  }),
  SQLiteProvider: ({ children }) => children,
}));

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => {
  const mockStorage = {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn().mockResolvedValue(undefined),
    getAllKeys: jest.fn().mockResolvedValue([]),
    multiGet: jest.fn().mockResolvedValue([]),
    multiSet: jest.fn().mockResolvedValue(undefined),
    multiRemove: jest.fn().mockResolvedValue(undefined),
  };
  return {
    __esModule: true,
    default: mockStorage,
    ...mockStorage,
  };
});

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true, null]),
  loadAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn().mockResolvedValue(true),
  hideAsync: jest.fn().mockResolvedValue(true),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
  useFocusEffect: jest.fn((callback) => callback()),
  Link: ({ children }) => children,
  Href: String,
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}));

// Silence console warnings during tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Animated:') || args[0].includes('componentWillReceiveProps'))
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

// Mock timers for tests that need time control
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
