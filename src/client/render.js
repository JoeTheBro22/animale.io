// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { BERRY_RADIUS, MELON_RADIUS, BLACKBERRY_RADIUS, CARROT_RADIUS, LILYPAD_RADIUS, RED_MUSHROOM_RADIUS, WATERMELON_SLICE_RADIUS, BANANA_RADIUS, COCONUT_RADIUS, PEAR_RADIUS, MUSHROOM_BUSH_RADIUS, WATERMELON_RADIUS, MUSHROOM_RADIUS, LAVA_RADIUS, MAGEBALL_RADIUS, SNAKEBITE_RADIUS, PORTAL_RADIUS, SLIMEBALL_RADIUS, HORSEKICK_RADIUS, TRUNKHIT_RADIUS, LAKE_RADIUS, PLAYER_FIRE_COOLDOWN } from '../shared/constants';
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
  const { me, others, bullets, berries, melons, blackberries, carrots, lilypads, redMushrooms, watermelonSlices, bananas, coconuts, pears, mushroomBushes, watermelons, mushrooms, lavas, mageBalls, snakeBites, portals, slimeBalls, horseKicks, boostPads, trunkHits, venoms, lakes /*, rocks*/} = getCurrentState();
  if (!me) {
    return;
  }

  // Draw background
  renderBackground();

  // Draw Water
  renderWater(me);

  lakes.forEach(renderLake.bind(null, me));

  // Draw boundaries
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

  // Draw all bullets
  //bullets.forEach(renderBullet.bind(null, me));

  // Draw all lava and other terrain
  lavas.forEach(renderLava.bind(null, me));

  boostPads.forEach(renderBoostpad.bind(null, me));

  // Draw all players that can hide under foods
  if(me.tier < 2){
    renderPlayer(me, me);
  }

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

  // Draw Ability Projectiles
  mageBalls.forEach(renderMageball.bind(null, me));
  slimeBalls.forEach(renderSlimeball.bind(null, me));
  snakeBites.forEach(renderSnakebite.bind(null, me));
  horseKicks.forEach(renderHorseKick.bind(null, me));
  trunkHits.forEach(renderTrunkHit.bind(null, me));
  venoms.forEach(renderVenom.bind(null, me));

  // Draw all players that can't hide under foods
  if(me.tier >= 2){
    renderPlayer(me, me);
  }

  others.forEach(renderPlayer.bind(null, me));

  // Draw all portals
  portals.forEach(renderPortal.bind(null, me));

  // Draw all rocks
  //rocks.forEach(renderRock.bind(null, me));

  //Draw xp bar
  renderXPBar(me, me);

  renderMinimap(me, lavas, others, boostPads, lakes);

  renderLocalMessage(me);
}

function renderBackground() {
  context.fillStyle = "#40BA55";
  context.fillRect(0,0,canvas.width,canvas.height);
}

