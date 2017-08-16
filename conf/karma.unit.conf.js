const configuration = {
  basePath: '',
  files: [
    '../test/index.ts'
  ],
  exclude: [
  ],
  frameworks: ['mocha'],
  preprocessors: {
    '../test/index.ts': ['webpack', 'sourcemap']
  },
  webpack: require('./webpack.test.conf'),
  webpackMiddleware: {
    noInfo: true
  },
  reporters: ['progress', 'mocha'],
  browsers: ['Chrome'/*, 'Firefox'*/],
  singleRun: true,
  mime: {
    'text/x-typescript': ['ts','tsx']
  },
}

module.exports = function (config) {
  config.set(configuration);
}
