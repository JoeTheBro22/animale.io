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
    this.flying = false;
    this.flyingTimer = 0;
    this.stomped = false;
    this.stompedCounter = 0;
    this.flyingChanged = false;
    this.otherAbilityCooldown = 0;
    this.poisoned = 0;
    this.poisonedTimer = 0;
    this.xpCooldown = 0;
    this.scoreLock = false;
    this.scoreLockXP = 0;
    this.onLake = false;
  }

  update(dt) {
    super.update(dt);
    this.checkWaterSpeed();
    this.damageCooldown -= dt;
    this.abilityCooldown -= dt;
    this.otherAbilityCooldown -= dt;
    this.frenzyTimer -= dt;
    this.xpCooldown -= dt;

    if(this.jump && this.jumpCounter < 30){
      this.preparingJump = false;
      this.Jump();
    }

    if(this.slimeBallSlow){
      if(this.CheckSlimeBallSlow()){
        this.slimeBallSlow = false;
      }
    }

    if(this.stomped){
      this.maxSpeed = 20;
      if(this.CheckStomped()){
        this.stomped = false;
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

    var changeGrazingDetector;

    if(this.hp != Constants.PLAYER_MAX_HP || this.tier != 8){
      changeGrazingDetector = false;
      this.grazing = false;
    }

    if(this.grazing){
      changeGrazingDetector = true;
      this.score += dt * Constants.GRAZING_XP * this.speed/this.maxSpeed;
      this.localMessage = "Grazing Active! Move around to get XP!";
    } else{
      if(changeGrazingDetector){
        changeGrazingDetector = false;
        this.localMessage = '';
      }
    }

    if(this.preparingJump && this.tier == 9){
      this.localMessage = "Preparing Jump! Press the Q key again to jump in your mouse's direction!";
    } else if (this.jump){
      this.localMessage = '';
    }

    if(this.invincible){
      this.poisoned = false;
    }

    if(this.score < 0){
      this.score = 0;
    }

    if(this.poisoned > 0){
      this.poisonedTimer++;
      if(this.poisonedTimer/40 == Math.floor(this.poisonedTimer/40) || this.poisonedTimer/40 == Math.ceil(this.poisonedTimer/40)){
        if(this.tier == 15){
          this.hp -= Constants.VENOM_DAMAGE/3 * this.poisoned;
        } else {
          this.hp -= Constants.VENOM_DAMAGE * this.poisoned;
        }
      }

      if(this.poisonedTimer >= 180){
        this.poisoned = 0;
      }
    }

    /*if(this.tier == 6){
      if(this.flying){
        this.flightSizeOffset = 1.5;
        this.invincible = true;
        this.localMessage = "Flying Active! Move your cursor to fly around!";
        this.flying = true;

        if(this.changeFlyingState){
          this.flying = false;
          this.localMessage = '';
          this.invincible = false;
          this.flyingTimer = 0;
        } else {
          this.flyingTimer++;
        }
      }
    }*/

    if(this.flyingTimer > 900 || this.tier != 6){
      if(this.flying){
        this.flyingChanged = true;
      }
      this.flying = false;
    } else {
      this.flyingTimer++;
    }

    if(this.flyingChanged){
      if(this.flying){ // This means that flying has changed from false to true; we should start flying
        this.flightSizeOffset = 1.5;
        this.invincible = true;
        this.localMessage = "Flying Active! Move your cursor to fly around!";
        this.flying = true;
      } else{
        this.flying = false;
        this.flightSizeOffset = 1;
        this.localMessage = '';
        this.invincible = false;
        this.flyingTimer = 0;
      }
      this.flyingChanged = false;
    }

    // Update score
    //this.score += dt * Constants.SCORE_PER_SECOND;

    // Update tier based on XP
    var changeTierDetector = this.tier;

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

    if(this.tier != changeTierDetector){
      // We have detected a change in tier
      this.preparingJump = false;
      this.grazing = false;
      this.jump = false;
      this.localMessage = '';
      this.jumpCounter = 0;
      this.invincible = false;
      this.flightSizeOffset = 1;
      this.slimeBallSlow = false;
      this.flying = false;
      this.stomped = false;
    }

    this.radius = Constants.RelativeSizes[this.tier] * Constants.PLAYER_RADIUS;
    this.boostCooldown -= dt;

    // Auto Boost if needed
    if(this.boostCooldown <= 0 && this.autoBoost){
      this.x += 35 * Math.sin(this.direction) * this.speed/100;
      this.y -= 35 * Math.cos(this.direction) * this.speed/100;
      if(this.tier != 10){
        this.boostCooldown = Constants.BOOST_COOLDOWN;
      } else{
        this.boostCooldown = Constants.BOOST_COOLDOWN/2;
      }
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
    if(!this.flying){
      if(this.x <= Constants.MAP_SIZE / 2 && this.y <= Constants.MAP_SIZE / 2){ // If we are in the water
        if(this.tier != 15){
          this.maxSpeed = 20;
        } else {
          this.maxSpeed = 100;
        }
        
      } else{
        if(this.tier != 15){
          this.maxSpeed = 100;
        } else {
          this.takeLavaDamage();
          this.maxSpeed = 20;
        }
      }
    }
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
    this.stomped = false;
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
    } else if(this.flying){
      this.speed = 25 * this.maxSpeed * Math.abs(Math.sqrt((x - canvasWidth/2) * (x - canvasWidth/2) / canvasWidth / canvasWidth + (y - canvasHeight/2) * (y - canvasHeight/2) / canvasHeight / canvasHeight)); 

      if(this.speed > this.maxSpeed * 2.5){
        this.speed = this.maxSpeed * 2.5;
      }
    } else if(this.onLake && this.tier != 4 && this.tier < 13){
      this.speed = 5 * this.maxSpeed * Math.abs(Math.sqrt((x - canvasWidth/2) * (x - canvasWidth/2) / canvasWidth / canvasWidth + (y - canvasHeight/2) * (y - canvasHeight/2) / canvasHeight / canvasHeight)); 

      if(this.speed > this.maxSpeed * 0.5){
        this.speed = this.maxSpeed * 0.5;
      }
    } else{
      this.speed = 10 * this.maxSpeed * Math.abs(Math.sqrt((x - canvasWidth/2) * (x - canvasWidth/2) / canvasWidth / canvasWidth + (y - canvasHeight/2) * (y - canvasHeight/2) / canvasHeight / canvasHeight)); 

      if(this.speed > this.maxSpeed){
        this.speed = this.maxSpeed;
      }
    }

    if(this.scoreLock){
      this.score = this.scoreLockXP;
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
      this.stomped = false;
      this.damageCooldown = Constants.PLAYER_DAMAGE_COOLDOWN;
    }
  }

  takeProjectileDamage(amount) {
    if(this.damageCooldown <= 0){
      this.hp -= amount;
      this.stomped = false;
      this.damageCooldown = Constants.PLAYER_DAMAGE_COOLDOWN;
    }
  }

  getKillXP(otherPlayerScore) {
    if(this.xpCooldown < 0){
      if(this.frenzyActive){
        this.score += 2 * Math.floor(otherPlayerScore);
      } else{
        this.score += Math.floor(otherPlayerScore);
      }
    }
    this.xpCooldown = 0.5;
  }

  regenHP() {
    this.hp += Constants.REGEN_AMOUNT;
  }

  takeKnockback(direction, x, y) {
    // If it is a tail bite, then use the smaller player's direction
    // Otherwise, use the bigger player's direction
    // Use the negative values to knock back the players.
    if((x == null || x == undefined) && this.damageCooldown <= 0){
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
    if(this.tier >= 14){
      this.score += Constants.MUSHROOM_BUSH_XP;
    } else {
      this.score += Constants.MUSHROOM_BUSH_XP/3;
    }
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

  CheckStomped(){
    if(this.stompedCounter < 180){
      this.stompedCounter++;
      return false;
    } else{
      this.stompedCounter = 0;
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
      flying: this.flying,
      flyingTimer: this.flyingTimer,
      stomped: this.stomped,
      flyingChanged: this.flyingChanged,
      otherAbilityCooldown: this.otherAbilityCooldown,
      poisoned: this.poisoned,
      poisonedTimer: this.poisonedTimer,
      scoreLock: this.scoreLock,
      scoreLockXP: this.scoreLockXP,
      jump: this.jump,
      onLake: this.onLake,
    };
  }
}
module.exports = Player;
