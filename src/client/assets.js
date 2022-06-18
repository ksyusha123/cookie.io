const personAssets = await fetch('/listassets/person').then(r => r.json());
const otherAssets = await fetch('/listassets/other').then(r => r.json());

const assets = {};
const downloadPromise = Promise.all(
    personAssets.map(p => downloadAsset(p, 'person'))
        .concat(otherAssets.map(o => downloadAsset(o, 'other'))))
    .then(() => console.log('all assets downloaded'));

function downloadAsset(assetName, folderName) {
    return new Promise(resolve => {
        const asset = new Image();
        asset.onload = () => {
            console.log(`Downloaded ${assetName}`);
            assets[assetName] = asset;
            resolve();
        };
        asset.src = `/assets/${folderName}/${assetName}`;
    });
}

export const downloadAssets = () => downloadPromise;
export const getAsset = assetName => assets[assetName];
export const getPersonAsset = index => personAssets[index];

export function downloadSkinMenuAssets() {
    for (let i = 0; i < personAssets.length; i++) {
        const asset = assets[personAssets[i]];
        const button = document.getElementById(`skin${i + 1}`);
        button.style.width = asset.style.width;
        button.style.height = asset.style.height;
        button.style.backgroundImage = `url(/assets/person/${personAssets[i]})`;
    }
}

export function updateSkinButton(skin) {
    const asset = assets[skin];
    const button = document.getElementById('select-skin-button');
    button.style.width = asset.style.width;
    button.style.height = asset.style.height;
    button.style.backgroundImage = `url(/assets/person/${skin})`;
}

