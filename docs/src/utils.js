// // TODO: Merge into classes

let lastCollisionTime = 0;

let firstBtnToggled = false;
let isBossStage = false;
let isGameCompleted = false;
let btnPause, btnResume, btnExit, btnContinue, btnNewGame, btnRestart, btnLoadLastSave;
let inputHandler = null;
let cnv, hudDrawer, menuDrawer;
let room = null;

let openDoorImg, closedDoorImg;

let startTime;
let timeSpent = 0;

let currentRoomIndex = 0;

const uiTextSize = 20;
const hPadding = 50;
const vPadding = 20;

let nearSavedPosition = false;
let lastSavedPosition = { xPos: null, yPos: null };
let minDistanceToSave = 50;

//Player properties
const enemySize = 20;
const chaserSize = 30;
const shootSize = 25;
const smallEnemyHp = 100;
const largeEnemyHp = 100;
const largeEnemySize = { w: 50, h: 60 };
const defaultAcceleration = 5.0;
const defaultFriction = 0.85;
let shootCooldown = 0;

let player;
let enemyCount = 4;
let obstacleCount = 5;
let enemies = [], obstacles = [];

//load images of obstacles, player, bullet, and enemy
let obstacleImages = [];
let playerImage;
let bulletImage;
let enemyImage;
let savePointImg;

const doorSize = { w: 73, h: 95 };

const defaultSpeed = 5;
const defaultHp = 3;
const defaultAtk = 50;
const playerMaxHp = 5;
const playerMaxSpeed = 15;
const playerMaxAtk = 20;

const widthInPixel = 1024;
const heightInPixel = 576;
const boundaryInPixel = { w: 80, h: 72 }
const leftBoundary = boundaryInPixel.w;
const rightBoundary = widthInPixel - boundaryInPixel.w;
const topBoundary = boundaryInPixel.h;
const bottomBoundary = heightInPixel - boundaryInPixel.h;

const playerX = leftBoundary;
const playerY = heightInPixel / 2;

const savePointParam = { x: leftBoundary + 60, y: bottomBoundary - 80, w: 30, h: 30 };

const maxObstacleSize = heightInPixel / 12;
const maxEntitySize = heightInPixel / 8;