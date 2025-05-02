let cnv;

let gameStateManager;
let player;

// load images of player, bullet, and enemy
let playerImage;
let bulletImage;
let enemyImage;
let savePointImg;
let openDoorImg, closedDoorImg;
let BossBulletImgL2, BossBulletImgL3;
let healthItemImg, powerUpItemImg, photoItemImg;

// Load JSON files
let sceneData, helpBarData, rawRoomData, roomData;
let sceneImgs = {};
let sceneSounds = {};

// TODO: Merge into classes
let startTime;
const widthInPixel = 1024;
const heightInPixel = 576;
const boundaryInPixel = { w: 80, h: 72 }
const leftBoundary = boundaryInPixel.w;
const rightBoundary = widthInPixel - boundaryInPixel.w;
const topBoundary = boundaryInPixel.h;
const bottomBoundary = heightInPixel - boundaryInPixel.h;

let bossSpriteSheet;
let shooterSpriteSheet;
let enemySpriteSheet;

// Load Sound
let mainmenuSound, L1_OfficeSound, L2_CasinoSound, L3_PsychoSound;
let btnSound, hitSound, playerDeathSound, enemyDeathSound, bossDeathSound, shootSound, hurtSound, openDoorSound, itemPickSound;