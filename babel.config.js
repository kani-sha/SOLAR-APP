// babel.config.js
module.exports = function(api) {
  api.cache(true); // Caches the Babel configuration for faster build times

    return {
    presets: [
    [
        'babel-preset-expo',
        {
          // This is the crucial line you need for import.meta.env support
        unstable_transformImportMeta: true,
        },
],
    ],

};
};