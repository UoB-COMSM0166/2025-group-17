let mainmenuSound = new Audio("assets/music/Scene_music/MainMenu.mp3");
let pauseSound = new Audio("assets/music/Pause.mp3");
let hitSound = new Audio("assets/music/Enemy_Hurt.mp3");
let deathSound = new Audio("assets/music/Enemy_Death.mp3");
let shootSound = new Audio("assets/music/Player_Shoot.mp3");
let hurtSound = new Audio("assets/music/Player_Hurt.mp3");
let deathSound2 = new Audio("assets/music/Player_Death.mp3");

let openDoorSound = new Audio("assets/music/Door_Open.mp3");

function preload() {
  uiFont = loadFont('assets/fonts/PressStart2P.ttf');
  heart = loadImage('assets/icons/full_heart.png');
  damagedHeart = loadImage('assets/icons/empty_heart.png');
  startMenuImg = loadImage('assets/background/menu_start.png');
  closedDoorImg = loadImage('assets/door/close-right.png');
  openDoorImg = loadImage('assets/door/open-right.png');

  //load obstacles images
  //obstacleImages.push(loadImage('assets/obstacles/level1/pillow1.png'));
  //obstacleImages.push(loadImage('assets/obstacles/level1/pillow2.png'));
  obstacleImages.push(loadImage('assets/obstacles/level1/PC-1.png'));
  obstacleImages.push(loadImage('assets/obstacles/level1/PC-2.png'));
  obstacleImages.push(loadImage('assets/obstacles/level1/PC-3.png'));
  obstacleImages.push(loadImage('assets/obstacles/level1/PC-4.png'));
  obstacleImages.push(loadImage('assets/obstacles/level1/PC-5.png'));
  ///obstacleImages.push(loadImage('assets/obstacles/level1/desk.png'));
  //obstacleImages.push(loadImage('assets/obstacles/level1/chair.png'));

  //load player image
  playerImage = loadImage('assets/character/Character.png');
  //load bullet image
  bulletImage = loadImage('assets/character/bullets/NormalBullet.png');
  //load enemy image
  enemyImage = loadImage('assets/enemies/level1/CCTV.png');
  savePointImg = loadImage('assets/savepoint/savepoint.jpg');

  rawData = loadJSON("assets/rooms.json");

}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  setRoomBgImg();  
  menuDrawer = new MenuDrawer();
  adjustCanvasWithAspectRatio();
  player = new Player(playerX, playerY);
  room = new Room();
  room.setup(rooms[currentRoomIndex]);
  inputHandler = new InputHandler(room);

  menuDrawer.setupMenu();
  menuDrawer.setupPauseMenu();
  menuDrawer.setupGameOverPage();
}

function draw() {
  adjustCanvasWithAspectRatio();
  background(220);
  if (!menuDrawer.renderMenu(player, timeSpent)) updateGameState();
}

function updateGameState() {
  menuDrawer.updatePauseBtnPosition();
  room.update();
  inputHandler.update(player);
  player.display();
  player.healByTime(timeSpent);
  drawUiHub();
  checkSavePoint();
}

function keyPressed() {
  menuDrawer.handleBtnPressed(player);
  inputHandler.handlePlayerShooting(player);
}

function setRoomBgImg() {
  rooms = rawData.rooms;
  rooms.forEach(room => {
    room.backgroundImg = loadImage(room.background);
  });
}
