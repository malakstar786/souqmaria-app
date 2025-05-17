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
              '@assets': './assets',
              '@src': './src',
              '@theme': './src/theme',
              // You can add more aliases here as your project grows
              // e.g., '@components': './src/components',
              // '@store': './src/store',
            },
          },
        ],
      ],
    };
  };
  