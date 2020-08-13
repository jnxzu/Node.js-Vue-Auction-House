const fs = require('fs');
const path = require('path');
const https = require('https');

module.exports = (app) => https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, 'my.key')),
    cert: fs.readFileSync(path.join(__dirname, 'my.crt')),
  },
  app,
);
