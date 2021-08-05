const ASSET_NAMES = [
  'ship.svg',
  'bullet.svg',
  'devil croc.png',
  'rooster.png',
  'berry.png',
  'melon.png',
  'blackberry.png',
  'carrot.png',
  'lilypad.png',
  'red mushroom.png',
  'watermelon slice.png',
  'banana.png',
  'coconut.png',
  'pear.png',
  'mushroom bush.png',
  'watermelon.png',
  'mushroom.png',
  'old slime.png',
  'robo mouse.png',
  'rock.png',
  'panda uwu.png',
  'blank.png',
  'old bear.png',
  'old black dragon.png',
  'old cheetah.png',
  'old crocodile.png',
  'old deer.png',
  'old dragon.png',
  'old fox.png',
  'old lion.png',
  'old mole.png',
  'old mouse.png',
  'old pig.png',
  'old rabbit.png',
  'old zebra.png',
  'Pakistan Shahbaz.png',
  'lava.png',
  'ostrich.png',
  'ant.png',
  'termite.png',
  'squirrel.png',
  'garden snake.png',
  'hummingbird.png',
  'barn owl.png',
  'ocelot.png',
  'zebra.png',
  'kangaroo.png',
  'mammoth.png',
  'horse.png',
  'party squirrel.png',
  'slime.png',
  'berry outline.png',
  'mushroom outline.png',
  'mushroom outline 2.png',
  'wizard.png',
  'sea snake.png',
  'slime 2.png',
  'realistic cheetah.png',
  'realistic dragon.png',
  'mage ball.png',
  //REMEBER TO ADD ALL ASSETS TO THIS :D
];

const assets = {};

const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

function downloadAsset(assetName) {
  return new Promise(resolve => {
    const asset = new Image();
    asset.onload = () => {
      console.log(`Downloaded ${assetName}`);
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
}

export const downloadAssets = () => downloadPromise;

export const getAsset = assetName => assets[assetName];
