const Constants = require('../shared/constants');
const Player = require('./player');
const Berry = require('./berry');
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
    //this.rocks = [];
    // Add code to populate berries array
    function generateRandomPos() {
      var berryPosX = Constants.MAP_SIZE * (Math.random());
      var berryPosY = Constants.MAP_SIZE * (Math.random());
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

    // Add code to populate the lavas array
    function generateRandomLavaPos() {
      var lavaPosX = Constants.MAP_SIZE * (Math.random());
      var lavaPosY = Constants.MAP_SIZE * (Math.random());
      return [lavaPosX, lavaPosY];
    }

    for(var i = 0; i < LAVA_AMOUNT; i++){
      var lava = generateRandomLavaPos();
      this.lavas[i] = new Berry(lava[0], lava[1]);
    }

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
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  handleClick(socket) {
    const clickDT = (Date.now() - this.lastClickUpdateTime) / 1000;
    if(this.players[socket.id]){
      const boosted = this.players[socket.id].boost(clickDT, 0, Constants.BOOST_COOLDOWN);
      if(boosted){
        this.lastClickUpdateTime = Date.now();
      }
    }
  }

  handleKeyPressed(socket) {
    if(this.players[socket.id]){
      if(KeyboardEvent.code === 81){
        debug.log("q");
      }
    }
  }

  update() {
    function generateRandomPos() {
      var berryPosX = Constants.MAP_SIZE * (Math.random());
      var berryPosY = Constants.MAP_SIZE * (Math.random());
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

    // Update the player's tier

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullet = player.update(dt);
      if (newBullet) {
        this.bullets.push(newBullet);
      }
    });

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
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    Object.keys(this.sockets).forEach(playerID => {
      getTier(this.players[playerID].tier);
    });

    // Apply collisions
    const destroyedBerries = applyCollisions(Object.values(this.players), this.berries, 0, dt, availablePlayerTier);
    this.berries = this.berries.filter(berry => !destroyedBerries.includes(berry));

    const destroyedMelons = applyCollisions(Object.values(this.players), this.melons, 4, dt, availablePlayerTier);
    this.melons = this.melons.filter(berry => !destroyedMelons.includes(berry));

    const destroyedMushrooms = applyCollisions(Object.values(this.players), this.mushrooms, 5, dt, availablePlayerTier);
    this.mushrooms = this.mushrooms.filter(berry => !destroyedMushrooms.includes(berry));

    const destroyedBlackberries = applyCollisions(Object.values(this.players), this.blackberries, 6, dt, availablePlayerTier);
    this.blackberries = this.blackberries.filter(berry => !destroyedBlackberries.includes(berry));

    const destroyedCarrots = applyCollisions(Object.values(this.players), this.carrots, 7, dt, availablePlayerTier);
    this.carrots = this.carrots.filter(berry => !destroyedCarrots.includes(berry));

    const destroyedLilypads = applyCollisions(Object.values(this.players), this.lilypads, 8, dt, availablePlayerTier);
    this.lilypads = this.lilypads.filter(berry => !destroyedLilypads.includes(berry));

    const destroyedRedMushrooms = applyCollisions(Object.values(this.players), this.redMushrooms, 9, dt, availablePlayerTier);
    this.redMushrooms = this.redMushrooms.filter(berry => !destroyedRedMushrooms.includes(berry));

    const destroyedWatermelonSlices = applyCollisions(Object.values(this.players), this.watermelonSlices, 10, dt, availablePlayerTier);
    this.watermelonSlices = this.watermelonSlices.filter(berry => !destroyedWatermelonSlices.includes(berry));

    const destroyedBananas = applyCollisions(Object.values(this.players), this.bananas, 11, dt, availablePlayerTier);
    this.bananas = this.bananas.filter(berry => !destroyedBananas.includes(berry));

    const destroyedCoconuts = applyCollisions(Object.values(this.players), this.coconuts, 12, dt, availablePlayerTier);
    this.coconuts = this.coconuts.filter(berry => !destroyedCoconuts.includes(berry));

    const destroyedPears = applyCollisions(Object.values(this.players), this.pears, 13, dt, availablePlayerTier);
    this.pears = this.pears.filter(berry => !destroyedPears.includes(berry));

    const destroyedMushroomBushes = applyCollisions(Object.values(this.players), this.mushroomBushes, 14, dt, availablePlayerTier);
    this.mushroomBushes = this.mushroomBushes.filter(berry => !destroyedMushroomBushes.includes(berry));
    
    const destroyedWatermelons = applyCollisions(Object.values(this.players), this.watermelons, 15, dt, availablePlayerTier);
    this.watermelons = this.watermelons.filter(berry => !destroyedWatermelons.includes(berry));

    const destroyedLavas = applyCollisions(Object.values(this.players), this.lavas, 1, dt, availablePlayerTier);
    this.lavas = this.lavas.filter(lava => !destroyedBerries.includes(lava));

    const destroyedPlayers = applyCollisions(Object.values(this.players), Object.values(this.players), 3, dt, availablePlayerTier);

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
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
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    
    /*const nearbyBerries = this.berries.filter(
      be => be.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );*/

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      berries: this.berries.map(b => b.serializeForUpdate()),
      melons: this.melons.map(b => b.serializeForUpdate()),
      blackberries: this.blackberries.map(b => b.serializeForUpdate()),
      carrots: this.carrots.map(b => b.serializeForUpdate()),
      lilypads: this.lilypads.map(b => b.serializeForUpdate()),
      redMushrooms: this.redMushrooms.map(b => b.serializeForUpdate()),
      watermelonSlices: this.watermelonSlices.map(b => b.serializeForUpdate()),
      bananas: this.bananas.map(b => b.serializeForUpdate()),
      coconuts: this.coconuts.map(b => b.serializeForUpdate()),
      pears: this.pears.map(b => b.serializeForUpdate()),
      mushroomBushes: this.mushroomBushes.map(b => b.serializeForUpdate()),
      watermelons: this.watermelons.map(b => b.serializeForUpdate()),
      mushrooms: this.mushrooms.map(b => b.serializeForUpdate()),
      lavas: this.lavas.map(b => b.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
