const webpack = require('webpack');
const path = require('path');
const conf = require('./gulp.conf');

module.exports = {
  module: {
    loaders: [
      // {
      //   test: /\.ts$/,
      //   exclude: /node_modules/,
      //   loader: 'tslint-loader',
      //   enforce: 'pre'
      // },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loaders: [
          'ts-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        resolve: {},
        ts: {
          configFileName: 'tsconfig.json'
        },
        tslint: {
          configuration: require('../tslint.json')
        }
      },
      debug: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
  ],
  devtool: 'source-map',
  node: {
    fs: "empty"
  },
  resolve: {
    extensions: [
      '.webpack.js',
      '.web.js',
      '.js',
      '.ts'
    ],
    alias: {
      src: path.resolve(__dirname, '../src'),
      generated: path.resolve(__dirname, '../generated'),
    }
  }
};
