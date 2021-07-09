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

  boost(dt, cooldown, boostCooldown) {
    cooldown -= dt;
    if(cooldown <= -boostCooldown){
      this.x += 0.5 * this.speed * Math.sin(this.direction);
      this.y -= 0.5 * this.speed * Math.cos(this.direction);
      cooldown = 0;
      return true;
    } else{
      return false;
    }
    //console.log(cooldown);
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
