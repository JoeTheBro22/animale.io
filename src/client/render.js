// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { BERRY_RADIUS } from '../shared/constants';
import { getAsset } from './assets';
import { getCurrentState } from './state';
//var state = require('./state.js');

const Constants = require('../shared/constants');
const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));


function render() 
{
  const { me, others, bullets, berries} = getCurrentState();
  if (!me) {
    return;
  }

  // Draw background
  renderBackground(me.x, me.y);

  // Draw boundaries
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

  // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me));

  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));

  // Draw all berries
  berries.forEach(renderBerry.bind(null, me));
}

function renderBackground() {
  context.fillStyle = "#40ba55";
  context.fillRect(0,0,canvas.width,canvas.height);
}

/*function renderBerry()
{
  context.drawImage(getAsset('berry.png'), berryPosX-me.x, berryPosY-me.y, BERRY_RADIUS, BERRY_RADIUS);
  //context.drawImage(getAsset('berry.png'), x, y, BERRY_RADIUS, BERRY_RADIUS);
  //x: (canvas.width/2)-me.x + Math.floor(Math.random()*canvas.height)
  //y: (canvas.height/2)-me.y + Math.floor(Math.random()*canvas.height)
}*/

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  //will add tiers code later
  context.drawImage(
    getAsset('robo mouse.png'),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();

  // Draw health bar
  context.fillStyle = "#19CD2A";
  context.fillRect(
    canvasX - 0.5 * PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS - 90,
    PLAYER_RADIUS,
    12,
  );
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - 0.5 * PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / PLAYER_MAX_HP,
    canvasY + PLAYER_RADIUS - 90,
    PLAYER_RADIUS * (1 - player.hp / PLAYER_MAX_HP),
    12,
  );
}

function renderBullet(me, bullet) {
  const { x, y } = bullet;
  context.drawImage(
    getAsset('bullet.svg'),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
}

function renderBerry(me, berry) {
  const { x, y } = berry;
  context.drawImage(
    getAsset('berry.png'),
    canvas.width / 2 + x - me.x - BERRY_RADIUS,
    canvas.height / 2 + y - me.y - BERRY_RADIUS,
    BERRY_RADIUS * 2,
    BERRY_RADIUS * 2,
  );
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}