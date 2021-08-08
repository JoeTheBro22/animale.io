const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Projectle extends ObjectClass {
  constructor(parentID, x, y, dir, speed, lifeSpan, bounceX, bounceY) {
    super(shortid(), x, y, dir, speed, lifeSpan);
    this.parentID = parentID;
    this.startTime = Date.now();
    this.currentTime = Date.now();
    this.speed = speed;
    this.lifeSpan = lifeSpan;
    this.bounceX = true;
    this.bounceY = true;
  }
    
  // Returns true if the projectile should be destroyed
  update(dt) {
    this.currentTime += dt;
    if(Math.abs(this.currentTime - this.startTime) >= this.lifeSpan){
      return true;
    }
    this.x += dt * this.speed * Math.sin(this.direction);
    this.y -= dt * this.speed * Math.cos(this.direction);
    if(this.x < 0 || this.x > Constants.MAP_SIZE){
      if(this.bounceX){
        this.direction = -this.direction;
        this.bounceX = false;
      }
    } else if(this.y < 0 || this.y > Constants.MAP_SIZE){
      if(this.bounceY){
        if(this.direction < 0){
          this.direction = this.direction + Math.PI/2;
        } else{
          this.direction = this.direction - Math.PI/2;
        }
        this.bounceY = false;
      }
      
    }

    return this.x < -50 || this.x > Constants.MAP_SIZE + 50 || this.y < -50 || this.y > Constants.MAP_SIZE + 50;
  }

  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

module.exports = Projectle;
