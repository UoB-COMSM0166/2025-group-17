// TODO: Merge into classes
let cnv;
let rooms;

let openDoorImg, closedDoorImg;

let startTime;
let timeSpent = 0;

const uiTextSize = 20;
const hPadding = 50;
const vPadding = 20;

let lastSavedPosition = { xPos: null, yPos: null };
let minDistanceToSave = 50;

//Player properties
const enemySize = 20;
const shootSize = 25;
const smallEnemyHp = 50;
const largeEnemyHp = 100;
const defaultAcceleration = 5.0;
let shootCooldown = 0;

let player;
let enemies = [], obstacles = [];

//load images of obstacles, player, bullet, and enemy
let obstacleImages = [];
let playerImage;
let bulletImage;
let enemyImage;
let savePointImg;
const doorSize = { w: 73, h: 95 };

const widthInPixel = 1024;
const heightInPixel = 576;
const boundaryInPixel = { w: 80, h: 72 }
const leftBoundary = boundaryInPixel.w;
const rightBoundary = widthInPixel - boundaryInPixel.w;
const topBoundary = boundaryInPixel.h;
const bottomBoundary = heightInPixel - boundaryInPixel.h;

const playerX = leftBoundary;
const playerY = heightInPixel / 2;

const savePointParam = { x: leftBoundary + 60, y: bottomBoundary - 80};

const maxObstacleSize = heightInPixel / 12;
const maxEntitySize = heightInPixel / 8;

let sceneData;
let sceneImgs = {};
let sceneSounds = {};