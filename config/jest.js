const jest = require('jest');

const jestConfig = require('../jest.config');

const argv = process.argv.slice(2);

if (!process.env.CI && argv.indexOf('--coverage') === -1 && argv.indexOf('--watchAll') === -1) {
  argv.push('--watch');
}

argv.push('--config', JSON.stringify(jestConfig));

jest.run(argv);
