const cssnano = require('cssnano');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

// webpack plugins
const WebpackBar = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;

const config = require('./config');

// Define common constants
const isProd = config.env === 'production';

// Environment variables
const env = new DotenvWebpackPlugin();

// Optimize CSS assets
const optimizeCss = new OptimizeCssAssetsPlugin({
  assetNameRegExp: /\.css$/g,
  cssProcessor: cssnano,
  cssProcessorPluginOptions: {
    preset: [
      'default',
      {
        discardComments: {
          removeAll: true,
        },
      },
    ],
  },
  canPrint: true,
});

// Generate robots.txt
const robots = new RobotstxtPlugin({
  sitemap: `${config.siteUrl}/sitemap.xml`,
  host: config.siteUrl,
});

// Clean webpack
const clean = new CleanWebpackPlugin();

// Stylelint
const stylelint = new StyleLintPlugin();

// Extract CSS
const cssExtract = new MiniCssExtractPlugin({
  filename: 'style.[contenthash].css',
});

// HTML generation
const paths = [];
const generateHTMLPlugins = () =>
  glob.sync('./src/**/*.html').map(dir => {
    const filepath = path.resolve(dir);
    const filename = path.basename(dir);

    if (filename !== '404.html') {
      paths.push(filename);
    }

    return new HTMLWebpackPlugin({
      filename,
      template: filepath,
      meta: {
        viewport: config.viewport,
      },
    });
  });

// Sitemap
const sitemap = new SitemapPlugin(config.siteUrl, paths, {
  priority: 1.0,
  lastmodrealtime: true,
});

// Favicons
const favicons = new WebappWebpackPlugin({
  logo: config.favicon,
  prefix: 'images/favicons/',
  favicons: {
    appName: config.siteName,
    appDescription: config.siteDescription,
    developerName: null,
    developerURL: null,
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      coast: false,
      favicons: true,
      firefox: false,
      windows: false,
      yandex: false,
    },
  },
});

// Images
const imagesCopy = new CopyPlugin([
  {
    from: path.join(config.root, config.paths.src, 'images'),
    to: 'images',
  },
]);

const imagesMin = new ImageminPlugin({
  test: /\.(jpe?g|png|gif|svg)$/i,
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
  plugins: [
    imageminMozjpeg({
      progressive: true,
    }),
  ],
});

// Webpack bar
const webpackBar = new WebpackBar({
  color: '#ff6469',
});

// Friendly Errors
const friendlyErrors = new FriendlyErrorsWebpackPlugin();

module.exports = [
  isProd && clean,
  env,
  stylelint,
  cssExtract,
  ...generateHTMLPlugins(),
  fs.existsSync(config.favicon) && favicons,
  isProd && imagesCopy,
  isProd && imagesMin,
  isProd && optimizeCss,
  isProd && robots,
  isProd && sitemap,
  webpackBar,
  friendlyErrors,
].filter(Boolean);
