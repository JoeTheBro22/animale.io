// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection } from './networking';
import { updateSpeed } from './networking';
import { updateChat } from './networking';
import { clickMessage } from './networking';
import { updateKeyPressed } from './networking';

var mouseX;
var mouseY;
function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
  mouseX = e.clientX;
  mouseY = e.clientY;
}

setInterval(function(){ 
  updateSpeed(mouseX, mouseY, Math.max(1, 800 / window.innerWidth) * window.innerWidth, Math.max(1, 800 / window.innerWidth) * window.innerHeight);
}, 100);

function onMouseClick() {
  clickMessage();
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function onKeyPressed(e){
  updateKeyPressed(e.key);
  if(e.key === 'Enter'){
    updateChat();
  }
}

function handleInput(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir);
  updateSpeed(x, y, Math.max(1, 800 / window.innerWidth) * window.innerWidth, Math.max(1, 800 / window.innerWidth) * window.innerHeight); //Math.max(1, 800 / window.innerWidth) * window.innerWidth
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('mousedown', onMouseClick);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
  window.addEventListener('keydown', onKeyPressed);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('mousedown', onMouseClick);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
  window.addEventListener('keydown', onKeyPressed);
}
