const ASSET_NAMES = ['Zhenya.png', 'background.png', 'BlueCookie.png', 'HoneyCookie.png', 'Ksyusha.png',
    'OrangeCookie.png', 'PinkCookie.png'];

const assets = {};
const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset)).then(() => console.log('all assets downloaded'));

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