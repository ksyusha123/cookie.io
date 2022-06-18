const personAssets = await fetch('/listassets/person').then(r => r.json());
export const foodAssets = await fetch('/listassets/food').then(r => r.json());
const otherAssets = await fetch('/listassets/other').then(r => r.json());

const selectSkinButton = document.getElementById('select-skin-button');

const assets = {};
const downloadPromise = Promise.all(
    personAssets.map(p => downloadAsset(p, 'person'))
        .concat(foodAssets.map(f => downloadAsset(f, 'food')))
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
        const button = document.getElementById(`skin${i + 1}`);
        updateButtonWithSkin(button, personAssets[i]);
    }
}

export function updateSkinButton(skin) {
    updateButtonWithSkin(selectSkinButton, skin);
}

function updateButtonWithSkin(button, skin) {
    const asset = assets[skin];
    button.style.width = asset.style.width;
    button.style.height = asset.style.height;
    button.style.backgroundImage = `url(/assets/person/${skin})`;
}