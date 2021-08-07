const e = require('express');
const { debug } = require('webpack');
const { MAGEBALL_DAMAGE } = require('../shared/constants');
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
      } else if (collisionType == 16){
        nonPlayerRadius = Constants.MAGEBALL_RADIUS;
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
              player.takeHitDamage();
              if(player.hp <= 0){
                otherObject.getKillXP(player.score * 0.5 + otherObject.score * 0.05);
                break;
              }
            } else if(tailbite == false){
              // Normal biting (bigger player eats smaller one)
              otherObject.takeHitDamage();
              if(otherObject.hp <= 0){
                player.getKillXP(otherObject.score * 0.5 + player.score * 0.05);
                break;
              }
            }
          } 

          else if(player.tier < otherObject.tier){
            tailbite = CheckTailbite(player, otherObject);
            if(tailbite == true){
              otherObject.takeHitDamage();
              if(otherObject.hp <= 0){
                player.getKillXP(otherObject.score * 0.5 + player.score * 0.05);
                break;
              }
            } else if(tailbite == false){
              // Normal biting (bigger player eats smaller one)
              player.takeHitDamage();
            
              if(player.hp <= 0){
                otherObject.getKillXP(player.score * 0.5 + otherObject.score * 0.05);
                break;
              }
            }
          }
          
          /*else{
            if(player.tier == 15 && otherObject.tier == 15){  // If players are sea snakes, then let them 1v1
              var P1tailbite;
              
              P1tailbite = CheckTailbite(otherObject, player, nonPlayerRadius, playerRadius);
              if(P1tailbite == true){
                player.takeHitDamage();
                if(player.hp <= 0){
                  otherObject.getKillXP(player.score * 0.5 + otherObject.score * 0.05);
                  break;
                }
              }

              var P2tailbite;
              
              P2tailbite = CheckTailbite(player, otherObject, nonPlayerRadius, playerRadius);
              if(P2tailbite == true){
                otherObject.takeHitDamage();
                if(otherObject.hp <= 0){
                  player.getKillXP(otherObject.score * 0.5 + player.score * 0.05);
                  break;
                }
              }
            }
          }*/

          player.takeKnockback(null, player.x - otherObject.x, player.y - otherObject.y);
          otherObject.takeKnockback(null, otherObject.x - player.x, otherObject.y - player.y);
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
        } else if (collisionType == 16){
          if(player.tier < 14){
            player.takeProjectileDamage(Constants.MAGEBALL_DAMAGE);
            player.takeKnockback(null, player.x - otherObject.x, player.y - otherObject.y);
            if(player.hp <= 0){
              for(let a = 0; a < players.length; a++){
                if(players[a].id === otherObject.parentID){
                  players[a].getKillXP(player.score * 0.5 + player.score * 0.05);
                }
              }
            }
          } else if(player.tier > 14){
            player.takeProjectileDamage(Constants.MAGEBALL_HIGHER_TIER_DAMAGE);
            player.takeKnockback(null, 0.5*player.x - 0.5*otherObject.x, 0.5*player.y - 0.5*otherObject.y);
            /*if(player.hp <= 0){
              for(let a = 0; a < players.length; a++){
                if(players[a].id === otherObject.parentID){
                  players[a].getKillXP(player.score * 0.5 + player.score * 0.05);
                }
              }
            }*/
          }
        } else if (collisionType == 17){
          if(player.tier < 4){
            player.takeProjectileDamage(Constants.SNAKEBITE_DAMAGE);
            player.takeKnockback(null, player.x - otherObject.x, player.y - otherObject.y);
            if(player.hp <= 0){
              for(let b = 0; b < players.length; b++){
                if(players[b].id === otherObject.parentID){
                  players[b].getKillXP(player.score * 0.5 + player.score * 0.05);
                }
              }
            }
          } else if(player.tier > 4){
            player.takeProjectileDamage(Constants.SNAKEBITE_HIGHER_TIER_DAMAGE);
            player.takeKnockback(null, 0.5*player.x - 0.5*otherObject.x, 0.5*player.y - 0.5*otherObject.y);
            if(player.hp <= 0){
              for(let b = 0; b < players.length; b++){
                if(players[b].id === otherObject.parentID){
                  players[b].getKillXP(player.score * 0.5 + player.score * 0.05);
                }
              }
            }
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
  let relativeDirection = Math.abs(180/Math.PI * (smallerPlayer.direction - biggerPlayer.direction));
  let directionBetween = Math.atan2(biggerPlayer.y - smallerPlayer.y, biggerPlayer.x - smallerPlayer.x) + 1/2 * Math.PI; // calculates a direction based on the radian measure between the smaller player and bigger player 
  let testPlayerX = smallerPlayer.x + 5 * Math.sin(smallerPlayer.direction);
  let testPlayerY = smallerPlayer.y + -5 * Math.cos(smallerPlayer.direction);
  let distance = Math.sqrt((testPlayerX - biggerPlayer.x) * (testPlayerX - biggerPlayer.x) + (testPlayerY - biggerPlayer.y) * (testPlayerY - biggerPlayer.y));
  let combinedRadius = Constants.RelativeSizes[smallerPlayer.tier] * Constants.PLAYER_RADIUS + Constants.RelativeSizes[biggerPlayer.tier] * Constants.PLAYER_RADIUS;
  console.log(Math.abs(directionBetween - smallerPlayer.direction) * 180/ Math.PI);
  if(relativeDirection <= 10 || relativeDirection >= 350){
    if(distance <= combinedRadius && (Math.abs(directionBetween - smallerPlayer.direction) * 180/Math.PI <= 20 || Math.abs(directionBetween - smallerPlayer.direction) * 180/Math.PI >= 340)){
      return true;
    } else{
      return false;
    }
  } 
  
  else{
    return false;
  }
  /*
  Constants.RelativeSizes[smallerPlayer.tier] * Constants.PLAYER_RADIUS
  */
 
   // false = no tailbite, true = tailbite
}

module.exports = applyCollisions;