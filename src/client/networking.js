// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#4-client-networking
import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';
import { processGameUpdate } from './state';

const Constants = require('../shared/constants');
const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = onGameOver => (
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    socket.on('disconnect', () => {
      console.log('Disconnected from server.');
      document.getElementById('disconnect-modal').classList.remove('hidden');
      document.getElementById('reconnect-button').onclick = () => {
        window.location.reload();
      };
    });
  })
);

export const clickUpgradeButton = throttle(20, click => {
  if(document.getElementById("tier-button") !== undefined){
    document.getElementById("tier-button").onclick = function () {
      socket.emit(Constants.MSG_TYPES.UPGRADE, 0);
    };
  }

  if(document.getElementById("second-tier-button") !== undefined){
    document.getElementById("second-tier-button").onclick = function () {
      socket.emit(Constants.MSG_TYPES.UPGRADE, 1);
    };
  }
});

export const clickMobileButton = click => {
  if(document.getElementById("mobile-ability-button") !== undefined){
    document.getElementById("mobile-ability-button").onclick = function () {
      socket.emit(Constants.MSG_TYPES.MOBILE_ABILITY);
    };
  }

  if(document.getElementById("second-mobile-ability-button") !== undefined){
    document.getElementById("second-mobile-ability-button").onclick = function () {
      socket.emit(Constants.MSG_TYPES.SECOND_MOBILE_ABILITY);
    };
  }

  if(document.getElementById("boost-button") !== undefined){
    document.getElementById("boost-button").onclick = function () {
      socket.emit(Constants.MSG_TYPES.MOBILE_BOOST);
    };
  }
};

var showMobileButtonPressedCounter = 1;

export const showMobileButton = show => {
  if(document.getElementById("mobile-mode-button") !== undefined){
    document.getElementById("mobile-mode-button").onclick = function () {
      showMobileButtonPressedCounter++;
    };
  }

  if(showMobileButtonPressedCounter%2 == 0){
    document.getElementById('mobile-ability-button').classList.remove('hidden');
    document.getElementById('second-mobile-ability-button').classList.remove('hidden');
    document.getElementById('boost-button').classList.remove('hidden');
  } else {
    document.getElementById('mobile-ability-button').classList.add('hidden');
    document.getElementById('second-mobile-ability-button').classList.add('hidden');
    document.getElementById('boost-button').classList.add('hidden');
  }
}

var shouldShowUpgradeButton;
var shouldShowSecondUpgradeButton;

export const showUpgradeButton = show => {
  socket.on(Constants.MSG_TYPES.DISPLAY_TIER_CHANGE_BUTTON, function (numberToDisplay) {
    shouldShowUpgradeButton = true;
    if(numberToDisplay >= 2){
      shouldShowSecondUpgradeButton = true;
    }
  });
  socket.on(Constants.MSG_TYPES.DO_NOT_DISPLAY_TIER_CHANGE_BUTTON, function () { shouldShowUpgradeButton = false; shouldShowSecondUpgradeButton = false;});
  if(shouldShowUpgradeButton){
    document.getElementById('tier-button').classList.remove('hidden');
  } else {
    document.getElementById('tier-button').classList.add('hidden');
  }

  if(shouldShowSecondUpgradeButton){
    document.getElementById('second-tier-button').classList.remove('hidden');
  } else {
    document.getElementById('second-tier-button').classList.add('hidden');
  }
};

export const play = username => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};

export const updateChat = throttle(20, message => {
  const chat = document.getElementById('chat-text').value;
  socket.emit(Constants.MSG_TYPES.CHAT, chat);
  document.getElementById('chat-text').value = '';
});

export const updateDirection = throttle(20, dir => {
  socket.emit(Constants.MSG_TYPES.INPUT, dir);
});

export const updateSpeed = throttle(20, (x, y, canvasWidth, canvasHeight) => {
  socket.emit(Constants.MSG_TYPES.SPEED_INPUT, x, y, canvasWidth, canvasHeight);
});

export const updateKeyPressed = throttle(20, (KeyPressed) => {
  var chat = document.getElementById('chat-text');
  if(chat === document.activeElement){
      // chat Is being selected
  } else{
    socket.emit(Constants.MSG_TYPES.KEY_PRESSED, KeyPressed);
  }
});

export const clickMessage = click => {
  socket.emit(Constants.MSG_TYPES.MOUSE_INPUT);
}
