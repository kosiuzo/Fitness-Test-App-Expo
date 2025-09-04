module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/shared/components',
            '@/hooks': './src/shared/hooks',
            '@/services': './src/shared/services',
            '@/types': './src/shared/types',
            '@/utils': './src/shared/utils',
          },
        },
      ],
    ],
  };
};