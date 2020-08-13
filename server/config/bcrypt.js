const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

const hash = (pswd) => bcrypt.hashSync(pswd, salt);

const compare = (pswd, hash) => bcrypt.compareSync(pswd, hash);

module.exports = {
  hash,
  compare,
};
