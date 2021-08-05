const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Projectle extends ObjectClass {
  constructor(parentID, x, y, dir) {
    super(shortid(), x, y, dir, Constants.BULLET_SPEED);
    this.parentID = parentID;
    this.startTime = Date.now();
    this.currentTime = Date.now();
  }
    
  // Returns true if the projectile should be destroyed
  update(dt) {
    this.currentTime += dt;
    if(Math.abs(this.currentTime - this.startTime) >= 3){
      return true;
    }
    this.x += dt * Constants.MAGEBALL_SPEED * Math.sin(this.direction);
    this.y -= dt * Constants.MAGEBALL_SPEED * Math.cos(this.direction);
    return this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE;
  }
}

module.exports = Projectle;
