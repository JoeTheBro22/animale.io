const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
function applyCollisions(players, bullets) {
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

function applyBerryCollisions(players, berries) {
  const destroyedBerries = [];
  for (let i = 0; i < berries.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < players.length; j++) {
      const berry = berries[i];
      const player = players[j];
      if (player.distanceTo(berry) <= Constants.PLAYER_RADIUS + Constants.BERRY_RADIUS) {
        player.giveBerryXP();
        destroyedBerries.push(berry);
        break;
      }
    }
  }
  return destroyedBerries;
}

module.exports = applyCollisions;
module.exports = applyBerryCollisions;
