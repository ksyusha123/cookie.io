const ASSET_NAMES = ['Zhenya.png', 'background.png', 'BlueCookie.png', 'HoneyCookie.png', 'Ksyusha.png', 'OrangeCookie.png',
    'PinkCookie.png', 'Vanua.png', 'LimonCookie.png', 'LimeCookie.png', 'Polina.png', 'BrownPiece.png', 'DarkBluePiece.png', 'GreenPiece.png',
    'LightBluePiece.png', 'OrangePiece.png', 'PurplePiece.png'];

const personAssets = ['Zhenya.png', 'BlueCookie.png', 'HoneyCookie.png', 'Ksyusha.png', 'OrangeCookie.png',
    'PinkCookie.png', 'Vanua.png', 'LimonCookie.png', 'LimeCookie.png', 'Polina.png'];

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
export const getPersonAsset = index => personAssets[index];

export function downloadSkinMenuAssets() {
    for (let i = 0; i < personAssets.length; i++) {
        const asset = assets[personAssets[i]];
        const button = document.getElementById(`skin${i + 1}`);
        asset.style.width = button.style.width;
        asset.style.height = button.style.height;
        button.style.backgroundImage = `url(/assets/${personAssets[i]})`;
    }
}

export function updateSkinButton(skin) {
    const asset = assets[skin];
    const button = document.getElementById('select-skin-button');
    asset.style.width = button.style.width;
    asset.style.height = button.style.height;
    button.style.backgroundImage = `url(/assets/${skin})`;
}
