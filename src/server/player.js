const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y, tier) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
    this.tier = 0;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Update tier based on XP
    if(this.score < Constants.TIER_2_XP){
      this.tier = 0;
    } 
    else if (this.score < Constants.TIER_3_XP){
      this.tier = 1;
    }    else if (this.score < Constants.TIER_4_XP){
      this.tier = 2;
    }    else if (this.score < Constants.TIER_5_XP){
      this.tier = 3;
    }    else if (this.score < Constants.TIER_6_XP){
      this.tier = 4;
    }    else if (this.score < Constants.TIER_7_XP){
      this.tier = 5;
    }    else if (this.score < Constants.TIER_8_XP){
      this.tier = 6;
    }    else if (this.score < Constants.TIER_9_XP){
      this.tier = 7;
    }    else if (this.score < Constants.TIER_10_XP){
      this.tier = 8;
    }    else if (this.score < Constants.TIER_11_XP){
      this.tier = 9;
    }    else if (this.score < Constants.TIER_12_XP){
      this.tier = 10;
    }    else if (this.score < Constants.TIER_13_XP){
      this.tier = 11;
    }    else if (this.score < Constants.TIER_14_XP){
      this.tier = 12;
    }    else if (this.score < Constants.TIER_15_XP){
      this.tier = 13;
    }    else if (this.score < Constants.TIER_16_XP){
      this.tier = 14;
    } else{
      this.tier = 15;
    }

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // Regen HP
    if(this.hp < Constants.PLAYER_MAX_HP){
      this.hp += Constants.REGEN_AMOUNT;
    } else{
      this.hp = Constants.PLAYER_MAX_HP;
    }

    // Fire a bullet, if needed
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      return new Bullet(this.id, this.x, this.y, this.direction);
    }

    return null;
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  takeLavaDamage() {
    this.hp -= Constants.LAVA_DAMAGE;
  }

  takeHitDamage() {
    this.hp -= Constants.HIT_DAMAGE;
  }

  getKillXP(otherPlayerScore) {
    this.score += Math.floor(otherPlayerScore); 
  }

  regenHP() {
    this.hp += Constants.REGEN_AMOUNT;
  }

  takeKnockback(deltaTime) {
    this.x -= 20 * deltaTime * this.speed * Math.sin(this.direction);
    this.y += 20 * deltaTime * this.speed * Math.cos(this.direction);
  }
  
  giveBerryXP() {
    this.score += Constants.BERRY_XP;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }
  
  getTier(){
    return this.tier;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
      tier: this.tier,
    };
  }
}
module.exports = Player;
