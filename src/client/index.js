// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#3-client-entrypoints
import { connect, play, updateChat, clickUpgradeButton, showUpgradeButton, showMobileButton } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets } from './assets';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';

// I'm using a tiny subset of Bootstrap here for convenience - there's some wasted CSS,
// but not much. In general, you should be careful using Bootstrap because it makes it
// easy to unnecessarily bloat your site.
import './css/bootstrap-reboot.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const changelog = document.getElementById('changelog');
const playButton = document.getElementById('play-button');
// Use the same systems for chat as username input
const tierButton = document.getElementById('tier-button');
const secondTierButton = document.getElementById('tier-button');
const mobileAbilityButton = document.getElementById('mobile-ability-button');
const secondMobileAbilityButton = document.getElementById('second-mobile-ability-button');
const boostButton = document.getElementById('boost-button');
const usernameInput = document.getElementById('username-input');


Promise.all([
  connect(onGameOver),
  downloadAssets(),
]).then(() => {
  playMenu.classList.remove('hidden');
  changelog.classList.remove('hidden');
  tierButton.classList.add('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    play(usernameInput.value);
    playMenu.classList.add('hidden');
    changelog.classList.add('hidden');
    initState();
    startCapturingInput();
    startRendering();
    setLeaderboardHidden(false);
  };
}).catch(console.error);

function onGameOver() {
  stopCapturingInput();
  stopRendering();
  playMenu.classList.remove('hidden');
  changelog.classList.remove('hidden');
  tierButton.classList.add('hidden');
  setLeaderboardHidden(true);
}
