let pauseSound = new Audio("assets/music/Pause.mp3");
let hitSound = new Audio("assets/music/Enemy_Hurt.mp3");
let deathSound = new Audio("assets/music/Enemy_Death.mp3");
let shootSound = new Audio("assets/music/Player_Shoot.mp3");
let hurtSound = new Audio("assets/music/Player_Hurt.mp3");
let deathSound2 = new Audio("assets/music/Player_Death.mp3");
let walkSound = new Audio("assets/music/Player_Walk.mp3");
walkSound.loop = true;

function preload() {
  uiFont = loadFont('assets/fonts/PressStart2P.ttf');
  heart = loadImage('assets/icons/heart.svg');
  damagedHeart = loadImage('assets/icons/damagedHeart.svg');
  startMenuImg = loadImage('assets/background/menu_start.png');
  closedDoorImg = loadImage('assets/door/door_close.png');
  openDoorImg = loadImage('assets/door/door_open.png');
  officeRoomImg = loadImage('assets/background/room_office.jpg');
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  adjustCanvasWithAspectRatio();
  player = new Player(playerX, playerY);
  room = new Room();
  room.setup();
  inputHandler = new InputHandler(room);

  setupMenu();
  setupPauseMenu();
}

function draw() {
  adjustCanvasWithAspectRatio();
  background(220);
  if (menuDisplayed) {
    drawMenu();
  } else if (isGamePaused) {
    drawPauseMenu();
  } else if (isGameOver()) {
    drawGameOver();
  }
  else {
    displayTutorial();
    room.update();
    inputHandler.update();
    player.display();
    drawUiHub();

    checkSavePoint();
  }
}

function keyPressed() {
  inputHandler.handlePlayerShooting();
}

let boss = {
  hp: 30,
  maxHp: 100
};
