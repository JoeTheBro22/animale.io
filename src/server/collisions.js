const e = require('express');
const { debug } = require('webpack');
const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
/*function applyCollisions(players, bullets) {
  const destroyedBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < players.length; j++) {
      const bullet = bullets[i];
      const player = players[j];
      if (
        bullet.parentID !== player.id &&
        player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet);
        player.takeBulletDamage();
        break;
      }
    }
  }
  return destroyedBullets;
}

function regenHP(players){
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    player.regenHP();
  }
}*/

function applyCollisions(players, otherObj, collisionType/*, playerSize, otherObjSize*/, deltaTime, playerTier) {
  const destroyedObj = [];
  //let otherObjSize = 1;
  for (let i = 0; i < otherObj.length; i++) {
    for (let j = 0; j < players.length; j++) {
      const otherObject = otherObj[i];
      const player = players[j];
      let nonPlayerRadius = 0;
      let playerRadius = Constants.PLAYER_RADIUS;
      playerRadius = Constants.RelativeSizes[playerTier] * Constants.PLAYER_RADIUS;
      if(collisionType == 0){
        nonPlayerRadius = Constants.BERRY_RADIUS;
      } else if(collisionType == 1){
        nonPlayerRadius = Constants.LAVA_RADIUS;
      } else if(collisionType == 2){
        nonPlayerRadius = Constants.ROCK_RADIUS;
      } else if(collisionType == 3){
        nonPlayerRadius = Constants.PLAYER_RADIUS;
        //otherObjSize = Constants.PLAYER_RADIUS;
      }
      if (player.distanceTo(otherObject) <= playerRadius + nonPlayerRadius) {
        if(collisionType == 0){
          player.giveBerryXP();
        } else if (collisionType == 1){
          player.takeLavaDamage();
        } else if (collisionType == 2){
          // push player away from rock
        } else if (collisionType == 3){
          if(player.tier > otherObject.tier){
            otherObject.takeKnockback(deltaTime);
            otherObject.takeHitDamage();
            if(otherObject.hp <= 0){
              player.getKillXP(100);
              break;
            }
          } else if(player.tier < otherObject.tier){
            player.takeKnockback(deltaTime);
            player.takeHitDamage();
            if(player.hp <= 0){
              otherObject.getKillXP(100);
              break;
            }
          } else{
            // If i decide to have players pushed back, i will do it here
          }
        }
        
        destroyedObj.push(otherObject);
        break;
      }
    }
  }
  return destroyedObj;
}

module.exports = applyCollisions;
