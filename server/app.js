const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const moment = require('moment');

const app = express();
// const server = require('./config/https')(app);
const server = require('http').createServer(app);

const io = require('socket.io')(server);
// require('./config/socket.io')(io);

const routes = require('./config/routes')(io);

app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: 'secretive',
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

const Auction = require('./models/auction');
const User = require('./models/user');

io.on('connection', (socket) => {
  socket.on('bidOrBuy', (item, qb, price, user, prevTopBid) => {
    if (user) {
      User.findOne({ username: user }).then((u) => {
        const firstOperation = qb // auction update operation depending on type of auction
          ? {
            $set: { topBid: u._id, finished: true, expiry: moment() },
            $push: { allBids: u._id },
          }
          : {
            $set: { topBid: u._id, price },
            $push: { allBids: u._id },
          };

        Auction.findOneAndUpdate({ item }, firstOperation).then((a) => {
          const secondOperation = qb // user update operation depending on type of auction
            ? {
              $push: {
                allBids: a._id,
                topBids: a._id,
              },
            }
            : { $push: { allBids: a._id } };

          User.findByIdAndUpdate(u._id, secondOperation).then(() => {
            if (qb) {
              console.log(
                `${moment().format(
                  'MMMM Do YYYY, h:mm:ss a',
                )} - ${user} bought ${a.item} for ${a.price}.`,
              );
            } else {
              console.log(
                `${moment().format('MMMM Do YYYY, h:mm:ss a')} - ${user} bid ${
                  a.price
                } for ${a.item}.`,
              );
            }
            if (prevTopBid) io.sockets.emit('outBid', prevTopBid, item, user);
            io.sockets.emit('updateListing', item, u.username, price);
          });
        });
      });
    }
  });
});

const port = process.env.PORT || 3000;

// server.listen(port,() => {
//   console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - Server live. https://localhost:${port}`);
// });

server.listen(port, () => {
  console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - Server live.`);
});
