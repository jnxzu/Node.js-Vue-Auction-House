const express = require("express");
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");

const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);
require("./config/socket.io")(io); // socket.io config

const routes = require("./config/routes"); // routing config

app.use(bodyParser.json());
app.use(serveStatic("../src/public"));
app.use(routes);

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
