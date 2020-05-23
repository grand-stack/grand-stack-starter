const TARGETS_NODE = '12.13.0'
const CORE_JS_VERSION = '3.6'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: TARGETS_NODE },
        useBuiltIns: 'usage',
        corejs: {
          version: CORE_JS_VERSION,
          proposals: true,
        },
      },
    ],
  ],
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          src: './src',
        },
      },
    ],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: { version: 3, proposals: true },
        version: '^7.8.3',
      },
    ],
  ],
}
