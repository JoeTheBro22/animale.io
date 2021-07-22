const e = require('express');
const { debug } = require('webpack');
const constants = require('../shared/constants');
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

function applyCollisions(players, otherObj, collisionType) {
  const destroyedObj = [];

  for (let i = 0; i < otherObj.length; i++) {
    for (let j = 0; j < players.length; j++) {

      const otherObject = otherObj[i];
      const player = players[j];
      let nonPlayerRadius = constants.PLAYER_RADIUS;
      let playerRadius = player.radius;
      let destroyObject = true;

      if(collisionType == 0){
        nonPlayerRadius = Constants.BERRY_RADIUS;
      } else if(collisionType == 1){
        nonPlayerRadius = Constants.LAVA_RADIUS;
      } else if(collisionType == 2){
        nonPlayerRadius = Constants.ROCK_RADIUS;
      } else if(collisionType == 3){
        nonPlayerRadius = otherObject.radius;
      } else if (collisionType == 4){
        nonPlayerRadius = Constants.MELON_RADIUS;
      } else if (collisionType == 5){
        nonPlayerRadius = Constants.MUSHROOM_RADIUS;
      } else if (collisionType == 6){
        nonPlayerRadius = Constants.BLACKBERRY_RADIUS;
      } else if (collisionType == 7){
        nonPlayerRadius = Constants.CARROT_RADIUS;
      } else if (collisionType == 8){
        nonPlayerRadius = Constants.LILYPAD_RADIUS;
      } else if (collisionType == 9){
        nonPlayerRadius = Constants.RED_MUSHROOM_RADIUS;
      } else if (collisionType == 10){
        nonPlayerRadius = Constants.WATERMELON_SLICE_RADIUS;
      } else if (collisionType == 11){
        nonPlayerRadius = Constants.BANANA_RADIUS;
      } else if (collisionType == 12){
        nonPlayerRadius = Constants.COCONUT_RADIUS;
      } else if (collisionType == 13){
        nonPlayerRadius = Constants.PEAR_RADIUS;
      } else if (collisionType == 14){
        nonPlayerRadius = Constants.MUSHROOM_BUSH_RADIUS;
      } else if (collisionType == 15){
        nonPlayerRadius = Constants.WATERMELON_RADIUS;
      }
      if (player.distanceTo(otherObject) <= playerRadius + nonPlayerRadius) {
        if(collisionType == 0){
          player.giveBerryXP();
        } else if (collisionType == 1){
          if(player.tier <= 12){
            player.takeLavaDamage();
          }
        } else if (collisionType == 2){
          // push player away from rock
        } else if (collisionType == 3){
          var tailbite;
            if(player.tier > otherObject.tier){
              tailbite = CheckTailbite(otherObject, player);
              if(tailbite == true){
                otherObject.takeKnockback(-player.direction);
                player.takeHitDamage();
                if(player.hp <= 0){
                  otherObject.getKillXP(player.score * 0.5 + otherObject.score * 0.05);
                  break;
                }
              } else if(tailbite == false){
                // Normal biting (bigger player eats smaller one)
                otherObject.takeKnockback(player.direction);
                otherObject.takeHitDamage();
              
                if(otherObject.hp <= 0){
                  player.getKillXP(otherObject.score * 0.5 + player.score * 0.05);
                  break;
                }
              } else {
                otherObject.takeKnockback(-player.direction);
              }
            } 

            else if(player.tier < otherObject.tier){
              tailbite = CheckTailbite(player, otherObject);
              if(tailbite == true){
                player.takeKnockback(-otherObject.direction);
                otherObject.takeHitDamage();
                if(otherObject.hp <= 0){
                  player.getKillXP(otherObject.score * 0.5 + player.score * 0.05);
                  break;
                }
              } else if(tailbite == false){
                // Normal biting (bigger player eats smaller one)
                player.takeKnockback(otherObject.direction);
                player.takeHitDamage();
              
                if(player.hp <= 0){
                  otherObject.getKillXP(player.score * 0.5 + otherObject.score * 0.05);
                  break;
                }
              } else {
                player.takeKnockback(-otherObject.direction);
              }
            }
            
            else{
              // If i decide to have players of the same tier pushed back, i will do it here
            }
          }

          else if (collisionType == 4){
          // Checking if the player's tier is high enough, and only destroying the object when it is
          if(player.tier >= 2){
            player.giveMelonXP();
          } else{
            destroyObject = false;
          }
        } else if (collisionType == 5){
          if(player.tier >= 1){
            player.giveMushroomXP();
          } else{
            destroyObject = false;
          }
        } else if (collisionType == 6){
          if(player.tier >= 4){
            player.giveBlackberryXP();
          } else{
            destroyObject = false;
          }
        } else if (collisionType == 7){
          player.giveCarrotXP();
        } else if (collisionType == 8){
          if(player.tier >= 4){
            player.giveLilypadXP();
          } else{
            destroyObject = false;
          }
        } else if (collisionType == 9){
          if(player.tier >= 5){
            player.giveRedMushroomXP();
          } else{
            destroyObject = false;
          }
        } else if (collisionType == 10){
          if(player.tier >= 5){
            player.giveWatermelonSliceXP();
          } else{
            destroyObject = false;
          }
        } else if (collisionType == 11){
          if(player.tier >= 7){
            player.giveBananaXP();
          } else{
            destroyObject = false;
          }
        } else if (collisionType == 12){
          if(player.tier >= 7){
            player.giveCoconutXP();
          } else{
            destroyObject = false;
          }
        } else if (collisionType == 13){
          if(player.tier >= 7){
            player.givePearXP();
          } else{
            destroyObject = false;
          }
        } else if (collisionType == 14){
          if(player.tier >= 11){
            player.giveMushroomBushXP();
          } else{
            destroyObject = false;
          }
        } else if (collisionType == 15){
          if(player.tier >= 9){
            player.giveWatermelonXP();
          } else{
            destroyObject = false;
          }
        }
        if(destroyObject){
          destroyedObj.push(otherObject);
        }
        break;
      }
    }
  }
  return destroyedObj;
}

function CheckTailbite(smallerPlayer, biggerPlayer){
  let biteDistance = Math.abs(biggerPlayer.direction - smallerPlayer.direction) * 180/Math.PI;

  if(biteDistance <= 20){
    if(biggerPlayer.direction > 0 && smallerPlayer.direction > 0 && smallerPlayer.x < biggerPlayer.x){
      return true;
    } else if(biggerPlayer.direction < 0 && smallerPlayer.direction < 0 && smallerPlayer.x > biggerPlayer.x){
      return true;
    } else if(biggerPlayer.direction > 0 && smallerPlayer.direction < 0 && smallerPlayer.y > biggerPlayer.y){
      return true;
    } else if(biggerPlayer.direction < 0 && smallerPlayer.direction > 0 && smallerPlayer.y < biggerPlayer.y){
      return true;
    } else{
      return false;
    }
  } else{
    return null; // We hit the side
  }
}

module.exports = applyCollisions;