function renderMinimap(me, lavas, others, boostPads, lakes) {

  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(
    15,
    15,
    215,
    215,
  );

  context.fillStyle = "#24a83a";
  context.fillRect(
    15,
    15,
    215,
    215,
  );

  // Drawing water
  context.fillStyle = "#27e7e7";
  context.fillRect(
    15,
    15,
    100,
    100,
  );

  for(var l = 0; l < lakes.length; l++){
    if(lakes[l].x !== null && lakes[l].y !== null){
      context.drawImage(
        getAsset('lake.png'),
        lakes[l].x/Constants.MAP_SIZE * 200 + 15 - (Constants.LAKE_RADIUS/Constants.MAP_SIZE * 200)/2,
        lakes[l].y/Constants.MAP_SIZE * 200 + 15 - (Constants.LAKE_RADIUS/Constants.MAP_SIZE * 200)/2, // lowercase L
        Constants.LAKE_RADIUS/Constants.MAP_SIZE * 200,
        Constants.LAKE_RADIUS/Constants.MAP_SIZE * 200,
      );
    }
  }

  for(var l = 0; l < lavas.length; l++){
    if(lavas[l].x !== null && lavas[l].y !== null){
      context.drawImage(
        getAsset('lava.png'),
        lavas[l].x/Constants.MAP_SIZE * 200 + 10,
        lavas[l].y/Constants.MAP_SIZE * 200 + 10, // lowercase L
        10,
        10,
      );
    }
  }

  for(var l = 0; l < boostPads.length; l++){
    if(boostPads[l].x !== null && boostPads[l].y !== null){
      context.save();
      context.translate(boostPads[l].x/Constants.MAP_SIZE * 200 + 15, boostPads[l].y/Constants.MAP_SIZE * 200 + 15); // lowercase L
      context.rotate(boostPads[l].direction);
      context.drawImage(
        getAsset('boost pad.png'),
        - 10/2,
        - 10/2,
        10,
        10,
      );
      context.restore();
    }
  }

  context.drawImage(
    getAsset('portal.png'),
    15,
    15, // lowercase L
    20,
    20,
  );

  context.drawImage(
    getAsset('portal.png'),
    210,
    210, // lowercase L
    20,
    20,
  );

  context.drawImage(
    getAsset('portal.png'),
    15,
    210, // lowercase L
    20,
    20,
  );

  context.drawImage(
    getAsset('portal.png'),
    210,
    15, // lowercase L
    20,
    20,
  );

  context.fillStyle = "grey";
  for(var o = 0; o < others.length; o++){
    if(others[o].tier !== null && others[o].x !== null && others[o].y !== null){
      if(me.tier > others[o].tier){
        context.beginPath();
        context.arc(10 + others[o].x/Constants.MAP_SIZE * 200, 10 + others[o].y/Constants.MAP_SIZE * 200, 3, 0, 2 * Math.PI);
        context.fill();
      } else if(me.tier == others[o].tier){
        context.beginPath();
        context.arc(10 + others[o].x/Constants.MAP_SIZE * 200, 10 + others[o].y/Constants.MAP_SIZE * 200, 5, 0, 2 * Math.PI);
        context.fill();
      } else{
        context.beginPath();
        context.arc(10 + others[o].x/Constants.MAP_SIZE * 200, 10 + others[o].y/Constants.MAP_SIZE * 200, 7, 0, 2 * Math.PI);
        context.fill();
      }
    }
  }

  context.fillStyle = "white";
  /*context.ellipse(15 + me.x/Constants.MAP_SIZE * 200, 15 + me.y/Constants.MAP_SIZE * 200, 5, 5, Math.PI / 4, 0, 2 * Math.PI);
  context.fill();*/
  context.beginPath();
  context.arc(15 + me.x/Constants.MAP_SIZE * 200, 15 + me.y/Constants.MAP_SIZE * 200, 5, 0, 2 * Math.PI);
  context.fill();
}

