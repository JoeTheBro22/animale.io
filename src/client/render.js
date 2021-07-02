// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { BERRY_RADIUS } from '../shared/constants';
import { LAVA_RADIUS } from '../shared/constants';
import { ROCK_RADIUS } from '../shared/constants';
import { TIER_1_SIZE, TIER_2_SIZE, TIER_3_SIZE, TIER_4_SIZE, TIER_5_SIZE, TIER_6_SIZE, TIER_7_SIZE, TIER_8_SIZE, TIER_9_SIZE, TIER_10_SIZE, TIER_11_SIZE, TIER_12_SIZE, TIER_13_SIZE, TIER_14_SIZE, TIER_15_SIZE, TIER_16_SIZE, } from '../shared/constants';
import { RelativeSizes } from '../shared/constants';
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
  const { me, meD1, meD2, others, bullets, berries, lavas/*, rocks*/} = getCurrentState();
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

  // Draw all lava
  lavas.forEach(renderLava.bind(null, me));

  // Draw all berries
  berries.forEach(renderBerry.bind(null, me));

  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));

  // Draw all rocks
  //rocks.forEach(renderRock.bind(null, me));
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
  //tiers
  {
  if(player.tier < 1){
    context.drawImage(
      getAsset('old mouse.png'),
      -PLAYER_RADIUS * TIER_1_SIZE,
      -PLAYER_RADIUS * TIER_1_SIZE,
      PLAYER_RADIUS * 2 * TIER_1_SIZE,
      PLAYER_RADIUS * 2 * TIER_1_SIZE,
    );
  }
  else if(player.tier < 2){
    context.drawImage(
      getAsset('old rabbit.png'),
      -PLAYER_RADIUS * TIER_2_SIZE,
      -PLAYER_RADIUS * TIER_2_SIZE,
      PLAYER_RADIUS * 2 * TIER_2_SIZE,
      PLAYER_RADIUS * 2 * TIER_2_SIZE,
    );
  } else if(player.tier <3){
    context.drawImage(
      getAsset('old mole.png'),
      -PLAYER_RADIUS * TIER_3_SIZE,
      -PLAYER_RADIUS * TIER_3_SIZE,
      PLAYER_RADIUS * 2 * TIER_3_SIZE,
      PLAYER_RADIUS * 2 * TIER_3_SIZE,
    );
  }
  else if(player.tier <4){
    context.drawImage(
      getAsset('old pig.png'),
      -PLAYER_RADIUS * TIER_4_SIZE,
      -PLAYER_RADIUS * TIER_4_SIZE,
      PLAYER_RADIUS * 2 * TIER_4_SIZE,
      PLAYER_RADIUS * 2 * TIER_4_SIZE,
    );
  }
  else if(player.tier <5){
    context.drawImage(
      getAsset('old deer.png'),
      -PLAYER_RADIUS * TIER_5_SIZE,
      -PLAYER_RADIUS * TIER_5_SIZE,
      PLAYER_RADIUS * 2 * TIER_5_SIZE,
      PLAYER_RADIUS * 2 * TIER_5_SIZE,
    );
  }

  else if(player.tier <6){
    context.drawImage(
      getAsset('old fox.png'),
      -PLAYER_RADIUS * TIER_6_SIZE,
      -PLAYER_RADIUS * TIER_6_SIZE,
      PLAYER_RADIUS * 2 * TIER_6_SIZE,
      PLAYER_RADIUS * 2 * TIER_6_SIZE,
    );
  }

  else if(player.tier <7){
    context.drawImage(
      getAsset('old zebra.png'),
      -PLAYER_RADIUS * TIER_7_SIZE,
      -PLAYER_RADIUS * TIER_7_SIZE,
      PLAYER_RADIUS * 2 * TIER_7_SIZE,
      PLAYER_RADIUS * 2 * TIER_7_SIZE,
    );
  }

  else if(player.tier <8){
    context.drawImage(
      getAsset('old cheetah.png'),
      -PLAYER_RADIUS * TIER_8_SIZE,
      -PLAYER_RADIUS * TIER_8_SIZE,
      PLAYER_RADIUS * 2 * TIER_8_SIZE,
      PLAYER_RADIUS * 2 * TIER_8_SIZE,
    );
  }

  else if(player.tier <9){
    context.drawImage(
      getAsset('old bear.png'),
      -PLAYER_RADIUS * TIER_9_SIZE,
      -PLAYER_RADIUS * TIER_9_SIZE,
      PLAYER_RADIUS * 2 * TIER_9_SIZE,
      PLAYER_RADIUS * 2 * TIER_9_SIZE,
    );
  }

  else if(player.tier <10){
    context.drawImage(
      getAsset('old crocodile.png'),
      -PLAYER_RADIUS * TIER_10_SIZE,
      -PLAYER_RADIUS * TIER_10_SIZE,
      PLAYER_RADIUS * 2 * TIER_10_SIZE,
      PLAYER_RADIUS * 2 * TIER_10_SIZE,
    );
  }

  else if(player.tier <11){
    context.drawImage(
      getAsset('Pakistan Shahbaz.png'),
      -PLAYER_RADIUS * TIER_11_SIZE,
      -PLAYER_RADIUS * TIER_11_SIZE,
      PLAYER_RADIUS * 2 * TIER_11_SIZE,
      PLAYER_RADIUS * 2 * TIER_11_SIZE,
    );
  }

  else if(player.tier <12){
    context.drawImage(
      getAsset('old lion.png'),
      -PLAYER_RADIUS * TIER_12_SIZE,
      -PLAYER_RADIUS * TIER_12_SIZE,
      PLAYER_RADIUS * 2 * TIER_12_SIZE,
      PLAYER_RADIUS * 2 * TIER_12_SIZE,
    );
  }

  else if(player.tier <13){
    context.drawImage(
      getAsset('old dragon.png'),
      -PLAYER_RADIUS * TIER_13_SIZE,
      -PLAYER_RADIUS * TIER_13_SIZE,
      PLAYER_RADIUS * 2 * TIER_13_SIZE,
      PLAYER_RADIUS * 2 * TIER_13_SIZE,
    );
  }

  else if(player.tier <14){
    context.drawImage(
      getAsset('devil croc.png'),
      -PLAYER_RADIUS * TIER_14_SIZE,
      -PLAYER_RADIUS * TIER_14_SIZE,
      PLAYER_RADIUS * 2 * TIER_14_SIZE,
      PLAYER_RADIUS * 2 * TIER_14_SIZE,
    );
  }

  else if(player.tier <15){
    context.drawImage(
      getAsset('old black dragon.png'),
      -PLAYER_RADIUS * TIER_15_SIZE,
      -PLAYER_RADIUS * TIER_15_SIZE,
      PLAYER_RADIUS * 2 * TIER_15_SIZE,
      PLAYER_RADIUS * 2 * TIER_15_SIZE,
    );
  }

  else if(player.tier <16){
    context.drawImage(
      getAsset('blank.png'),
      -PLAYER_RADIUS * TIER_16_SIZE,
      -PLAYER_RADIUS * TIER_16_SIZE,
      PLAYER_RADIUS * 2 * TIER_16_SIZE,
      PLAYER_RADIUS * 2 * TIER_16_SIZE,
    );
  } 
  
  }
  context.restore();
  // Draw health bar
  context.fillStyle = "#19CD2A";
  context.fillRect(
    canvasX - 0.5 * PLAYER_RADIUS * Constants.RelativeSizes[player.tier],
    canvasY - PLAYER_RADIUS * Constants.RelativeSizes[player.tier] - 10,
    PLAYER_RADIUS * Constants.RelativeSizes[player.tier],
    12,
  );
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - 0.5 * PLAYER_RADIUS * Constants.RelativeSizes[player.tier] + PLAYER_RADIUS * Constants.RelativeSizes[player.tier] * player.hp / PLAYER_MAX_HP,
    canvasY - PLAYER_RADIUS * Constants.RelativeSizes[player.tier] - 10,
    PLAYER_RADIUS * (1 - player.hp / PLAYER_MAX_HP) * Constants.RelativeSizes[player.tier],
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

function renderRock(me, rock) {
  const { x, y } = rock;
  context.drawImage(
    getAsset('rock.png'),
    canvas.width / 2 + x - me.x - ROCK_RADIUS,
    canvas.height / 2 + y - me.y - ROCK_RADIUS,
    ROCK_RADIUS * 2,
    ROCK_RADIUS * 2,
  );
}

function renderLava(me, lava) {
  const { x, y } = lava;
  context.drawImage(
    getAsset('slime.png'),
    canvas.width / 2 + x - me.x - LAVA_RADIUS,
    canvas.height / 2 + y - me.y - LAVA_RADIUS,
    LAVA_RADIUS * 2,
    LAVA_RADIUS * 2,
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