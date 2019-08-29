require('dotenv').config();
const path = require('path');

const root = path.resolve(__dirname, '../');

const config = {
  // Your website's name, used for favicon meta tags
  siteName: process.env.SITE_NAME || 'Static Site Boilerplate',

  // Your website's description, used for favicon meta tags
  siteDescription: process.env.SITE_DESC || 'A modern boilerplate for static website development',

  // Your website's URL, used for sitemap
  siteUrl: process.env.SITE_URL || 'http://staticsiteboilerplate.com',

  // The viewport meta tag added to your HTML page's <head> tag
  viewport: 'width=device-width,initial-scale=1',

  // Source file for favicon generation. 512x512px recommended.
  favicon: path.join(root, '/src/images/favicon.png'),

  // Local development URL
  devHost: process.env.HOST || 'localhost',

  // Local development port
  port: process.env.PORT || 8080,

  // Advanced configuration, edit with caution!
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  root,
  paths: {
    config: 'config',
    src: 'src',
    dist: 'dist',
  },
};

module.exports = config;
