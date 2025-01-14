const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');

const Constants = require('../shared/constants');
const Game = require('./game');
const webpackConfig = require('../../webpack.dev.js');

// Setup an Express server
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
} else {
  // Static serve the dist/ folder in production
  app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  socket.on(Constants.MSG_TYPES.MOUSE_INPUT, handleClick);
  socket.on(Constants.MSG_TYPES.KEY_PRESSED, handleKeyInput);
  socket.on(Constants.MSG_TYPES.SPEED_INPUT, handleSpeed);
  socket.on(Constants.MSG_TYPES.CHAT, handleChat);
  socket.on(Constants.MSG_TYPES.UPGRADE, handleUpgrade);
  socket.on(Constants.MSG_TYPES.MOBILE_ABILITY, handleMobileAbility);
  socket.on(Constants.MSG_TYPES.SECOND_MOBILE_ABILITY, handleSecondMobileAbility);
  socket.on(Constants.MSG_TYPES.MOBILE_BOOST, handleMobileBoost);
  socket.on('disconnect', onDisconnect);
});

// Setup the Game
const game = new Game();

function joinGame(username) {
  game.addPlayer(this, username);
}

function handleInput(dir) {
  game.handleInput(this, dir);
}

function handleClick() {
  game.handleClick(this);
}

function handleUpgrade(index) {
  game.handleUpgrade(this, index);
}

function handleChat(message) {
  game.handleChat(this, message);
}

function handleKeyInput(keyPressed) {
  game.handleKeyPressed(this, keyPressed);
}

function handleMobileAbility(){
  game.handleKeyPressed(this, 'q');
}

function handleSecondMobileAbility(){
  game.handleKeyPressed(this, 'w');
}

function handleMobileBoost(){
  game.handleKeyPressed(this, 'e');
}

function handleSpeed(x, y, canvasWidth, canvasHeight) {
  game.handleSpeed(this, x, y, canvasWidth, canvasHeight);
}

function onDisconnect() {
  game.removePlayer(this);
}
