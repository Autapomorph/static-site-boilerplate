const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('./config');

// Define common loader constants
const isProd = config.env === 'production';
const sourceMap = !isProd;

// HTML loaders
const html = {
  test: /\.(html)$/,
  use: [
    {
      loader: 'html-loader',
      options: {
        interpolate: true,
      },
    },
  ],
};

// JavaScript loaders
const js = {
  test: /\.js(x)?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
    },
    'eslint-loader',
  ],
};

// Style loaders
const styleLoader = {
  loader: 'style-loader',
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap,
  },
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap,
  },
};

const css = {
  test: /\.css$/,
  use: [isProd ? MiniCssExtractPlugin.loader : styleLoader, cssLoader, postcssLoader],
};

const sass = {
  test: /\.s[c|a]ss$/,
  use: [
    isProd ? MiniCssExtractPlugin.loader : styleLoader,
    cssLoader,
    postcssLoader,
    {
      loader: 'sass-loader',
      options: {
        sourceMap,
      },
    },
  ],
};

// Image loaders
const imageLoader = {
  loader: 'image-webpack-loader',
  options: {
    bypassOnDebug: true,
    gifsicle: {
      interlaced: false,
    },
    optipng: {
      optimizationLevel: 7,
    },
    pngquant: {
      quality: '65-90',
      speed: 4,
    },
    mozjpeg: {
      progressive: true,
    },
  },
};

const images = {
  test: /\.(gif|png|jpe?g|svg)$/i,
  exclude: /fonts/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 8192,
        loader: 'file-loader',

        // file-loader options
        name: '[name].[hash].[ext]',
        outputPath: 'images/',
      },
    },
    isProd ? imageLoader : null,
  ].filter(Boolean),
};

// Video loaders
const videos = {
  test: /\.(mp4|webm)$/,
  use: [
    {
      loader: 'file-loader',
      query: {
        name: '[name].[hash].[ext]',
        outputPath: 'images/',
      },
    },
  ],
};

// Font loaders
const fonts = {
  test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
  exclude: /images/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]',
        outputPath: 'fonts/',
      },
    },
  ],
};

module.exports = [html, js, css, sass, images, videos, fonts];
