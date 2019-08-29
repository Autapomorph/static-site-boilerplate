const path = require('path');
const FtpDeploy = require('ftp-deploy');

const config = require('./config');

const ftpDeploy = new FtpDeploy();

ftpDeploy.deploy({
  user: 'username',
  password: 'password',
  host: 'ftp.yourwebsite.com',
  port: 21,
  localRoot: path.join(config.root, config.paths.dist),
  remoteRoot: '/public_html/',
  include: ['**/*'],
  deleteRemote: true,
  forcePasv: true,
});
