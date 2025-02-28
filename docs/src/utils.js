// TODO: Merge into classes
let lastCollisionTime = 0;

let menuDisplayed = true;
let isGamePaused = false;
let isBossStage = false;
let btnPause, btnResume, btnExit, btnContinue, btnNewGame;
let inputHandler = null;
let room = null;

let openDoorImg, closedDoorImg;

let startTime;
let timeSpent = 0;

let currentLevel = 1;
let currentStage = 1;

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
let enemyCount = 5;
let obstacleCount = 5;

// Add variables and functions from feature_enemies_lyz_before0225
let enemies = [], obstacles = [];
const tutorialStep = 0
const tutorialMessages = [
    "Clear all monsters and reach the exit to win!",
    "Use arrow keys to move and avoid obstacles & monsters.",
    "Use WSAD keys to shoot and attack monsters.",
    "You can start the game now!"
];

const doorSize = { w: 73, h: 95 };

const defaultSpeed = 5;
const defaultHp = 3;
const defaultAtk = 50;
const playerMaxHp = 5;
const playerMaxSpeed = 15;
const playerMaxAtk = 20;

const savePointParam = { x: 300, y: 200, w: 30, h: 30 };

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
const smallEntitySize = heightInPixel / 12;

const playerX = 100;
const playerY = 100;

const uiTextSize = 20;
const hPadding = 50;
const vPadding = 20;
