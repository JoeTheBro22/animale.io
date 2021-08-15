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

export const play = username => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};

export const updateChat = throttle(20, message => {
  const chat = document.getElementById('chat-text').value;
  socket.emit(Constants.MSG_TYPES.CHAT, chat);
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
