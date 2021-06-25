module.exports = Object.freeze({
  PLAYER_RADIUS: 40,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 400,
  PLAYER_FIRE_COOLDOWN: 0.25,

  BULLET_RADIUS: 0,
  BULLET_SPEED: 0,
  BULLET_DAMAGE: 0,

  SCORE_BULLET_HIT: 0,
  SCORE_PER_SECOND: 0,

  //foods
  BERRY_XP: 1000,
  BERRY_RADIUS: 15,
  BERRY_AMOUNT: 25,

  MAP_SIZE: 1000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
  },
});