function renderWater(me){
  // Drawing water
  context.fillStyle = "#a6ffff";
  const canvasX = canvas.width / 2 - me.x;
  const canvasY = canvas.height / 2 - me.y;
  context.fillRect(canvasX, canvasY, MAP_SIZE / 2, MAP_SIZE / 2);
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
  if(Math.abs(player.x - me.x) <= canvas.width + 10 && Math.abs(player.y - me.y) <= canvas.height + 10){
    const { x, y, direction } = player;
    const canvasX = canvas.width / 2 + x - me.x;
    const canvasY = canvas.height / 2 + y - me.y;

    // Draw Hitbox
    /*context.fillStyle = "orange";
    context.beginPath();
    context.ellipse(canvasX, canvasY, PLAYER_RADIUS * Constants.RelativeSizes[player.tier], PLAYER_RADIUS * Constants.RelativeSizes[player.tier], 0, Math.PI * 2, 0, 2 * Math.PI);
    context.stroke();*/

    // Draw ship
    context.save();
    context.translate(canvasX, canvasY);
    context.rotate(direction);

    if(player.invincible){
      context.globalAlpha = 0.8;
    }
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
      if(player.flying){
        context.drawImage(
          getAsset('barn owl flying.png'),
          -PLAYER_RADIUS * TIER_7_SIZE * player.flightSizeOffset,
          -PLAYER_RADIUS * TIER_7_SIZE * player.flightSizeOffset,
          PLAYER_RADIUS * 2 * TIER_7_SIZE * player.flightSizeOffset,
          PLAYER_RADIUS * 2 * TIER_7_SIZE * player.flightSizeOffset,
        );
      } else{
        context.drawImage(
          getAsset('barn owl.png'),
          -PLAYER_RADIUS * TIER_7_SIZE,
          -PLAYER_RADIUS * TIER_7_SIZE,
          PLAYER_RADIUS * 2 * TIER_7_SIZE,
          PLAYER_RADIUS * 2 * TIER_7_SIZE,
        );
      }
    }

    else if(player.tier < 8){
      if(player.rareNumber < 1.9){
        context.drawImage(
          getAsset('ocelot.png'),
          -PLAYER_RADIUS * TIER_14_SIZE,
          -PLAYER_RADIUS * TIER_14_SIZE,
          PLAYER_RADIUS * 2 * TIER_14_SIZE,
          PLAYER_RADIUS * 2 * TIER_14_SIZE,
        );
      } else{
        context.drawImage(
          getAsset('realistic cheetah.png'),
          -PLAYER_RADIUS * TIER_14_SIZE,
          -PLAYER_RADIUS * TIER_14_SIZE,
          PLAYER_RADIUS * 2 * TIER_14_SIZE,
          PLAYER_RADIUS * 2 * TIER_14_SIZE,
        );
      }
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
      if(player.jump){
        context.drawImage(
          getAsset('kangaroo jump.png'),
          -PLAYER_RADIUS * TIER_10_SIZE * player.flightSizeOffset,
          -PLAYER_RADIUS * TIER_10_SIZE * player.flightSizeOffset,
          PLAYER_RADIUS * 2 * TIER_10_SIZE * player.flightSizeOffset,
          PLAYER_RADIUS * 2 * TIER_10_SIZE * player.flightSizeOffset,
        );
      }else {
        context.drawImage(
          getAsset('kangaroo.png'),
          -PLAYER_RADIUS * TIER_10_SIZE * player.flightSizeOffset,
          -PLAYER_RADIUS * TIER_10_SIZE * player.flightSizeOffset,
          PLAYER_RADIUS * 2 * TIER_10_SIZE * player.flightSizeOffset,
          PLAYER_RADIUS * 2 * TIER_10_SIZE * player.flightSizeOffset,
        );
      }
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

    else if(player.tier < 14){
      if(player.rareNumber < 0.1){
        context.drawImage(
          getAsset('realistic dragon.png'),
          -PLAYER_RADIUS * TIER_14_SIZE,
          -PLAYER_RADIUS * TIER_14_SIZE,
          PLAYER_RADIUS * 2 * TIER_14_SIZE,
          PLAYER_RADIUS * 2 * TIER_14_SIZE,
        );
      }
      else if(player.rareNumber < 1){
        context.drawImage(
          getAsset('slime.png'),
          -PLAYER_RADIUS * TIER_14_SIZE,
          -PLAYER_RADIUS * TIER_14_SIZE,
          PLAYER_RADIUS * 2 * TIER_14_SIZE,
          PLAYER_RADIUS * 2 * TIER_14_SIZE,
        );
      } else{
        context.drawImage(
          getAsset('slime 2.png'),
          -PLAYER_RADIUS * TIER_14_SIZE,
          -PLAYER_RADIUS * TIER_14_SIZE,
          PLAYER_RADIUS * 2 * TIER_14_SIZE,
          PLAYER_RADIUS * 2 * TIER_14_SIZE,
        );
      }
    }

    else if(player.tier <15){
      context.drawImage(
        getAsset('wizard.png'),
        -PLAYER_RADIUS * TIER_15_SIZE,
        -PLAYER_RADIUS * TIER_15_SIZE,
        PLAYER_RADIUS * 2 * TIER_15_SIZE,
        PLAYER_RADIUS * 2 * TIER_15_SIZE,
      );
    }

    else if(player.tier <16){
      context.drawImage(
        getAsset('sea snake.png'),
        -PLAYER_RADIUS * TIER_16_SIZE,
        -PLAYER_RADIUS * TIER_16_SIZE,
        PLAYER_RADIUS * 2 * TIER_16_SIZE,
        PLAYER_RADIUS * 2 * TIER_16_SIZE,
      );
    } 
    
    }
    context.restore();
    context.globalAlpha = 1;

    // Draw name
    context.fillStyle = "white";
    context.font = "15px Arial";
    context.textAlign = "center";
    let UsernameFix = player.username.replace('NaN','');
    if(`${UsernameFix}` === '0'){
      context.fillText("Anonymous", canvasX, canvasY - 15 - PLAYER_RADIUS * Constants.RelativeSizes[player.tier]);
    }
    else if(UsernameFix.length <= 15){
      context.fillText(UsernameFix, canvasX, canvasY - 15 - PLAYER_RADIUS * Constants.RelativeSizes[player.tier]);
    } else{
      context.fillText(UsernameFix.slice(0, 15), canvasX, canvasY - 15 - PLAYER_RADIUS * Constants.RelativeSizes[player.tier]);
    }

    // Draw Chat Message
    context.fillStyle = "grey";
    let chatFix = player.message.replace('NaN','');
    if(!(`${chatFix}` === '0')){
      context.fillText(chatFix, canvasX, canvasY - 33 - PLAYER_RADIUS * Constants.RelativeSizes[player.tier]);
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

    if(player.poisoned > 0){
      context.fillStyle = "green";
      context.globalAlpha = 0.3;
      context.beginPath();
      context.ellipse(canvasX, canvasY, PLAYER_RADIUS * Constants.RelativeSizes[player.tier], PLAYER_RADIUS * Constants.RelativeSizes[player.tier], 0, Math.PI * 2, 0, 2 * Math.PI);
      context.fill();
      context.globalAlpha = 1;
    }
  }
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

function renderLocalMessage(me) {
  context.fillStyle = 'white';
  context.font = "30px Arial";
  context.textAlign = "center";
  let localMessageFix = me.localMessage.replace('NaN','');
  if(localMessageFix != 0){
    context.fillText(localMessageFix, canvas.width / 2, canvas.height / 4);
  }

  // Rendering Ability Cooldown
  if(me.abilityCooldown !== null && me.abilityCooldown !== undefined && me.otherAbilityCooldown !== null && me.otherAbilityCooldown !== undefined){
    context.font = "10px Arial";
    context.textAlign = "left";
    context.fillStyle = 'grey';
    var abilityCooldownFix = Math.ceil(me.abilityCooldown);
    var otherAbilityCooldownFix = Math.ceil(me.otherAbilityCooldown);
    if(abilityCooldownFix >= 0 && otherAbilityCooldownFix >= 0){
      context.fillText("Ability Cooldowns: " + abilityCooldownFix + ', ' + otherAbilityCooldownFix, 15, 240);
    } else if(abilityCooldownFix >= 0){
      context.fillText("Ability Cooldowns: " + abilityCooldownFix + ', 0', 15, 240);
    } else if(otherAbilityCooldownFix >= 0){
      context.fillText("Ability Cooldowns: 0, " + otherAbilityCooldownFix, 15, 240);
    } else{
      context.fillText("Ability Cooldowns: 0, 0", 15, 240);
    }
  }
}

/*function renderAbilityBar(me, player, abilityCooldown) {
  const { x, y } = player;
  console.log(abilityCooldown);
  // Draw the actual bar
  context.fillStyle = 'white';
  context.fillRect(
    canvas.width / 2 - me.x + x + 15 - canvas.width / 2,
    canvas.height / 2 - me.y + y + canvas.height / 2 - 60,
    canvas.width - 30,
    30,
  );
  
  context.fillStyle = "#2045c9";
  context.fillRect(
    canvas.width / 2 - me.x + x + 15 - canvas.width / 2,
    canvas.height / 2 - me.y + y + canvas.height / 2 - 60,
    abilityCooldown/10 * canvas.width - 15,
    30,
  );

  // Draw the text to render
  context.fillStyle = 'white';
  context.font = "15px Arial";
  context.textAlign = "center";
  context.fillText(Math.floor(player.score) + " xp (Ability Cooldown: " + Math.floor(player.abilityCooldown) + " seconds)", canvas.width / 2, canvas.height - 37.5);
}*/


function renderLake(me, lake) {
  const { x, y } = lake;
  if(Math.abs(lake.x - me.x) <= canvas.width + 10 && Math.abs(lake.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('lake.png'),
      canvas.width / 2 + x - me.x - LAKE_RADIUS,
      canvas.height / 2 + y - me.y - LAKE_RADIUS,
      LAKE_RADIUS * 2,
      LAKE_RADIUS * 2,
    );
  }
}

function renderMageball(me, mageBall) {
  const { x, y } = mageBall;
  if(Math.abs(mageBall.x - me.x) <= canvas.width + 10 && Math.abs(mageBall.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('mage ball.png'),
      canvas.width / 2 + x - me.x - MAGEBALL_RADIUS,
      canvas.height / 2 + y - me.y - MAGEBALL_RADIUS,
      MAGEBALL_RADIUS * 2,
      MAGEBALL_RADIUS * 2,
    );
  }
}

function renderVenom(me, venom) {
  const { x, y } = venom;
  if(Math.abs(venom.x - me.x) <= canvas.width + 10 && Math.abs(venom.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('snake venom.png'),
      canvas.width / 2 + x - me.x - Constants.VENOM_RADIUS,
      canvas.height / 2 + y - me.y - Constants.VENOM_RADIUS,
      Constants.VENOM_RADIUS * 2,
      Constants.VENOM_RADIUS * 2,
    );
  }
}

/*function renderObject(me, object, assetName, assetRadius) {
  const { x, y } = object;
  if(Math.abs(object.x - me.x) <= canvas.width + 10 && Math.abs(object.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset(assetName),
      canvas.width / 2 + x - me.x - assetRadius,
      canvas.height / 2 + y - me.y - assetRadius,
      assetRadius * 2,
      assetRadius * 2,
    );
  }
}*/

function renderSlimeball(me, slimeBall) {
  const { x, y } = slimeBall;
  if(Math.abs(slimeBall.x - me.x) <= canvas.width + 10 && Math.abs(slimeBall.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('slime ball.png'),
      canvas.width / 2 + x - me.x - SLIMEBALL_RADIUS,
      canvas.height / 2 + y - me.y - SLIMEBALL_RADIUS,
      SLIMEBALL_RADIUS * 2,
      SLIMEBALL_RADIUS * 2,
    );
  }
}

function renderSnakebite(me, snakeBite) {
  const { x, y } = snakeBite;
  if(Math.abs(snakeBite.x - me.x) <= canvas.width + 10 && Math.abs(snakeBite.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('snake bite fangs.png'),
      canvas.width / 2 + x - me.x - SNAKEBITE_RADIUS,
      canvas.height / 2 + y - me.y - SNAKEBITE_RADIUS,
      SNAKEBITE_RADIUS * 2,
      SNAKEBITE_RADIUS * 2,
    );
  }
}

function renderTrunkHit(me, trunkHit) {
  const { x, y, direction } = trunkHit;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  if(Math.abs(trunkHit.x - me.x) <= canvas.width + 10 && Math.abs(trunkHit.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('mammoth trunk swing.png'),
      -TRUNKHIT_RADIUS,
      -TRUNKHIT_RADIUS,
      TRUNKHIT_RADIUS * 2,
      TRUNKHIT_RADIUS * 2,
    );
  }

  context.restore();
}

function renderHorseKick(me, horseKick) {
  const { x, y, direction } = horseKick;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction - Math.PI);
  if(Math.abs(horseKick.x - me.x) <= canvas.width + 10 && Math.abs(horseKick.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('horse kick.png'),
      -HORSEKICK_RADIUS,
      -HORSEKICK_RADIUS,
      HORSEKICK_RADIUS * 2,
      HORSEKICK_RADIUS * 2,
    );
  }

  context.restore();
}

