/**
 *
 * @see https://babeljs.io/docs/en/babel-preset-env#how-does-it-work
 */

module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "debug": true,
        "targets": {
          "browsers": [
            "last 2 versions"
            // "not IE 11", // "not dead"
          ],
          "ie": "11"
        }
      }
    ],
    "@babel/preset-typescript"
  ],
  "sourceMaps": "inline",
  "plugins": [
    "@babel/proposal-class-properties"
  ]
};
