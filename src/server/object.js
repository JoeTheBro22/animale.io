const Constants = require("../shared/constants");

class Object {
  constructor(id, x, y, dir, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.speed = speed;
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
    this.direction = dir;
  }

  boost(boostCooldown) {
    if(boostCooldown <= 0){
      this.x += 35 * Math.sin(this.direction);
      this.y -= 35 * Math.cos(this.direction);
      if(this.devPowers){
        this.score = this.score * 2;
      }
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
    };
  }
}

module.exports = Object;
