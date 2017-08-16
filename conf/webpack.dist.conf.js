const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('../package.json');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'tslint-loader',
        enforce: 'pre'
      },
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
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    FailPlugin,
    new HtmlWebpackPlugin({
      template: conf.path.page('index.html')
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   output: {comments: false},
    //   compress: {unused: true, dead_code: true, warnings: false} // eslint-disable-line camelcase
    // }),
    new webpack.LoaderOptionsPlugin({
      options: {
        resolve: {},
        ts: {
          configFileName: 'tsconfig.json'
        },
        tslint: {
          configuration: require('../tslint.json')
        }
      }
    })
  ],
  output: {
    path: path.join(process.cwd(), conf.paths.dist),
    filename: '[name]-[hash].js'
  },
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
  },
  entry: [
    `./${conf.path.page('index')}`
  ]
};
