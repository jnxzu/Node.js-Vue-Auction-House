module.exports = (app) => {
  const fs = require("fs");
  const path = require("path");
  const https = require("https");
  return https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, "my.key")),
      cert: fs.readFileSync(path.join(__dirname, "my.crt")),
    },
    app
  );
};
