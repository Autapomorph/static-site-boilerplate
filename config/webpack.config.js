const path = require('path');

const config = require('./config');
const loaders = require('./webpack.loaders');
const plugins = require('./webpack.plugins');

module.exports = {
  context: path.join(config.root, config.paths.src),
  entry: path.join(config.root, config.paths.src, 'index.js'),
  output: {
    path: path.join(config.root, config.paths.dist),
    filename: '[name].[hash].js',
  },
  mode: config.isProd ? 'production' : 'development',
  devtool: config.isProd ? 'hidden-source-map' : 'cheap-eval-source-map',
  devServer: {
    contentBase: path.join(config.root, config.paths.src),
    watchContentBase: true,
    hot: true,
    open: true,
    port: config.port,
    host: config.devHost,
    quiet: true,
    clientLogLevel: 'silent',
  },
  module: {
    rules: loaders,
  },
  plugins,
};
