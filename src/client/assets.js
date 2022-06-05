const ASSET_NAMES = ['Zhenya.png', 'background.png', 'BlueCookie.png', 'HoneyCookie.png', 'Ksyusha.png', 'OrangeCookie.png',
    'PinkCookie.png'];

const personAssets = ['Zhenya.png', 'BlueCookie.png', 'HoneyCookie.png', 'Ksyusha.png', 'OrangeCookie.png',
    'PinkCookie.png'];

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

export function downloadSkinMenuAssets(){
    for (let i = 0; i < personAssets.length; i++){
        const asset = assets[personAssets[i]];
        const button = document.getElementById(`skin${i + 1}`);
        asset.style.width = button.style.width;
        asset.style.height = button.style.height;
        button.style.backgroundImage = `url(/assets/${personAssets[i]})`;
        console.log(button.style.backgroundImage);
    }
}