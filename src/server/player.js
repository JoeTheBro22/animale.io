const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');
const constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
    this.tier = 0;
    this.radius = Constants.PLAYER_RADIUS;
    this.boostCooldown = Constants.BOOST_COOLDOWN;
    this.maxSpeed = Constants.PLAYER_SPEED;
    this.devPowers = false;
    this.rareNumber = Math.random() * 2;
    this.damageCooldown = 2;
    this.abilityCooldown = 3;
    this.canvasWidth = 5000;
    this.canvasHeight = 5000;
    this.preparingJump = false;
    this.animalType = 0;
    this.message = '';
    this.callDev = false;
    this.autoBoost = false;
    this.frenzyActive = false;
    this.frenzyTimer = 0;
    this.localMessage = '';
    this.keyPressed = '';
    this.grazing = false;
    this.jump = false;
    this.jumpCounter = 0;
    this.invincible = false;
    this.flightSizeOffset = 1;
    this.slimeBallSlow = false;
    this.slimeBallSlowCounter = 0;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);
    this.checkWaterSpeed();
    this.damageCooldown -= dt;
    this.abilityCooldown -= dt;
    this.frenzyTimer -= dt;

    if(this.jump && this.jumpCounter < 30){
      this.preparingJump = false;
      this.Jump();
    }

    if(this.slimeBallSlow){
      if(this.CheckSlimeBallSlow()){
        this.slimeBallSlow = false;
      }
    }

    if(this.jumpCounter >= 30){
      this.jump = false;
      this.invincible = false;
    }

    if(this.frenzyTimer < 0 || this.tier != 3){
      var changeFrenzyDetector = this.frenzyActive;
      this.frenzyActive = false;
      if(changeFrenzyDetector != this.frenzyActive){
        this.localMessage = '';
      }
    } else{
      if(this.frenzyTimer >= 0){
        this.localMessage = "Frenzy active! " + Math.ceil(this.frenzyTimer) + " second(s) left!";
      }
    }

    if(this.hp != Constants.PLAYER_MAX_HP || this.tier != 8){
      this.grazing = false;
    }

    if(this.grazing){
      var changeGrazingDetector = false;
      this.score += dt * Constants.GRAZING_XP * this.speed/this.maxSpeed;
      this.localMessage = "Grazing Active! Move around to get XP!";
    } else{
      if(!changeGrazingDetector){
        changeGrazingDetector = true;
        this.localMessage = '';
      }
    }

    if(this.preparingJump && this.tier == 9){
      this.localMessage = "Preparing Jump! Press the Q key again to jump in your mouse's direction!";
    }

    // Update score
    //this.score += dt * Constants.SCORE_PER_SECOND;

    // Update tier based on XP
    if(this.score < Constants.TIER_2_XP){
      this.tier = 0;
    }    else if (this.score < Constants.TIER_3_XP){
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
      if(this.animalType == 0){
        this.x = 100;
        this.y = 100;
        this.animalType = 1;
      }
    }

    this.radius = Constants.RelativeSizes[this.tier] * Constants.PLAYER_RADIUS;
    this.boostCooldown -= dt;

    // Auto Boost if needed
    if(this.boostCooldown <= 0 && this.autoBoost){
      this.x += 35 * Math.sin(this.direction);
      this.y -= 35 * Math.cos(this.direction);
      this.boostCooldown = Constants.BOOST_COOLDOWN;
    }
    
    // Make sure the player stays in bounds
    this.x = Math.max(this.radius, Math.min(Constants.MAP_SIZE - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(Constants.MAP_SIZE - this.radius, this.y));

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
      //return new Bullet(this.id, this.x, this.y, this.direction);
    }

    return null;
  }

  checkWaterSpeed(){
    // Check if the player is in water
    if(this.x <= Constants.MAP_SIZE / 2 && this.y <= Constants.MAP_SIZE / 2){ // If we are in the water
      if(this.tier != 15){
        this.maxSpeed = 20;
      } else {
        this.maxSpeed = 100;
      }
      
    } else{
      if(this.tier != 15){ // this is for when i allow the fish to go on land
        this.maxSpeed = 100;
      } else {
        this.takeLavaDamage();
        this.maxSpeed = 20;
      }
    }
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  setSpeed(x, y, canvasWidth, canvasHeight) {
    if(this.grazing || (this.preparingJump && this.tier == 9)){
      this.speed = 2 * this.maxSpeed * Math.abs(Math.sqrt((x - canvasWidth/2) * (x - canvasWidth/2) / canvasWidth / canvasWidth + (y - canvasHeight/2) * (y - canvasHeight/2) / canvasHeight / canvasHeight));

      if(this.speed * 5 > this.maxSpeed){
        this.speed = this.maxSpeed/5;
      }
    } else if(this.slimeBallSlow){
      this.speed = 5 * this.maxSpeed * Math.abs(Math.sqrt((x - canvasWidth/2) * (x - canvasWidth/2) / canvasWidth / canvasWidth + (y - canvasHeight/2) * (y - canvasHeight/2) / canvasHeight / canvasHeight));

      if(this.speed * 2 > this.maxSpeed){
        this.speed = this.maxSpeed/2;
      }
    } else{
      this.speed = 10 * this.maxSpeed * Math.abs(Math.sqrt((x - canvasWidth/2) * (x - canvasWidth/2) / canvasWidth / canvasWidth + (y - canvasHeight/2) * (y - canvasHeight/2) / canvasHeight / canvasHeight)); 

      if(this.speed > this.maxSpeed){
        this.speed = this.maxSpeed;
      }
    }
  }

  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  takeLavaDamage() {
    /*if(this.devPowers == false){ // People with dev don't take lava dmg
      this.hp -= Constants.LAVA_DAMAGE;
    }*/
    this.hp -= Constants.LAVA_DAMAGE;
  }

  takeHitDamage() {
    if(this.damageCooldown <= 0){
      this.hp -= Constants.HIT_DAMAGE;
      this.damageCooldown = Constants.PLAYER_DAMAGE_COOLDOWN;
    }
  }

  takeProjectileDamage(amount) {
    if(this.damageCooldown <= 0){
      this.hp -= amount;
      this.damageCooldown = Constants.PLAYER_DAMAGE_COOLDOWN;
    }
  }

  getKillXP(otherPlayerScore) {
    if(this.frenzyActive){
      this.score += 2 * Math.floor(otherPlayerScore);
    } else{
      this.score += Math.floor(otherPlayerScore);
    }
  }

  regenHP() {
    this.hp += Constants.REGEN_AMOUNT;
  }

  takeKnockback(direction, x, y) {
    // If it is a tail bite, then use the smaller player's direction
    // Otherwise, use the bigger player's direction
    // Use the negative values to knock back the players.
    if(x == null || x == undefined){
      this.x += Math.sin(direction);
      this.y -= Math.cos(direction);
    } else{
      this.x += x;
      this.y += y;
    }
  }
  
  giveBerryXP() {
    if(this.frenzyActive){
      this.frenzyTimer++;
      this.score += 2 * Constants.BERRY_XP;
    } else{
      this.score += Constants.BERRY_XP;
    }
  }

  giveMelonXP() {
    if(this.frenzyActive){
      this.frenzyTimer++;
      this.score += 2 * Constants.MELON_XP;
    } else{
      this.score += Constants.MELON_XP;
    }
  }

  giveBlackberryXP() {
    this.score += Constants.BLACKBERRY_XP;
  }

  giveCarrotXP() {
    if(this.frenzyActive){
      this.frenzyTimer++;
      this.score += 2 * Constants.CARROT_XP;
    } else{
      this.score += Constants.CARROT_XP;
    }
  }
  
  giveLilypadXP() {
    this.score += Constants.LILYPAD_XP;
  }

  giveRedMushroomXP() {
    this.score += Constants.RED_MUSHROOM_XP;
  }
  
  giveWatermelonSliceXP() {
    this.score += Constants.WATERMELON_SLICE_XP;
  }

  giveBananaXP() {
    this.score += Constants.BANANA_XP;
  }
  
  giveCoconutXP() {
    this.score += Constants.COCONUT_XP;
  }

  givePearXP() {
    this.score += Constants.PEAR_XP;
  }
  
  giveMushroomBushXP() {
    this.score += Constants.MUSHROOM_BUSH_XP;
  }

  giveWatermelonXP() {
    this.score += Constants.WATERMELON_XP;
  }

  giveMushroomXP() {
    if(this.frenzyActive){
      this.frenzyTimer++;
      this.score += 2 * Constants.MUSHROOM_XP;
    } else{
      this.score += Constants.MUSHROOM_XP;
    }
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }
  
  getTier(){
    return this.tier;
  }

  prepareJump(){
    this.jumpCounter = 0;
    this.jump = true;
    this.preparingJump = false;
  }

  Jump(){
    this.invincible = true;
    this.x += 6 * Math.sin(this.direction); // Remember, these will be multiplied by 30 as they are called 30 times
    this.y -= 6 * Math.cos(this.direction);
    this.flightSizeOffset = (Math.abs(15 - Math.abs(this.jumpCounter - 15)))/100 + 1;
    this.jumpCounter++;
  }

  CheckSlimeBallSlow(){
    if(this.slimeBallSlowCounter < 180){
      this.slimeBallSlowCounter++;
      return false;
    } else{
      this.slimeBallSlowCounter = 0;
      return true;
    }
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      username: this.username,
      direction: this.direction,
      hp: this.hp,
      tier: this.tier,
      score: this.score,
      radius: this.radius,
      boostCooldown: this.boostCooldown,
      rareNumber: this.rareNumber,
      damageCooldown: this.damageCooldown,
      message: this.message,
      frenzyTimer: this.frenzyTimer,
      frenzyActive: this.frenzyActive,
      localMessage: this.localMessage,
      newMessageDT: this.newMessageDT,
      newMessageStart: this.newMessageStart,
      keyPressed: this.keyPressed,
      abilityCooldown: this.abilityCooldown,
      grazing: this.grazing,
      preparingJump: this.preparingJump,
      invincible: this.invincible,
      flightSizeOffset: this.flightSizeOffset,
    };
  }
}
module.exports = Player;
