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
  chaserImage = loadImage('assets/enemies/level1/Crab.png'); // 路径按你实际来
  shooterImage = loadImage('assets/enemies/level1/The Boss.png'); // 路径按你实际来
  shooterBulletImage = loadImage('assets/character/bullets/UpperBullet.png'); // 路径按你实际来
  savePointImg = loadImage('assets/savepoint/savepoint.jpg');
  //load room data
  rawData = loadJSON("assets/rooms.json");
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  setRoomBgImg();  
  const eventBus = new EventBus();
  const menuDrawer = new MenuDrawer(eventBus);
  menuDrawer.setupMenu();
  menuDrawer.setupPauseMenu();
  menuDrawer.setupGameOverPage();
  gameStateManager = new GameStateManager(eventBus, menuDrawer);
  adjustCanvasWithAspectRatio();
  player = new Player(playerX, playerY);
  room = new Room();
  room.setup(rooms[currentRoomIndex]);
  inputHandler = new InputHandler(room);
}

function draw() {
  adjustCanvasWithAspectRatio();
  background(220);
  player.updateBlinking();
  if (gameStateManager.menuDrawer.shouldRenderMenu(player)) return gameStateManager.menuDrawer.renderMenu(player, timeSpent);
  updateGameState();
}

function updateGameState() {
  gameStateManager.menuDrawer.updatePauseBtnPosition();
  room.update();
  inputHandler.update(player);
  player.display();
  player.healByTime(timeSpent);
  drawUiHub();
  checkSavePoint();
}

function keyPressed() {
  gameStateManager.menuDrawer.handleBtnPressed(player);
  if (!gameStateManager.menuDrawer.shouldRenderMenu(player)) inputHandler.handlePlayerShooting(player);
}

function setRoomBgImg() {
  rooms = rawData.rooms;
  rooms.forEach(room => {
    room.backgroundImg = loadImage(room.background);
  });
}
