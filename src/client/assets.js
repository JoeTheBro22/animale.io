const ASSET_NAMES = [
  'ship.svg',
  'bullet.svg',
  'devil croc.png',
  'rooster.png',
  'berry.png',
  'mystic bd.png',
  'slime.png',
  'robo mouse.png',
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
