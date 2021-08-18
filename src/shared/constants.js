module.exports = Object.freeze({
  PLAYER_RADIUS: 40,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 100,
  PLAYER_FIRE_COOLDOWN: 0.25,
  PLAYER_DAMAGE_COOLDOWN: 0.5,

  BULLET_RADIUS: 0,
  BULLET_SPEED: 0,
  BULLET_DAMAGE: 0,

  SCORE_BULLET_HIT: 0,
  SCORE_PER_SECOND: 0,

  //foods
  BERRY_XP: 1,
  BERRY_RADIUS: 15,
  BERRY_AMOUNT: 125,

  MELON_XP: 25,
  MELON_RADIUS: 25,
  MELON_AMOUNT: 125,

  MUSHROOM_XP: 12,
  MUSHROOM_RADIUS: 25,
  MUSHROOM_AMOUNT: 125,

  BLACKBERRY_XP: 15,
  BLACKBERRY_RADIUS: 25,
  BLACKBERRY_AMOUNT: 125,

  CARROT_XP: 30,
  CARROT_RADIUS: 30,
  CARROT_AMOUNT: 125,

  LILYPAD_XP: 75,
  LILYPAD_RADIUS: 40,
  LILYPAD_AMOUNT: 125,

  RED_MUSHROOM_XP: 275,
  RED_MUSHROOM_RADIUS: 25,
  RED_MUSHROOM_AMOUNT: 125,

  WATERMELON_SLICE_XP: 750,
  WATERMELON_SLICE_RADIUS: 35,
  WATERMELON_SLICE_AMOUNT: 125,

  BANANA_XP: 350,
  BANANA_RADIUS: 30,
  BANANA_AMOUNT: 125,

  COCONUT_XP: 1000,
  COCONUT_RADIUS: 30,
  COCONUT_AMOUNT: 125,

  PEAR_XP: 1250,
  PEAR_RADIUS: 30,
  PEAR_AMOUNT: 125,

  MUSHROOM_BUSH_XP: 13000,
  MUSHROOM_BUSH_RADIUS: 60,
  MUSHROOM_BUSH_AMOUNT: 250,

  WATERMELON_XP: 3000,
  WATERMELON_RADIUS: 35,
  WATERMELON_AMOUNT: 125,

  //Terrain
  LAVA_RADIUS: 100,
  LAVA_DAMAGE: 0.5,
  LAVA_AMOUNT: 50,
  LAVA_XP: 100000,

  ROCK_RADIUS: 100,
  ROCK_AMOUNT: 25,

  PORTAL_RADIUS: 75,

  // HP and player
  REGEN_AMOUNT: 0.03,
  HIT_DAMAGE: 30,
  KILL_XP_MULTIPLIER: 0.9,
  BOOST_COOLDOWN: 0.4,

  // Abilities
  ABILITY_COOLDOWN: 1,

  MAGEBALL_RADIUS: 30,
  MAGEBALL_SPEED: 250,
  MAGEBALL_DAMAGE: 30,
  MAGEBALL_HIGHER_TIER_DAMAGE: 8,
  MAGEBALL_LIFESPAN: 3,

  SLIMEBALL_SPEED: 500,
  SLIMEBALL_LIFESPAN: 1,
  SLIMEBALL_RADIUS: 10,

  SNAKEBITE_RADIUS: 20,
  SNAKEBITE_DAMAGE: 25,
  SNAKEBITE_HIGHER_TIER_DAMAGE: 5,
  SNAKEBITE_LIFESPAN: 0.5,

  OCELOTROAR_DAMAGE: 20,
  OCELOTROAR_HIGHER_TIER_DAMAGE: 20,

  HORSEKICK_LIFESPAN: 0.8,
  HORSEKICK_DAMAGE: 20,
  // Note: the horse kick does the same amount of damage to lower tiers as higher ones
  HORSEKICK_RADIUS: 60,

  GRAZING_XP: 1000,
  
  // Tiers
  //ORIGINAL VALUES:
  TIER_2_XP: 50,
  TIER_3_XP: 200,
  TIER_4_XP: 450,
  TIER_5_XP: 1000,
  TIER_6_XP: 2100,
  TIER_7_XP: 4200,
  TIER_8_XP: 7900,
  TIER_9_XP: 15000,
  TIER_10_XP: 28500,
  TIER_11_XP: 54000,
  TIER_12_XP: 105000,
  TIER_13_XP: 250000,
  TIER_14_XP: 500000,
  TIER_15_XP: 1000000,
  TIER_16_XP: 5000000,
  TIER_17_XP: 10000000,

  TierXP: [0, 50, 200, 450, 1000, 2100, 4200, 7900, 15000, 28500, 54000, 105000, 250000, 500000, 1000000, 5000000, 10000000],

  // Testing values
  /*TIER_1_XP: 10,
  TIER_2_XP: 20,
  TIER_3_XP: 30,
  TIER_4_XP: 40,
  TIER_5_XP: 50,
  TIER_6_XP: 60,
  TIER_7_XP: 70,
  TIER_8_XP: 80,
  TIER_9_XP: 90,
  TIER_10_XP: 100,
  TIER_11_XP: 120,
  TIER_12_XP: 140,
  TIER_13_XP: 160,
  TIER_14_XP: 180,
  TIER_15_XP: 200,
  TIER_16_XP: 300,*/

  //Relative Animal Sizes (for the size that it will b rendered in)
  TIER_1_SIZE: 0.4, // termite
  TIER_2_SIZE: 0.5, // ant
  TIER_3_SIZE: 1.2,   // squirrel
  TIER_4_SIZE: 1.4, // hummingbird
  TIER_5_SIZE: 1.4, // garden snake
  TIER_6_SIZE: 0.5, // rooster
  TIER_7_SIZE: 1.5, // barn owl
  TIER_8_SIZE: 1.6, // ocelot
  TIER_9_SIZE: 1.5, // zebra
  TIER_10_SIZE: 2,  // kangaroo
  TIER_11_SIZE: 2,  // ostrich
  TIER_12_SIZE: 2.4,// mammoth
  TIER_13_SIZE: 2,  // horse
  TIER_14_SIZE: 1.4,// slime
  TIER_15_SIZE: 3,// wizard
  TIER_16_SIZE: 2,  // sea snake
  // Relative Animal Sizes (for collision)
  RelativeSizes: [0.4, 0.5, 1, 1, 0.95, 0.4, 1.3, 1.15, 1.05, 1.45, 0.95, 1.7, 1.35, 1.4, 1.5, 1.3],

  MAP_SIZE: 5000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    MOUSE_INPUT: 'mouseinput',
    SPEED_INPUT: 'speedinput',
    WATER_INPUT: 'waterinput',
    GAME_OVER: 'dead',
    KEY_PRESSED: 'keypressed',
    CHAT: 'chat',
  },
});
