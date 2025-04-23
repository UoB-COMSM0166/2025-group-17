let gameStateManager;

let pauseSound = new Audio("assets/music/se/Pause.mp3");
let hitSound = new Audio("assets/music/se/Enemy_Hurt.mp3");
let deathSound = new Audio("assets/music/se/Enemy_Death.mp3");
let shootSound = new Audio("assets/music/se/Player_Shoot.mp3");
let hurtSound = new Audio("assets/music/se/Player_Hurt.mp3");
let deathSound2 = new Audio("assets/music/se/Player_Death.mp3");
let openDoorSound = new Audio("assets/music/se/Door_Open.mp3");

function setup() {
  // 防止 bossSpriteSheet 未加载时报错
  if (!bossSpriteSheet) {
    console.warn(" bossSpriteSheet not loaded yet!");
    return;
  }

  cnv = createCanvas(windowWidth, windowHeight);
  setRoomImg();

  const eventBus = new EventBus();

  // 初始化 pageDrawer
  const pageDrawer = new PageDrawer(eventBus, sceneData, sceneImgs, sceneSounds);

  //  初始化 gameStateManager，并 setPageDrawer
  gameStateManager = new GameStateManager(eventBus, pageDrawer);
  pageDrawer.setGameStateManager(gameStateManager);
  pageDrawer.setupMainMenu();
  pageDrawer.setupPauseMenu();
  pageDrawer.setupGameOverPage();

  hudDrawer = new HudDrawer(cnv, uiFont, heartImg, damagedHeartImg);
  player = new Player(playerX, playerY);
  room = new Room();

  room.setup(rooms[currentRoomIndex]);
  inputHandler = new InputHandler(room);

  // Boss动画帧切割（3帧横向）
  window.bossFrames = [];
  const frameW = bossSpriteSheet.width / 3;
  const frameH = bossSpriteSheet.height;
  for (let i = 0; i < 3; i++) {
    const frame = bossSpriteSheet.get(i * frameW, 0, frameW, frameH);
    window.bossFrames.push(frame);
  }

  // Shooter Boss 动画帧（3帧横向）
  window.shooterFrames = [];
  const frameW2 = shooterSpriteSheet.width / 3;
  const frameH2 = shooterSpriteSheet.height;
  for (let i = 0; i < 3; i++) {
    const frame = shooterSpriteSheet.get(i * frameW2, 0, frameW2, frameH2);
    window.shooterFrames.push(frame);
  }

  // enemy 动画帧切割（4帧横向）
  window.enemyFrames = [];
  const enemyFrameW = enemySpriteSheet.width / 4;
  const enemyFrameH = enemySpriteSheet.height;
  for (let i = 0; i < 4; i++) {
    const frame = enemySpriteSheet.get(i * enemyFrameW, 0, enemyFrameW, enemyFrameH);
    window.enemyFrames.push(frame);
  }

  // bullet 动画帧切割（10帧横向）
  window.hitEffectFrames = [];
  const hitEffectFrameW = hitEffectSheet.width / 10;
  const hitEffectFrameH = hitEffectSheet.height;
  for (let i = 0; i < 10; i++) {
    const frame = hitEffectSheet.get(i * hitEffectFrameW, 0, hitEffectFrameW, hitEffectFrameH);
    window.hitEffectFrames.push(frame);
  }
}

function draw() {
  adjustCanvasWithAspectRatio();
  background(220);
  player.updateBlinking();
  if (gameStateManager.pageDrawer.shouldRenderMenu(player)) {
    return gameStateManager.pageDrawer.renderMenu(player, timeSpent);
  }
  updateGameState();
  // drawDebugCollisionBoxes(); // 这里是用于碰撞测试
}

function drawDebugCollisionBoxes() {
  noFill();
  stroke(255, 0, 0);
  rect(player.position.x, player.position.y, player.size.x, player.size.y);

  if (room && room.obstacles) {
    for (let obs of room.obstacles) {
      stroke(0, 255, 0);
      rect(obs.position.x, obs.position.y, obs.size.x, obs.size.y);
    }
  }

  if (room && room.enemies) {
    for (let enemy of room.enemies) {
      stroke(0, 0, 255);
      rect(enemy.position.x, enemy.position.y, enemy.size.x, enemy.size.y);
    }
  }
}

function updateGameState() {
  gameStateManager.pageDrawer.updatePauseBtnPosition();

  inputHandler.update(player);
  player.healByTime(timeSpent);

  drawUiHub(player, startTime, currentRoomIndex);

  checkSavePoint();
}

function keyPressed() {
  gameStateManager.pageDrawer.handleBtnPressed(player);
  if (!gameStateManager.pageDrawer.shouldRenderMenu(player)) {
    inputHandler.handlePlayerShooting(player);
  }
}

function setRoomImg() {
  rooms = rawData.rooms;
  rooms.forEach(room => {
    room.backgroundImg = loadImage(room.background);
    if (room.obstacles) {
      room.obstacles.forEach(obs => {
        obs.img = loadImage(obs.image);
      });
    }
    if (room.enemies) {
      room.enemies.forEach(enes => {
        enes.img = loadImage(enes.image);
      });
    }
  });
}
