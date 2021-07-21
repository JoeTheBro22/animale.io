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

  setSpeed(x, y, canvasWidth, canvasHeight) {
    this.speed = 1000 * Math.abs(Math.sqrt((x - canvasWidth/2) * (x - canvasWidth/2) / canvasWidth / canvasWidth + (y - canvasHeight/2) * (y - canvasHeight/2) / canvasHeight / canvasHeight)); 
    if(this.speed > 100){
      this.speed = 100;
    }
  }

  boost(boostCooldown) {
    if(boostCooldown <= 0){
      this.x += 50 * Math.sin(this.direction);
      this.y -= 50 * Math.cos(this.direction);
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
