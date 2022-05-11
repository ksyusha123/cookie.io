const ASSET_NAMES = [/*place here asset names by comma*/];

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

const downloadAssets = () => downloadPromise;
module.exports.downloadAssets = downloadAssets;
const getAsset = assetName => assets[assetName];
module.exports.getAsset = getAsset;