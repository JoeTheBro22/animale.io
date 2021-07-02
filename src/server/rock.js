const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Rock extends ObjectClass {
  constructor(x, y) {
    super(shortid(), x, y, 0, 0);
  }
}

module.exports = Rock;
