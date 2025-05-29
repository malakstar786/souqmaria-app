module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./'],
            alias: {
              '@assets': './src/assets',
              '@src': './src',
              '@theme': './src/theme',
              '@utils': './src/utils',
              '@components': './src/components',
              '@app': './src/app',
              '@store': './src/store',
            },
          },
        ],
      ],
    };
  };
  