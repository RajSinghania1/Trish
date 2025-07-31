const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper handling of web builds
config.resolver.platforms = ['native', 'web', 'ios', 'android'];
config.resolver.enableSymlinks = true;

// Add support for additional file extensions
config.resolver.sourceExts.push('cjs');

// Optimize for web builds
if (process.env.EXPO_PLATFORM === 'web') {
  config.transformer.minifierConfig = {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  };
}

module.exports = config;