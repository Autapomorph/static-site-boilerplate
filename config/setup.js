/* eslint-disable no-console, no-param-reassign, no-shadow, no-useless-concat */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const clear = require('clear');
const { prompt } = require('enquirer');

const config = require('./config');

const skipSetup = process.env.CI || false;

// returns regex /ENV_VAR\s*=\s*(?:'|")?.*(?:'|")?/g
const envVarRegex = envVar => new RegExp(`${envVar[0]}\\s*=\\s*(?:'|")?.*(?:'|")?`, 'g');

async function askQuestions() {
  clear();
  console.log('Static Site Boilerplate');

  return prompt([
    {
      type: 'input',
      name: 'siteName',
      message: 'What is the name of your website?',
    },
    {
      type: 'input',
      name: 'siteDescription',
      message: 'What is a description of your website?',
    },
    {
      type: 'input',
      name: 'siteUrl',
      message: 'What is the live URL for your website?',
    },
    {
      type: 'select',
      name: 'cssResetLib',
      message: 'Which CSS reset library would you like installed?',
      choices: ['None', 'normalize.css', 'reset.css', 'sanitize.css'],
    },
  ]);
}

function createEnv() {
  if (!fs.existsSync(path.join(config.root, '.env'))) {
    fs.copyFileSync(path.join(config.root, '.env.example'), path.join(config.root, '.env'));
  }
}

function updateEnv({ siteName, siteDescription, siteUrl }) {
  fs.readFile(path.join(config.root, '.env'), 'utf8', (err, data) => {
    if (err) console.error(err);

    if (typeof siteName !== 'undefined') {
      data = data.replace(envVarRegex`SITE_NAME`, `SITE_NAME="${siteName}"`);
    }

    if (typeof siteDescription !== 'undefined') {
      data = data.replace(envVarRegex`SITE_DESC`, `SITE_DESC="${siteDescription}"`);
    }

    if (typeof siteUrl !== 'undefined') {
      data = data.replace(envVarRegex`SITE_URL`, `SITE_URL="${siteUrl}"`);
    }

    fs.writeFile(path.join(config.root, '.env'), data, 'utf8', err => {
      if (err) console.error(err);
    });
  });
}

function injectCSSResetLib(cssResetLib) {
  if (typeof cssResetLib !== 'undefined' && cssResetLib !== 'None') {
    fs.readFile(path.join(config.root, '/src/styles/index.scss'), 'utf8', (err, data) => {
      if (err) console.error(err);

      const cssContent = `// ${cssResetLib}\n` + `@import '~${cssResetLib}';\n`;
      data = `${cssContent}\n${data}`;

      fs.writeFile(path.join(config.root, '/src/styles/index.scss'), data, err => {
        if (err) console.error(err);
      });
    });
  }
}

async function runSetup() {
  const { siteName, siteDescription, siteUrl, cssResetLib } = await askQuestions();

  createEnv();
  updateEnv({ siteName, siteDescription, siteUrl });
  injectCSSResetLib(cssResetLib);
}

if (!skipSetup) {
  runSetup();
}
