const Constants = require("../shared/constants");

class Object {
  constructor(id, x, y, dir, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.speed = speed;
    this.recentDirectionArray = [0, 0];
    this.lastDirection = 0;
  }

  update(dt) {
    this.x += dt * this.speed * Math.sin(this.direction);
    this.y -= dt * this.speed * Math.cos(this.direction);
  }

  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  setDirection(dir) {
    
    // Making this.direction equal to the direction of the call before it
    /*this.recentDirectionArray.push(dir);
    while(this.recentDirectionArray.length >= 5){
      this.recentDirectionArray.shift();
    }

    this.direction = (this.recentDirectionArray[0] + dir)/2;*/
    
    this.direction = dir;
  }

  boost(boostCooldown, autoBoost) {
    if(!autoBoost && boostCooldown <= 0){
      this.x += 35 * Math.sin(this.direction);
      this.y -= 35 * Math.cos(this.direction);
      /*if(this.devPowers){
        this.score = this.score * 2;
      }*/
      return true;
    } else{
      return false;
    }
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      direction: this.direction,
    };
  }
}

module.exports = Object;
