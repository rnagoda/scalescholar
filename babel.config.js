module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@audio': './src/audio',
          '@stores': './src/stores',
          '@services': './src/services',
          '@utils': './src/utils',
          '@theme': './src/theme',
          '@types': './src/types',
        },
      },
    ],
  ],
};
