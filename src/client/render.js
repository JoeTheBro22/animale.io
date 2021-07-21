// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { BERRY_RADIUS } from '../shared/constants';
import { MELON_RADIUS } from '../shared/constants';
import { BLACKBERRY_RADIUS } from '../shared/constants';
import { CARROT_RADIUS } from '../shared/constants';
import { LILYPAD_RADIUS } from '../shared/constants';
import { RED_MUSHROOM_RADIUS } from '../shared/constants';
import { WATERMELON_SLICE_RADIUS } from '../shared/constants';
import { BANANA_RADIUS } from '../shared/constants';
import { COCONUT_RADIUS } from '../shared/constants';
import { PEAR_RADIUS } from '../shared/constants';
import { MUSHROOM_BUSH_RADIUS } from '../shared/constants';
import { WATERMELON_RADIUS } from '../shared/constants';
import { MUSHROOM_RADIUS } from '../shared/constants';
import { LAVA_RADIUS } from '../shared/constants';
import { ROCK_RADIUS } from '../shared/constants';
import { TIER_1_SIZE, TIER_2_SIZE, TIER_3_SIZE, TIER_4_SIZE, TIER_5_SIZE, TIER_6_SIZE, TIER_7_SIZE, TIER_8_SIZE, TIER_9_SIZE, TIER_10_SIZE, TIER_11_SIZE, TIER_12_SIZE, TIER_13_SIZE, TIER_14_SIZE, TIER_15_SIZE, TIER_16_SIZE, } from '../shared/constants';
import { RelativeSizes } from '../shared/constants';
import { TierXP } from '../shared/constants';
import { getAsset } from './assets';
import { getCurrentState } from './state';
var state = require('./state.js');

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
  const { me, others, bullets, berries, melons, blackberries, carrots, lilypads, redMushrooms, watermelonSlices, bananas, coconuts, pears, mushroomBushes, watermelons, mushrooms, lavas/*, rocks*/} = getCurrentState();
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

  // Draw all melons
  melons.forEach(renderMelon.bind(null, me));

  // Draw all mushrooms
  mushrooms.forEach(renderMushroom.bind(null, me));

  // Draw other foods
  blackberries.forEach(renderBlackberry.bind(null, me));
  carrots.forEach(renderCarrot.bind(null, me));
  lilypads.forEach(renderLilypad.bind(null, me));
  redMushrooms.forEach(renderRedMushroom.bind(null, me));
  watermelonSlices.forEach(renderWatermelonSlice.bind(null, me));
  bananas.forEach(renderBanana.bind(null, me));
  coconuts.forEach(renderCoconut.bind(null, me));
  pears.forEach(renderPear.bind(null, me));
  mushroomBushes.forEach(renderMushroomBush.bind(null, me));
  watermelons.forEach(renderWatermelon.bind(null, me));

  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));

  // Draw all rocks
  //rocks.forEach(renderRock.bind(null, me));

  //Draw xp bar
  renderXPBar(me, me);
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
      getAsset('termite.png'),
      -PLAYER_RADIUS * TIER_1_SIZE,
      -PLAYER_RADIUS * TIER_1_SIZE,
      PLAYER_RADIUS * 2 * TIER_1_SIZE,
      PLAYER_RADIUS * 2 * TIER_1_SIZE,
    );
  }
  else if(player.tier < 2){
    context.drawImage(
      getAsset('ant.png'),
      -PLAYER_RADIUS * TIER_2_SIZE,
      -PLAYER_RADIUS * TIER_2_SIZE,
      PLAYER_RADIUS * 2 * TIER_2_SIZE,
      PLAYER_RADIUS * 2 * TIER_2_SIZE,
    );
  } else if(player.tier <3){
    context.drawImage(
      getAsset('squirrel.png'),
      -PLAYER_RADIUS * TIER_3_SIZE,
      -PLAYER_RADIUS * TIER_3_SIZE,
      PLAYER_RADIUS * 2 * TIER_3_SIZE,
      PLAYER_RADIUS * 2 * TIER_3_SIZE,
    );
  }
  else if(player.tier <4){
    context.drawImage(
      getAsset('hummingbird.png'),
      -PLAYER_RADIUS * TIER_4_SIZE,
      -PLAYER_RADIUS * TIER_4_SIZE,
      PLAYER_RADIUS * 2 * TIER_4_SIZE,
      PLAYER_RADIUS * 2 * TIER_4_SIZE,
    );
  }
  else if(player.tier <5){
    context.drawImage(
      getAsset('garden snake.png'),
      -PLAYER_RADIUS * TIER_5_SIZE,
      -PLAYER_RADIUS * TIER_5_SIZE,
      PLAYER_RADIUS * 2 * TIER_5_SIZE,
      PLAYER_RADIUS * 2 * TIER_5_SIZE,
    );
  }

  else if(player.tier <6){
    context.drawImage(
      getAsset('rooster.png'),
      -PLAYER_RADIUS * TIER_6_SIZE,
      -PLAYER_RADIUS * TIER_6_SIZE,
      PLAYER_RADIUS * 2 * TIER_6_SIZE,
      PLAYER_RADIUS * 2 * TIER_6_SIZE,
    );
  }

  else if(player.tier <7){
    context.drawImage(
      getAsset('barn owl.png'),
      -PLAYER_RADIUS * TIER_7_SIZE,
      -PLAYER_RADIUS * TIER_7_SIZE,
      PLAYER_RADIUS * 2 * TIER_7_SIZE,
      PLAYER_RADIUS * 2 * TIER_7_SIZE,
    );
  }

  else if(player.tier <8){
    context.drawImage(
      getAsset('ocelot.png'),
      -PLAYER_RADIUS * TIER_8_SIZE,
      -PLAYER_RADIUS * TIER_8_SIZE,
      PLAYER_RADIUS * 2 * TIER_8_SIZE,
      PLAYER_RADIUS * 2 * TIER_8_SIZE,
    );
  }

  else if(player.tier <9){
    context.drawImage(
      getAsset('zebra.png'),
      -PLAYER_RADIUS * TIER_9_SIZE,
      -PLAYER_RADIUS * TIER_9_SIZE,
      PLAYER_RADIUS * 2 * TIER_9_SIZE,
      PLAYER_RADIUS * 2 * TIER_9_SIZE,
    );
  }

  else if(player.tier <10){
    context.drawImage(
      getAsset('kangaroo.png'),
      -PLAYER_RADIUS * TIER_10_SIZE,
      -PLAYER_RADIUS * TIER_10_SIZE,
      PLAYER_RADIUS * 2 * TIER_10_SIZE,
      PLAYER_RADIUS * 2 * TIER_10_SIZE,
    );
  }

  else if(player.tier <11){
    context.drawImage(
      getAsset('ostrich.png'),
      -PLAYER_RADIUS * TIER_11_SIZE,
      -PLAYER_RADIUS * TIER_11_SIZE,
      PLAYER_RADIUS * 2 * TIER_11_SIZE,
      PLAYER_RADIUS * 2 * TIER_11_SIZE,
    );
  }

  else if(player.tier <12){
    context.drawImage(
      getAsset('mammoth.png'),
      -PLAYER_RADIUS * TIER_12_SIZE,
      -PLAYER_RADIUS * TIER_12_SIZE,
      PLAYER_RADIUS * 2 * TIER_12_SIZE,
      PLAYER_RADIUS * 2 * TIER_12_SIZE,
    );
  }

  else if(player.tier <13){
    context.drawImage(
      getAsset('horse.png'),
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

  // Draw name
  context.fillStyle = "white";
  context.font = "15px Arial";
  context.textAlign = "center";
  let UsernameFix = player.username.replace('NaN','');
  if(UsernameFix.length <= 1 || (parseInt(UsernameFix) != undefined && parseInt(UsernameFix) >= 0)){
    context.fillText("Anonymous", canvasX, canvasY - 15 - PLAYER_RADIUS * Constants.RelativeSizes[player.tier]);
  }
  else if(UsernameFix.length <= 15){
    context.fillText(UsernameFix, canvasX, canvasY - 15 - PLAYER_RADIUS * Constants.RelativeSizes[player.tier]);
  } else{
    context.fillText(UsernameFix.slice(0, 15) , canvasX, canvasY - 15 - PLAYER_RADIUS * Constants.RelativeSizes[player.tier]);
  }
  
  /*
  -PLAYER_RADIUS * TIER_1_SIZE,
  -PLAYER_RADIUS * TIER_1_SIZE,
  PLAYER_RADIUS * 2 * TIER_1_SIZE,
  PLAYER_RADIUS * 2 * TIER_1_SIZE,
  */

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

function renderXPBar(me, player) {
  const { x, y } = player;
  // Draw XP bar
  context.fillStyle = 'black';
  context.fillRect(
    canvas.width / 2 - me.x + x + 15 - canvas.width / 2,
    canvas.height / 2 - me.y + y + canvas.height / 2 - 30,
    canvas.width - 30,
    30,
  );
  
  context.fillStyle = "#e8c852";
  context.fillRect(
    canvas.width / 2 - me.x + x + 15 - canvas.width / 2,
    canvas.height / 2 - me.y + y + canvas.height / 2 - 30,
    (player.score - Constants.TierXP[player.tier]) / (Constants.TierXP[player.tier + 1] - Constants.TierXP[player.tier]) * canvas.width - 15,
    30,
  );

  // Draw the text to render
  context.fillStyle = 'white';
  const nextTierXP = Constants.TierXP[player.tier + 1];
  context.font = "15px Arial";
  context.textAlign = "center";
  context.fillText(Math.floor(player.score) + " xp (Next animal at " + nextTierXP + " xp)", canvas.width / 2, canvas.height - 7.5);
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

function renderMelon(me, melon) {
  const { x, y } = melon;
  context.drawImage(
    getAsset('melon.png'),
    canvas.width / 2 + x - me.x - MELON_RADIUS,
    canvas.height / 2 + y - me.y - MELON_RADIUS,
    MELON_RADIUS * 2,
    MELON_RADIUS * 2,
  );
}

function renderMushroom(me, mushroom) {
  const { x, y } = mushroom;
  context.drawImage(
    getAsset('mushroom.png'),
    canvas.width / 2 + x - me.x - MUSHROOM_RADIUS,
    canvas.height / 2 + y - me.y - MUSHROOM_RADIUS,
    MUSHROOM_RADIUS * 2,
    MUSHROOM_RADIUS * 2,
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

function renderBlackberry(me, blackberry) {
  const { x, y } = blackberry;
  context.drawImage(
    getAsset('blackberry.png'),
    canvas.width / 2 + x - me.x - BLACKBERRY_RADIUS,
    canvas.height / 2 + y - me.y - BLACKBERRY_RADIUS,
    BLACKBERRY_RADIUS * 2,
    BLACKBERRY_RADIUS * 2,
  );
}

function renderCarrot(me, carrot) {
  const { x, y } = carrot;
  context.drawImage(
    getAsset('carrot.png'),
    canvas.width / 2 + x - me.x - CARROT_RADIUS,
    canvas.height / 2 + y - me.y - CARROT_RADIUS,
    CARROT_RADIUS * 2,
    CARROT_RADIUS * 2,
  );
}

function renderLilypad(me, lilypad) {
  const { x, y } = lilypad;
  context.drawImage(
    getAsset('lilypad.png'),
    canvas.width / 2 + x - me.x - LILYPAD_RADIUS,
    canvas.height / 2 + y - me.y - LILYPAD_RADIUS,
    LILYPAD_RADIUS * 2,
    LILYPAD_RADIUS * 2,
  );
}

function renderRedMushroom(me, redMushroom) {
  const { x, y } = redMushroom;
  context.drawImage(
    getAsset('red mushroom.png'),
    canvas.width / 2 + x - me.x - RED_MUSHROOM_RADIUS,
    canvas.height / 2 + y - me.y - RED_MUSHROOM_RADIUS,
    RED_MUSHROOM_RADIUS * 2,
    RED_MUSHROOM_RADIUS * 2,
  );
}

function renderWatermelonSlice(me, watermelonSlice) {
  const { x, y } = watermelonSlice;
  context.drawImage(
    getAsset('watermelon slice.png'),
    canvas.width / 2 + x - me.x - WATERMELON_SLICE_RADIUS,
    canvas.height / 2 + y - me.y - WATERMELON_SLICE_RADIUS,
    WATERMELON_SLICE_RADIUS * 2,
    WATERMELON_SLICE_RADIUS * 2,
  );
}

function renderBanana(me, banana) {
  const { x, y } = banana;
  context.drawImage(
    getAsset('banana.png'),
    canvas.width / 2 + x - me.x - BANANA_RADIUS,
    canvas.height / 2 + y - me.y - BANANA_RADIUS,
    BANANA_RADIUS * 2,
    BANANA_RADIUS * 2,
  );
}

function renderCoconut(me, coconut) {
  const { x, y } = coconut;
  context.drawImage(
    getAsset('coconut.png'),
    canvas.width / 2 + x - me.x - COCONUT_RADIUS,
    canvas.height / 2 + y - me.y - COCONUT_RADIUS,
    COCONUT_RADIUS * 2,
    COCONUT_RADIUS * 2,
  );
}

function renderPear(me, pear) {
  const { x, y } = pear;
  context.drawImage(
    getAsset('pear.png'),
    canvas.width / 2 + x - me.x - PEAR_RADIUS,
    canvas.height / 2 + y - me.y - PEAR_RADIUS,
    PEAR_RADIUS * 2,
    PEAR_RADIUS * 2,
  );
}


function renderMushroomBush(me, mushroomBush) {
  const { x, y } = mushroomBush;
  context.drawImage(
    getAsset('mushroom bush.png'),
    canvas.width / 2 + x - me.x - MUSHROOM_BUSH_RADIUS,
    canvas.height / 2 + y - me.y - MUSHROOM_BUSH_RADIUS,
    MUSHROOM_BUSH_RADIUS * 2,
    MUSHROOM_BUSH_RADIUS * 2,
  );
}

function renderWatermelon(me, watermelon) {
  const { x, y } = watermelon;
  context.drawImage(
    getAsset('watermelon.png'),
    canvas.width / 2 + x - me.x - WATERMELON_RADIUS,
    canvas.height / 2 + y - me.y - WATERMELON_RADIUS,
    WATERMELON_RADIUS * 2,
    WATERMELON_RADIUS * 2,
  );
}

function renderLava(me, lava) {
  const { x, y } = lava;
  context.drawImage(
    getAsset('lava.png'),
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