function renderPortal(me, portal) {
  const { x, y } = portal;
  context.globalAlpha = 0.5;
  if(Math.abs(portal.x - me.x) <= canvas.width + 10 && Math.abs(portal.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('portal.png'),
      canvas.width / 2 + x - me.x - PORTAL_RADIUS,
      canvas.height / 2 + y - me.y - PORTAL_RADIUS,
      PORTAL_RADIUS * 2,
      PORTAL_RADIUS * 2,
    );
  }
  context.globalAlpha = 1;
}

function renderBerry(me, berry) {
  const { x, y } = berry;
  if(Math.abs(berry.x - me.x) <= canvas.width + 10 && Math.abs(berry.y - me.y) <= canvas.height + 10){ // If it is in the player's radius, then render it
    // Drawing the outline
    var dArr = [-1,-1, 0,-1, 1,-1, -1,0, 1,0, -1,1, 0,1, 1,1], // offset array
    s = 2,  // thickness scale
    i = 0,  // iterator
    finalX = x,  // final position
    finalY = y;

    for(; i < dArr.length; i += 2){
      context.drawImage(
      getAsset('berry outline.png'),
        canvas.width / 2 + x - me.x - BERRY_RADIUS + dArr[i]*s,
        canvas.height / 2 + y - me.y - BERRY_RADIUS + dArr[i+1]*s,
        BERRY_RADIUS * 2,
        BERRY_RADIUS * 2,
      );
    }

    // fill with color
    /*context.globalCompositeOperation = "source-atop";
    context.fillStyle = "red";
    context.fillRect(0,0,canvas.width, canvas.height);*/

    //Drawing the original image
    context.globalCompositeOperation = "source-over";
      context.drawImage(
      getAsset('berry.png'),
      canvas.width / 2 + x - me.x - BERRY_RADIUS,
      canvas.height / 2 + y - me.y - BERRY_RADIUS,
      BERRY_RADIUS * 2,
      BERRY_RADIUS * 2,
    );
  }
}

