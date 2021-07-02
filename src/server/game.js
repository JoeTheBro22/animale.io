const Constants = require('../shared/constants');
const Player = require('./player');
const Berry = require('./berry');
const applyCollisions = require('./collisions');
const { BERRY_AMOUNT, TIER_1_XP } = require('../shared/constants');
const { LAVA_AMOUNT } = require('../shared/constants');
const { ROCK_AMOUNT } = require('../shared/constants');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.berries = [];
    this.lavas = [];
    //this.rocks = [];
    // Add code to populate berries array
    function generateRandomPos() {
      var berryPosX = Constants.MAP_SIZE * (Math.random());
      var berryPosY = Constants.MAP_SIZE * (Math.random());
      return [berryPosX, berryPosY];
    }

    for(var i = 0; i < BERRY_AMOUNT; i++){
      var berry = generateRandomPos();
      this.berries[i] = new Berry(berry[0], berry[1]);
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
    setInterval(this.update.bind(this), 1000 / 60);
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
      this.players[socket.id].boost(clickDT, 0);
      this.lastClickUpdateTime = Date.now();
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
      lavas: this.lavas.map(b => b.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
