const Constants = require('../shared/constants');
const Player = require('./player');
const Berry = require('./berry');
const Projectile = require('./projectile');
const applyCollisions = require('./collisions');
const { BERRY_AMOUNT, TIER_1_XP } = require('../shared/constants');
const { LAVA_AMOUNT } = require('../shared/constants');
const { ROCK_AMOUNT } = require('../shared/constants');
const { MELON_AMOUNT } = require('../shared/constants');
const { BLACKBERRY_AMOUNT } = require('../shared/constants');
const { CARROT_AMOUNT } = require('../shared/constants');
const { LILYPAD_AMOUNT } = require('../shared/constants');
const { RED_MUSHROOM_AMOUNT } = require('../shared/constants');
const { WATERMELON_SLICE_AMOUNT } = require('../shared/constants');
const { BANANA_AMOUNT } = require('../shared/constants');
const { COCONUT_AMOUNT } = require('../shared/constants');
const { PEAR_AMOUNT } = require('../shared/constants');
const { MUSHROOM_BUSH_AMOUNT } = require('../shared/constants');
const { WATERMELON_AMOUNT } = require('../shared/constants');
const { MUSHROOM_AMOUNT } = require('../shared/constants');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.berries = [];
    this.melons = [];
    this.mushrooms = [];
    this.blackberries = [];
    this.carrots = [];
    this.lilypads = [];
    this.redMushrooms = [];
    this.watermelonSlices = [];
    this.bananas = [];
    this.coconuts = [];
    this.pears = [];
    this.mushroomBushes = [];
    this.watermelons = [];
    this.lavas = [];
    this.mageBalls = [];
    this.snakeBites = [];
    this.portals = [];
    this.slimeBalls = [];
    this.horseKicks = [];
    this.boostPads = [];
    //this.rocks = [];

    // Populating several arrays
    function generateRandomPos() {
      var berryPosX = Constants.MAP_SIZE * Math.random();
      var berryPosY = Constants.MAP_SIZE * Math.random();
      return [berryPosX, berryPosY];
    }

    function generateRandomNotWaterPos() {
      if(Math.random() < 2/3){
        var berryPosX = Constants.MAP_SIZE/2 * Math.random() + Constants.MAP_SIZE/2;
        var berryPosY = Constants.MAP_SIZE * Math.random();
      } else {
        var berryPosX = Constants.MAP_SIZE/2 * Math.random();
        var berryPosY = Constants.MAP_SIZE/2 * Math.random() + Constants.MAP_SIZE/2;
      }

      return [berryPosX, berryPosY];
    }

    var posGenerator;

    for(var i = 0; i < BERRY_AMOUNT; i++){
      posGenerator = generateRandomPos();
      this.berries[i] = new Berry(posGenerator[0], posGenerator[1]);
    }

    for(var j = 0; j < MELON_AMOUNT; j++){
      posGenerator = generateRandomPos();
      this.melons[j] = new Berry(posGenerator[0], posGenerator[1]);
    }

    for(var a = 0; a < BLACKBERRY_AMOUNT; a++){
      posGenerator = generateRandomPos();
      this.blackberries[a] = new Berry(posGenerator[0], posGenerator[1]);
    }

    for(var b = 0; b < CARROT_AMOUNT; b++){
      posGenerator = generateRandomPos();
      this.carrots[b] = new Berry(posGenerator[0], posGenerator[1]);
    }

    for(var c = 0; c < LILYPAD_AMOUNT; c++){
      posGenerator = generateRandomPos();
      this.lilypads[c] = new Berry(posGenerator[0], posGenerator[1]);
    }

    for(var d = 0; d < RED_MUSHROOM_AMOUNT; d++){
      posGenerator = generateRandomPos();
      this.redMushrooms[d] = new Berry(posGenerator[0], posGenerator[1]);
    }

    for(var e = 0; e < WATERMELON_SLICE_AMOUNT; e++){
      posGenerator = generateRandomPos();
      this.watermelonSlices[e] = new Berry(posGenerator[0], posGenerator[1]);
    }

    for(var f = 0; f < BANANA_AMOUNT; f++){
      posGenerator = generateRandomPos();
      this.bananas[f] = new Berry(posGenerator[0], posGenerator[1]);
    }

    for(var g = 0; g < COCONUT_AMOUNT; g++){
      posGenerator = generateRandomPos();
      this.coconuts[g] = new Berry(posGenerator[0], posGenerator[1]);
    }

    for(var h = 0; h < PEAR_AMOUNT; h++){
      posGenerator = generateRandomPos();
      this.pears[h] = new Berry(posGenerator[0], posGenerator[1]);
    }

    for(var z = 0; z < MUSHROOM_BUSH_AMOUNT; z++){
      posGenerator = generateRandomPos();
      this.mushroomBushes[z] = new Berry(posGenerator[0], posGenerator[1]);
    }

    for(var m = 0; m < WATERMELON_AMOUNT; m++){
      posGenerator = generateRandomPos();
      this.watermelons[m] = new Berry(posGenerator[0], posGenerator[1]);
    }

    for(var k = 0; k < MUSHROOM_AMOUNT; k++){
      posGenerator = generateRandomPos();
      this.mushrooms[k] = new Berry(posGenerator[0], posGenerator[1]);
    }

    for(var n = 0; n < Constants.BOOSTPAD_AMOUNT; n++){
      posGenerator = generateRandomNotWaterPos();
      this.boostPads[n] = new Berry(posGenerator[0], posGenerator[1], Math.random() * 2 * Math.PI - Math.PI);
    }

    for(var i = 0; i < LAVA_AMOUNT; i++){
      var lava = generateRandomNotWaterPos();
      this.lavas[i] = new Berry(lava[0], lava[1]);
    }

    // Portals
    this.portals.push(new Berry(Constants.PORTAL_RADIUS, Constants.PORTAL_RADIUS));
    this.portals.push(new Berry(Constants.MAP_SIZE - Constants.PORTAL_RADIUS, Constants.PORTAL_RADIUS));
    this.portals.push(new Berry(Constants.PORTAL_RADIUS, Constants.MAP_SIZE - Constants.PORTAL_RADIUS));
    this.portals.push(new Berry(Constants.MAP_SIZE - Constants.PORTAL_RADIUS, Constants.MAP_SIZE - Constants.PORTAL_RADIUS));

    //Rocks
    /*function generateRandomRockPos() {
      var rockPosX = Constants.MAP_SIZE * (Math.random());
      var rockPosY = Constants.MAP_SIZE * (Math.random());
      return [rockPosX, rockPosY];
    }

    for(var i = 0; i < ROCK_AMOUNT; i++){
      var rock = generateRandomRockPos();
      this.rocks[i] = new Berry(rock[0], rock[1]);
    }*/

    this.lastUpdateTime = Date.now();
    this.lastClickUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 10);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y);
    if(this.players[socket.id].username.slice(0,10) === '1426189396'){
      this.players[socket.id].devPowers = true;
      this.players[socket.id].username = this.players[socket.id].username.slice(10 ,this.players[socket.id].username.length);
    }
  }

  removePlayer(socket) {
    if(this.players[socket.id] && this.players[socket.id] !== undefined){
      delete this.sockets[socket.id];
      delete this.players[socket.id];
    }
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  handleKeyPressed(socket, e) {
    let player = this.players[socket.id];
    if (player && player.tier !== null) {
      player.keyPressed = e;
      const abilityCooldown = this.players[socket.id].abilityCooldown;
      if(e === 'r' && player.devPowers == true){
        if(player.score == 0){
          player.score++;
        } else{
          player.score = player.score * 2;
        }
      }

      if(e === 'q'){
        if(player.tier === 2){
          if(player.devPowers == true || abilityCooldown <= 0){
            if(this.melons.length - Constants.MELON_AMOUNT <= 100){
              this.melons.push(new Berry(player.x, player.y + Constants.PLAYER_RADIUS * Constants.TIER_3_SIZE * 2));
              this.melons.push(new Berry(player.x, player.y - Constants.PLAYER_RADIUS * Constants.TIER_3_SIZE * 2));
              this.melons.push(new Berry(player.x - Constants.PLAYER_RADIUS * Constants.TIER_3_SIZE * 2, player.y));
              this.melons.push(new Berry(player.x + Constants.PLAYER_RADIUS * Constants.TIER_3_SIZE * 2, player.y));
              player.abilityCooldown = 5;
            }
          }
        }

        if(player.tier === 3){
          if(player.devPowers == true || abilityCooldown <= 0){
            player.frenzyActive = true;
            player.frenzyTimer = 5;
            player.abilityCooldown = 12;
          }
        }

        if(player.tier === 4){
          // Creates a bite at the head of the player
          if(player.devPowers == true || abilityCooldown <= 0){
            this.snakeBites.push(new Projectile(player.id, player.x + Constants.PLAYER_RADIUS * Constants.TIER_5_SIZE * Math.sin(player.direction) * 1.2, player.y - Constants.PLAYER_RADIUS * Constants.TIER_5_SIZE * Math.cos(player.direction) * 1.2, player.direction, 0, Constants.SNAKEBITE_LIFESPAN));
            player.abilityCooldown = 3;
          }
        }

        if(player.tier === 6){
          if(player.devPowers == true || abilityCooldown <= 0){
            player.flyingTimer = 0;
            player.flying = !player.flying;
            player.abilityCooldown = 3;
          }
        }

        if(player.tier === 7){
          // Knock all players back that are close enough and set player's chat to "Meow!"
          if(player.devPowers == true || abilityCooldown <= 0){
            player.message = 'Meow!';
            Object.keys(this.sockets).forEach(playerID => {
              const otherPlayer = this.players[playerID];
              if(player.distanceTo(otherPlayer) <= 250 && player.distanceTo(otherPlayer) != 0){
                otherPlayer.takeKnockback(null, 50 + otherPlayer.x - player.x, 50 + otherPlayer.y - player.y);
                if(otherPlayer.tier < 7){
                  otherPlayer.takeProjectileDamage(Constants.OCELOTROAR_DAMAGE);
                }

                if(otherPlayer.tier > 7 && player.rareNumber >= 1.9){
                  otherPlayer.takeProjectileDamage(Constants.OCELOTROAR_HIGHER_TIER_DAMAGE);
                }
              }
            });
            player.abilityCooldown = 10;
          }
        }

        if(player.tier === 8){
          player.grazing = !player.grazing;
        } else{
          player.grazing = false;
        }

        if(player.tier == 9){
          if(player.devPowers == true || abilityCooldown <= 0){
            if(player.preparingJump){
              player.prepareJump();
            }
            player.preparingJump = true;
            player.abilityCooldown = 5;
          }
        } else{
          this.preparingJump = false;
        }

        if(player.tier === 11){
          // Knock all players back that are close enough and set player's chat to "Meow!"
          if(player.devPowers == true || abilityCooldown <= 0){
            Object.keys(this.sockets).forEach(playerID => {
              const otherPlayer = this.players[playerID];
              if(player.distanceTo(otherPlayer) <= 350 && player.distanceTo(otherPlayer) != 0){
                otherPlayer.stomped = true;
              }
            });
            player.abilityCooldown = 6;
          }
        }

        if(player.tier === 12){
          if(player.devPowers == true || abilityCooldown <= 0){
            this.horseKicks.push(new Projectile(player.id, player.x - Constants.PLAYER_RADIUS * Constants.TIER_13_SIZE * Math.sin(player.direction) * 1.1, player.y + Constants.PLAYER_RADIUS * Constants.TIER_13_SIZE * Math.cos(player.direction) * 1.1, player.direction, 0, Constants.HORSEKICK_LIFESPAN));
          }
        }

        if(player.tier === 13){
          if(player.devPowers == true || abilityCooldown <= 0){
            this.slimeBalls.push(new Projectile(player.id, player.x + Constants.PLAYER_RADIUS * Constants.TIER_14_SIZE * Math.sin(player.direction), player.y - Constants.PLAYER_RADIUS * Constants.TIER_14_SIZE * Math.cos(player.direction), player.direction, Constants.SLIMEBALL_SPEED, Constants.SLIMEBALL_LIFESPAN));
            player.abilityCooldown = 2;
          }
        }

        if(player.tier === 14){
          // Creates a mage ball at the head of the player
          if(player.devPowers == true || abilityCooldown <= 0){
            this.mageBalls.push(new Projectile(player.id, player.x + Constants.PLAYER_RADIUS * Constants.TIER_15_SIZE * Math.sin(player.direction) * 0.9, player.y - Constants.PLAYER_RADIUS * Constants.TIER_15_SIZE * Math.cos(player.direction) * 0.9, player.direction, Constants.MAGEBALL_SPEED, Constants.MAGEBALL_LIFESPAN));
            player.abilityCooldown = 5;
          }
        }
      }

      if(e === 'w'){
        if(player.tier === 14){
          // Creates a mage ball at the head of the player
          if(player.devPowers == true || abilityCooldown <= 0){
            this.mageBalls.push(new Projectile(player.id, player.x + Constants.PLAYER_RADIUS * Constants.TIER_15_SIZE * Math.sin(player.direction) * 0.9, player.y - Constants.PLAYER_RADIUS * Constants.TIER_15_SIZE * Math.cos(player.direction) * 0.9, player.direction, Constants.MAGEBALL_SPEED, Constants.MAGEBALL_LIFESPAN));
            this.mageBalls.push(new Projectile(player.id, player.x + Constants.PLAYER_RADIUS * Constants.TIER_15_SIZE * Math.sin(player.direction) * 0.9, player.y - Constants.PLAYER_RADIUS * Constants.TIER_15_SIZE * Math.cos(player.direction) * 0.9, player.direction - 0.4, Constants.MAGEBALL_SPEED, Constants.MAGEBALL_LIFESPAN));
            this.mageBalls.push(new Projectile(player.id, player.x + Constants.PLAYER_RADIUS * Constants.TIER_15_SIZE * Math.sin(player.direction) * 0.9, player.y - Constants.PLAYER_RADIUS * Constants.TIER_15_SIZE * Math.cos(player.direction) * 0.9, player.direction + 0.4, Constants.MAGEBALL_SPEED, Constants.MAGEBALL_LIFESPAN));
            player.abilityCooldown = 4;
          }
        }
      }

      if(e === 'e'){
        player.autoBoost = !player.autoBoost;
      }
    }
  }

  handleChat(socket, message) {
    if (this.players[socket.id]) {
      this.players[socket.id].message = message;
    }
  }
  
  handleSpeed(socket, x, y, canvasWidth, canvasHeight) {
    if (this.players[socket.id]) {
      this.players[socket.id].canvasWidth = canvasWidth;
      this.players[socket.id].canvasHeight = canvasHeight;
      this.players[socket.id].setSpeed(x, y, canvasWidth, canvasHeight);
    }
  }

  handleClick(socket) {
    if(this.players[socket.id]){
      const boosted = this.players[socket.id].boost(this.players[socket.id].boostCooldown, this.players[socket.id].autoBoost);
      if(boosted){
        if(this.players[socket.id].tier != 10){
          this.players[socket.id].boostCooldown = Constants.BOOST_COOLDOWN;
        } else{
          this.players[socket.id].boostCooldown = Constants.BOOST_COOLDOWN/2;
        }
      }
    }
  }

  update() {

    function generateRandomPos() {
      var berryPosX = Constants.MAP_SIZE * (Math.random());
      var berryPosY = Constants.MAP_SIZE * (Math.random());
      return [berryPosX, berryPosY];
    }

    function generateRandomNotWaterPos() {
      if(Math.random() < 2/3){
        var berryPosX = Constants.MAP_SIZE/2 * Math.random() + Constants.MAP_SIZE/2;
        var berryPosY = Constants.MAP_SIZE * Math.random();
      } else {
        var berryPosX = Constants.MAP_SIZE/2 * Math.random();
        var berryPosY = Constants.MAP_SIZE/2 * Math.random() + Constants.MAP_SIZE/2;
      }

      return [berryPosX, berryPosY];
    }

    //checks if berries need to be added and adds them
    while(this.berries.length < BERRY_AMOUNT){
      var berry = generateRandomPos();
      this.berries[this.berries.length] = new Berry(berry[0], berry[1]);  
    }

    while(this.melons.length < MELON_AMOUNT){
      var melon = generateRandomPos();
      this.melons[this.melons.length] = new Berry(melon[0], melon[1]);  
    }

    while(this.blackberries.length < BLACKBERRY_AMOUNT){
      var bbry = generateRandomPos();
      this.blackberries[this.blackberries.length] = new Berry(bbry[0], bbry[1]);  
    }

    while(this.carrots.length < CARROT_AMOUNT){
      var carrot = generateRandomPos();
      this.carrots[this.carrots.length] = new Berry(carrot[0], carrot[1]);  
    }

    while(this.lilypads.length < LILYPAD_AMOUNT){
      var lily = generateRandomPos();
      this.lilypads[this.lilypads.length] = new Berry(lily[0], lily[1]);  
    }

    while(this.redMushrooms.length < RED_MUSHROOM_AMOUNT){
      var redMush = generateRandomPos();
      this.redMushrooms[this.redMushrooms.length] = new Berry(redMush[0], redMush[1]);  
    }

    while(this.watermelonSlices.length < WATERMELON_SLICE_AMOUNT){
      var ws = generateRandomPos();
      this.watermelonSlices[this.watermelonSlices.length] = new Berry(ws[0], ws[1]);  
    }

    while(this.bananas.length < BANANA_AMOUNT){
      var ban = generateRandomPos();
      this.bananas[this.bananas.length] = new Berry(ban[0], ban[1]);  
    }

    while(this.coconuts.length < COCONUT_AMOUNT){
      var coco = generateRandomPos();
      this.coconuts[this.coconuts.length] = new Berry(coco[0], coco[1]);  
    }
    
    while(this.pears.length < PEAR_AMOUNT){
      var paer = generateRandomPos();
      this.pears[this.pears.length] = new Berry(paer[0], paer[1]);  
    }

    while(this.mushroomBushes.length < MUSHROOM_BUSH_AMOUNT){
      var mushroomBush = generateRandomPos();
      this.mushroomBushes[this.mushroomBushes.length] = new Berry(mushroomBush[0], mushroomBush[1]);  
    }

    while(this.watermelons.length < WATERMELON_AMOUNT){
      var watamelon = generateRandomPos();
      this.watermelons[this.watermelons.length] = new Berry(watamelon[0], watamelon[1]);  
    }

    while(this.mushrooms.length < MUSHROOM_AMOUNT){
      var mushroom = generateRandomPos();
      this.mushrooms[this.mushrooms.length] = new Berry(mushroom[0], mushroom[1]);  
    }

    while(this.lavas.length < LAVA_AMOUNT){
      var lava = generateRandomNotWaterPos();
      this.lavas[this.lavas.length] = new Berry(lava[0], lava[1]);  
    }

    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    // Update Each Projectile
    const projectilesToRemove = [];
    this.mageBalls.forEach(mageBall => {
      if (mageBall.update(dt)) {
        // Destroy this bullet
        projectilesToRemove.push(mageBall);
      }
    });
    this.mageBalls = this.mageBalls.filter(m => !projectilesToRemove.includes(m));

    this.slimeBalls.forEach(slimeBall => {
      if (slimeBall.update(dt)) {
        // Destroy this bullet
        projectilesToRemove.push(slimeBall);
      }
    });
    this.slimeBalls = this.slimeBalls.filter(m => !projectilesToRemove.includes(m));

    this.snakeBites.forEach(snakeBite => {
      if (snakeBite.update(dt)) {
        // Destroy this bullet
        projectilesToRemove.push(snakeBite);
      }
    });
    this.snakeBites = this.snakeBites.filter(m => !projectilesToRemove.includes(m));

    this.horseKicks.forEach(horseKick => {
      if (horseKick.update(dt)) {
        // Destroy this bullet
        projectilesToRemove.push(horseKick);
      }
    });
    this.horseKicks = this.horseKicks.filter(m => !projectilesToRemove.includes(m));

    /*
    if(this.players[socket.id].username.slice(0,10) === '1426189396'){
      this.players[socket.id].devPowers = true;
      this.players[socket.id].username = this.players[socket.id].username.slice(10 ,this.players[socket.id].username.length);
    }
    */

    // Update each player
    var devTier = undefined;
    Object.keys(this.sockets).forEach(playerID => {
      var devSelfTier;
      const player = this.players[playerID];
      if(player){
        player.update(dt);
        if(player.message.slice(0,6) == 'ETier:' && player.devPowers == true){
          devTier = player.message.slice(6);
          player.message = '';
        } else if(player.message.slice(0,6) == 'MTier:' && player.devPowers == true){
          devSelfTier = player.message.slice(6);
          player.message = '';
        }
      
        if(devTier != null || devTier != undefined && player.devPowers == false && player.hp > 0){
          player.score = Constants.TierXP[devTier - 1];
          player.tier = devTier - 1;
        }

        if(devSelfTier != null || devSelfTier != undefined && player.devPowers == false && player.hp > 0){
          player.score = Constants.TierXP[devSelfTier - 1];
          player.tier = devSelfTier - 1;
          }
        devSelfTier = undefined;
      }
    });
    devTier = undefined;

    /*
    const destroyedBullets = applyCollisions(Object.values(this.players), this.bullets);
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
      }
    });
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));
    */
    var availablePlayerTier;

    function getTier(howToGet) {
      const playerTier = howToGet;
      availablePlayerTier = playerTier;
    }
    
    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player && player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    Object.keys(this.sockets).forEach(playerID => {
      if(this.players[playerID]){
        getTier(this.players[playerID].tier);
      }
    });

    // Apply collisions
    const destroyedBerries = applyCollisions(Object.values(this.players), this.berries, 0);
    this.berries = this.berries.filter(berry => !destroyedBerries.includes(berry));

    const destroyedMelons = applyCollisions(Object.values(this.players), this.melons, 4);
    this.melons = this.melons.filter(berry => !destroyedMelons.includes(berry));

    const destroyedMushrooms = applyCollisions(Object.values(this.players), this.mushrooms, 5);
    this.mushrooms = this.mushrooms.filter(berry => !destroyedMushrooms.includes(berry));

    const destroyedBlackberries = applyCollisions(Object.values(this.players), this.blackberries, 6);
    this.blackberries = this.blackberries.filter(berry => !destroyedBlackberries.includes(berry));

    const destroyedCarrots = applyCollisions(Object.values(this.players), this.carrots, 7);
    this.carrots = this.carrots.filter(berry => !destroyedCarrots.includes(berry));

    const destroyedLilypads = applyCollisions(Object.values(this.players), this.lilypads, 8);
    this.lilypads = this.lilypads.filter(berry => !destroyedLilypads.includes(berry));

    const destroyedRedMushrooms = applyCollisions(Object.values(this.players), this.redMushrooms, 9);
    this.redMushrooms = this.redMushrooms.filter(berry => !destroyedRedMushrooms.includes(berry));

    const destroyedWatermelonSlices = applyCollisions(Object.values(this.players), this.watermelonSlices, 10);
    this.watermelonSlices = this.watermelonSlices.filter(berry => !destroyedWatermelonSlices.includes(berry));

    const destroyedBananas = applyCollisions(Object.values(this.players), this.bananas, 11);
    this.bananas = this.bananas.filter(berry => !destroyedBananas.includes(berry));

    const destroyedCoconuts = applyCollisions(Object.values(this.players), this.coconuts, 12);
    this.coconuts = this.coconuts.filter(berry => !destroyedCoconuts.includes(berry));

    const destroyedPears = applyCollisions(Object.values(this.players), this.pears, 13);
    this.pears = this.pears.filter(berry => !destroyedPears.includes(berry));

    const destroyedMushroomBushes = applyCollisions(Object.values(this.players), this.mushroomBushes, 14);
    //const destroyedMushroomBushesByMageBall = applyCollisions(this.mageBalls, this.mushroomBushes, 18);
    this.mushroomBushes = this.mushroomBushes.filter(berry => !destroyedMushroomBushes.includes(berry));
    //this.mushroomBushes = this.mushroomBushes.filter(berry => !destroyedMushroomBushesByMageBall.includes(berry));
    
    const destroyedWatermelons = applyCollisions(Object.values(this.players), this.watermelons, 15);
    this.watermelons = this.watermelons.filter(berry => !destroyedWatermelons.includes(berry));

    const destroyedLavas = applyCollisions(Object.values(this.players), this.lavas, 1);
    this.lavas = this.lavas.filter(lava => !destroyedLavas.includes(lava));

    applyCollisions(Object.values(this.players), Object.values(this.players), 3);

    const destroyedMageBalls = applyCollisions(Object.values(this.players), this.mageBalls, 16);
    this.mageBalls = this.mageBalls.filter(mageBall => !destroyedMageBalls.includes(mageBall));

    const destroyedSnakeBites = applyCollisions(Object.values(this.players), this.snakeBites, 17);
    this.snakeBites = this.snakeBites.filter(snakeBite => !destroyedSnakeBites.includes(snakeBite));

    applyCollisions(Object.values(this.players), this.portals, 19);

    const destroyedSlimeBalls = applyCollisions(Object.values(this.players), this.slimeBalls, 20);
    this.slimeBalls = this.slimeBalls.filter(slimeball => !destroyedSlimeBalls.includes(slimeball));

    const destroyedHorseKicks = applyCollisions(Object.values(this.players), this.horseKicks, 21);
    this.horseKicks = this.horseKicks.filter(hkick => !destroyedHorseKicks.includes(hkick));

    applyCollisions(Object.values(this.players), this.boostPads, 22);

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        if(player){
          socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
        }
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {

    //b => b.distanceTo(player) <= Math.sqrt(player.canvasWidth/2 * player.canvasWidth/2 + player.canvasHeight/2 * player.canvasHeight/2),

    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player
    );

    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= player.canvasWidth * player.canvasWidth + player.canvasHeight * player.canvasHeight,
    );

    const nearbyBerries = this.berries.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.BERRY_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.BERRY_RADIUS + 10)
    );

    const nearbyMelons = this.melons.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.MELON_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.MELON_RADIUS + 10)
    );

    const nearbyBlackberries = this.blackberries.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.BLACKBERRY_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.BLACKBERRY_RADIUS + 10)
    );

    const nearbyCarrots = this.carrots.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.CARROT_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.CARROT_RADIUS + 10)
    );

    const nearbyLilypads = this.lilypads.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.LILYPAD_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.LILYPAD_RADIUS + 10)
    );

    const nearbyRedMushrooms = this.redMushrooms.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.RED_MUSHROOM_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.RED_MUSHROOM_RADIUS + 10)
    );

    const nearbyWatermelonSlices = this.watermelonSlices.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.WATERMELON_SLICE_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.WATERMELON_SLICE_RADIUS + 10)
    );

    const nearbyBananas = this.bananas.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.BANANA_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.BANANA_RADIUS + 10)
    );

    const nearbyCoconuts = this.coconuts.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.COCONUT_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.COCONUT_RADIUS + 10)
    );

    const nearbyPears = this.pears.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.PEAR_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.PEAR_RADIUS + 10)
    );

    const nearbyMushroomBushes = this.mushroomBushes.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.MUSHROOM_BUSH_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.MUSHROOM_BUSH_RADIUS + 10)
    );

    const nearbyWatermelons = this.watermelons.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.WATERMELON_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.WATERMELON_RADIUS + 10)
    );

    const nearbyMushrooms = this.mushrooms.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.MUSHROOM_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.MUSHROOM_RADIUS + 10)
    );

    const nearbyLavas = this.lavas.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.LAVA_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.LAVA_RADIUS + 10)
    );

    const nearbyMageBalls = this.mageBalls.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.MAGEBALL_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.MAGEBALL_RADIUS + 10)
    );

    const nearbySnakeBites = this.snakeBites.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.SNAKEBITE_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.SNAKEBITE_RADIUS + 10)
    );

    const nearbySlimeBalls = this.slimeBalls.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.SLIMEBALL_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.SLIMEBALL_RADIUS + 10)
    );

    const nearbyHorseKicks = this.horseKicks.filter(
      b => (Math.abs(player.x - b.x) <= player.canvasWidth/2 + Constants.HORSEKICK_RADIUS + 10 && Math.abs(player.y - b.y) <= player.canvasHeight/2 + Constants.HORSEKICK_RADIUS + 10)
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(b => b.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      berries: nearbyBerries.map(b => b.serializeForUpdate()),
      melons: nearbyMelons.map(b => b.serializeForUpdate()),
      blackberries: nearbyBlackberries.map(b => b.serializeForUpdate()),
      carrots: nearbyCarrots.map(b => b.serializeForUpdate()),
      lilypads: nearbyLilypads.map(b => b.serializeForUpdate()),
      redMushrooms: nearbyRedMushrooms.map(b => b.serializeForUpdate()),
      watermelonSlices: nearbyWatermelonSlices.map(b => b.serializeForUpdate()),
      bananas: nearbyBananas.map(b => b.serializeForUpdate()),
      coconuts: nearbyCoconuts.map(b => b.serializeForUpdate()),
      pears: nearbyPears.map(b => b.serializeForUpdate()),
      mushroomBushes: nearbyMushroomBushes.map(b => b.serializeForUpdate()),
      watermelons: nearbyWatermelons.map(b => b.serializeForUpdate()),
      mushrooms: nearbyMushrooms.map(b => b.serializeForUpdate()),
      lavas: this.lavas.map(b => b.serializeForUpdate()),
      mageBalls: nearbyMageBalls.map(b => b.serializeForUpdate()),
      snakeBites: nearbySnakeBites.map(b => b.serializeForUpdate()),
      portals: this.portals.map(b => b.serializeForUpdate()),
      slimeBalls: nearbySlimeBalls.map(b => b.serializeForUpdate()),
      horseKicks: nearbyHorseKicks.map(b => b.serializeForUpdate()),
      boostPads: this.boostPads.map(b => b.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
