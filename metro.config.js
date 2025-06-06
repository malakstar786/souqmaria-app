const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional asset extensions
config.resolver.assetExts.push('db');

// Exclude problematic files from Metro bundling
config.resolver.blacklistRE = /node_modules\/.*\/android\/.*\.jar$/;

// Configure transformer for better Android compatibility
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Memory optimization for large projects
config.maxWorkers = 2;

module.exports = config; 