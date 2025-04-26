let cnv;

let gameStateManager;
let player;

// load images of obstacles, player, bullet, and enemy
let obstacleImages = [];
let playerImage;
let bulletImage;
let enemyImage;
let savePointImg;
let openDoorImg, closedDoorImg;

// Load JSON files
let sceneData, helpBarData, rawRoomData, roomData;
let sceneImgs = {};
let sceneSounds = {};

// TODO: Merge into classes
let startTime;
let timeSpent = 0;
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
let mainmenuSound;
let L1_OfficeSound;
let L3_PsychoSound;