function renderMelon(me, melon) {
  const { x, y } = melon;

  if(Math.abs(melon.x - me.x) <= canvas.width + 10 && Math.abs(melon.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('melon.png'),
      canvas.width / 2 + x - me.x - MELON_RADIUS,
      canvas.height / 2 + y - me.y - MELON_RADIUS,
      MELON_RADIUS * 2,
      MELON_RADIUS * 2,
    );
  }
}

function renderMushroom(me, mushroom) {
  const { x, y } = mushroom;
  if(Math.abs(mushroom.x - me.x) <= canvas.width + 10 && Math.abs(mushroom.y - me.y) <= canvas.height + 10){
    // Drawing the outline
    var dArr = [-1,0, 1,0, -1,1, 0,1, 1,1], // offset array
      s = 2,  // thickness scale
      i = 0,  // iterator
      finalX = x,  // final position
      finalY = y;

    for(; i < dArr.length; i += 2){
      context.drawImage(
        getAsset('mushroom outline.png'),
        canvas.width / 2 + x - me.x - MUSHROOM_RADIUS + dArr[i]*s,
        canvas.height / 2 + y - me.y - MUSHROOM_RADIUS + dArr[i+1]*s,
        MUSHROOM_RADIUS * 2,
        MUSHROOM_RADIUS * 2,
      );
    }

    context.drawImage(
      getAsset('mushroom.png'),
      canvas.width / 2 + x - me.x - MUSHROOM_RADIUS,
      canvas.height / 2 + y - me.y - MUSHROOM_RADIUS,
      MUSHROOM_RADIUS * 2,
      MUSHROOM_RADIUS * 2,
    );
  }
}

