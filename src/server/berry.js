const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Berry extends ObjectClass {
  constructor(x, y, speed, direction) {
    super(shortid(), x, y, speed, direction);
  }
}

module.exports = Berry;
