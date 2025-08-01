const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper handling of web builds
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

// Add support for additional file extensions
config.resolver.sourceExts.push('cjs');

module.exports = config;