function renderRock(me, rock) {
  const { x, y } = rock;
  if(Math.abs(rock.x - me.x) <= canvas.width + 10 && Math.abs(rock.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('rock.png'),
      canvas.width / 2 + x - me.x - ROCK_RADIUS,
      canvas.height / 2 + y - me.y - ROCK_RADIUS,
      ROCK_RADIUS * 2,
      ROCK_RADIUS * 2,
    );
  }
}

function renderBlackberry(me, blackberry) {
  const { x, y } = blackberry;
  if(Math.abs(blackberry.x - me.x) <= canvas.width + 10 && Math.abs(blackberry.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('blackberry.png'),
      canvas.width / 2 + x - me.x - BLACKBERRY_RADIUS,
      canvas.height / 2 + y - me.y - BLACKBERRY_RADIUS,
      BLACKBERRY_RADIUS * 2,
      BLACKBERRY_RADIUS * 2,
    );
  }
}

function renderCarrot(me, carrot) {
  const { x, y } = carrot;
  if(Math.abs(carrot.x - me.x) <= canvas.width + 10 && Math.abs(carrot.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('carrot.png'),
      canvas.width / 2 + x - me.x - CARROT_RADIUS,
      canvas.height / 2 + y - me.y - CARROT_RADIUS,
      CARROT_RADIUS * 2,
      CARROT_RADIUS * 2,
    );
  }
}

function renderLilypad(me, lilypad) {
  const { x, y } = lilypad;
  if(Math.abs(lilypad.x - me.x) <= canvas.width + 10 && Math.abs(lilypad.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('lilypad.png'),
      canvas.width / 2 + x - me.x - LILYPAD_RADIUS,
      canvas.height / 2 + y - me.y - LILYPAD_RADIUS,
      LILYPAD_RADIUS * 2,
      LILYPAD_RADIUS * 2,
    );
  }
}

function renderRedMushroom(me, redMushroom) {
  const { x, y } = redMushroom;
  if(Math.abs(redMushroom.x - me.x) <= canvas.width + 10 && Math.abs(redMushroom.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('red mushroom.png'),
      canvas.width / 2 + x - me.x - RED_MUSHROOM_RADIUS,
      canvas.height / 2 + y - me.y - RED_MUSHROOM_RADIUS,
      RED_MUSHROOM_RADIUS * 2,
      RED_MUSHROOM_RADIUS * 2,
    );
  }
}

