let pauseSound = new Audio("assets/music/se/Pause.mp3");
let hitSound = new Audio("assets/music/se/Enemy_Hurt.mp3");
let deathSound = new Audio("assets/music/se/Enemy_Death.mp3");
let shootSound = new Audio("assets/music/se/Player_Shoot.mp3");
let hurtSound = new Audio("assets/music/se/Player_Hurt.mp3");
let deathSound2 = new Audio("assets/music/se/Player_Death.mp3");
let openDoorSound = new Audio("assets/music/se/Door_Open.mp3");

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  setRoomBgImg();  
  const eventBus = new EventBus();
  const pageDrawer = new PageDrawer(eventBus, sceneData, sceneImgs, sceneSounds);
  pageDrawer.setupMainMenu();
  pageDrawer.setupPauseMenu();
  pageDrawer.setupGameOverPage();
  gameStateManager = new GameStateManager(eventBus, pageDrawer);

  hudDrawer = new HudDrawer(cnv, uiFont, heartImg, damagedHeartImg);
  player = new Player(playerX, playerY);
  room = new Room();
  
  currentRoomIndex = 0;
  room.setup(rooms[currentRoomIndex]);
  inputHandler = new InputHandler(room);
}

function draw() {
  // hudDrawer.adjustCanvasWithAspectRatio();
  adjustCanvasWithAspectRatio();
  background(220);
  player.updateBlinking();
  if (gameStateManager.pageDrawer.shouldRenderMenu(player)) {
    return gameStateManager.pageDrawer.renderMenu(player, timeSpent);
  }
  updateGameState();
}

function updateGameState() {
  gameStateManager.pageDrawer.updatePauseBtnPosition();
  room.update();
  inputHandler.update(player);
  player.display();
  player.healByTime(timeSpent);
  // hudDrawer.drawUiHub(player, startTime, currentRoomIndex);
  drawUiHub(player, startTime, currentRoomIndex);

  checkSavePoint();
}

function keyPressed() {
  gameStateManager.pageDrawer.handleBtnPressed(player);
  if (!gameStateManager.pageDrawer.shouldRenderMenu(player)) inputHandler.handlePlayerShooting(player);
}

function setRoomBgImg() {
  rooms = rawData.rooms;
  rooms.forEach(room => {
    room.backgroundImg = loadImage(room.background);
  });
}
