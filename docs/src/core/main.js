let pauseSound = new Audio("assets/music/Pause.mp3");
let hitSound = new Audio("assets/music/Enemy_Hurt.mp3");
let deathSound = new Audio("assets/music/Enemy_Death.mp3");
let shootSound = new Audio("assets/music/Player_Shoot.mp3");
let hurtSound = new Audio("assets/music/Player_Hurt.mp3");
let deathSound2 = new Audio("assets/music/Player_Death.mp3");
let openDoorSound = new Audio("assets/music/Door_Open.mp3");

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
  
  currentRoomIndex = 0;
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