function renderWatermelonSlice(me, watermelonSlice) {
  const { x, y } = watermelonSlice;
  if(Math.abs(watermelonSlice.x - me.x) <= canvas.width + 10 && Math.abs(watermelonSlice.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('watermelon slice.png'),
      canvas.width / 2 + x - me.x - WATERMELON_SLICE_RADIUS,
      canvas.height / 2 + y - me.y - WATERMELON_SLICE_RADIUS,
      WATERMELON_SLICE_RADIUS * 2,
      WATERMELON_SLICE_RADIUS * 2,
    );
  }
}

function renderBanana(me, banana) {
  const { x, y } = banana;
  if(Math.abs(banana.x - me.x) <= canvas.width + 10 && Math.abs(banana.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('banana.png'),
      canvas.width / 2 + x - me.x - BANANA_RADIUS,
      canvas.height / 2 + y - me.y - BANANA_RADIUS,
      BANANA_RADIUS * 2,
      BANANA_RADIUS * 2,
    );
  }
}

function renderCoconut(me, coconut) {
  const { x, y } = coconut;
  if(Math.abs(coconut.x - me.x) <= canvas.width + 10 && Math.abs(coconut.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('coconut.png'),
      canvas.width / 2 + x - me.x - COCONUT_RADIUS,
      canvas.height / 2 + y - me.y - COCONUT_RADIUS,
      COCONUT_RADIUS * 2,
      COCONUT_RADIUS * 2,
    );
  }
}

function renderPear(me, pear) {
  const { x, y } = pear;
  if(Math.abs(pear.x - me.x) <= canvas.width + 10 && Math.abs(pear.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('pear.png'),
      canvas.width / 2 + x - me.x - PEAR_RADIUS,
      canvas.height / 2 + y - me.y - PEAR_RADIUS,
      PEAR_RADIUS * 2,
      PEAR_RADIUS * 2,
    );
  }
}


function renderMushroomBush(me, mushroomBush) {
  const { x, y } = mushroomBush;
  if(Math.abs(mushroomBush.x - me.x) <= canvas.width + 10 && Math.abs(mushroomBush.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('mushroom bush.png'),
      canvas.width / 2 + x - me.x - MUSHROOM_BUSH_RADIUS,
      canvas.height / 2 + y - me.y - MUSHROOM_BUSH_RADIUS,
      MUSHROOM_BUSH_RADIUS * 2,
      MUSHROOM_BUSH_RADIUS * 2,
    );
  }
}

function renderWatermelon(me, watermelon) {
  const { x, y } = watermelon;
  if(Math.abs(watermelon.x - me.x) <= canvas.width + 10 && Math.abs(watermelon.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('watermelon.png'),
      canvas.width / 2 + x - me.x - WATERMELON_RADIUS,
      canvas.height / 2 + y - me.y - WATERMELON_RADIUS,
      WATERMELON_RADIUS * 2,
      WATERMELON_RADIUS * 2,
    );
  }
}

function renderLava(me, lava) {
  const { x, y } = lava;
  if(Math.abs(lava.x - me.x) <= canvas.width + 10 && Math.abs(lava.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('lava.png'),
      canvas.width / 2 + x - me.x - LAVA_RADIUS,
      canvas.height / 2 + y - me.y - LAVA_RADIUS,
      LAVA_RADIUS * 2,
      LAVA_RADIUS * 2,
    );
  }
}

function renderBoostpad(me, boostpad) {
  const { x, y, direction } = boostpad;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);

  if(Math.abs(boostpad.x - me.x) <= canvas.width + 10 && Math.abs(boostpad.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('boost pad.png'),
      -Constants.BOOSTPAD_RADIUS,
      -Constants.BOOSTPAD_RADIUS,
      Constants.BOOSTPAD_RADIUS * 2,
      Constants.BOOSTPAD_RADIUS * 2,
    );
  }

  context.restore();

  /*
    const { x, y, direction } = horseKick;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction - Math.PI);
  if(Math.abs(horseKick.x - me.x) <= canvas.width + 10 && Math.abs(horseKick.y - me.y) <= canvas.height + 10){
    context.drawImage(
      getAsset('horse kick.png'),
      -HORSEKICK_RADIUS,
      -HORSEKICK_RADIUS,
      HORSEKICK_RADIUS * 2,
      HORSEKICK_RADIUS * 2,
    );
  }

  context.restore();
  */
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