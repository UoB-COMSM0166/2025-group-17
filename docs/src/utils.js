// // TODO: Merge into classes
let lastCollisionTime = 0;

let menuDisplayed = true;
let isGamePaused = false;
let isBossStage = false;
let isGameCompleted = false;
let btnPause, btnResume, btnExit, btnContinue, btnNewGame;
let inputHandler = null;
let room = null;

let openDoorImg, closedDoorImg;

let startTime;
let timeSpent = 0;

let currentLevel = 1;
let currentStage = 1;

const uiTextSize = 20;
const hPadding = 50;
const vPadding = 20;

let nearSavedPosition = false;
let lastSavedPosition = { xPos: null, yPos: null };
let minDistanceToSave = 50;

const enemySize = 20;
const chaserSize = 30;
const shootSize = 25;
const smallEnemyHp = 50;
const largeEnemyHp = 100;
const largeEnemySize = { w: 50, h: 60 };

let player;
let enemyCount = 1;
let obstacleCount = 5;
let enemies = [], obstacles = [];


const doorSize = { w: 73, h: 95 };

const defaultSpeed = 5;
const defaultHp = 3;
const defaultAtk = 50;
const playerMaxHp = 5;
const playerMaxSpeed = 15;
const playerMaxAtk = 20;

const iconSize = 24;
const iconPadding = 15;

const bossHpWidth = 400;
const bossHpHeight = 30;
const bossHpCorner = 10;

const widthInPixel = 1024;
const heightInPixel = 576;
const boundaryInPixel = { w: 80 , h: 72 }
const leftBoundary = boundaryInPixel.w;
const rightBoundary = widthInPixel - boundaryInPixel.w;
const topBoundary = boundaryInPixel.h;
const bottomBoundary = heightInPixel - boundaryInPixel.h;

const playerX = leftBoundary;
const playerY = heightInPixel / 2;

const savePointParam = { x: leftBoundary + 60, y: bottomBoundary - 80, w: 30, h: 30 };
