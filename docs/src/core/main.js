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
    console.warn("⚠️ bossSpriteSheet not loaded yet!");
    return;
  }

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
  
  currentRoomIndex = 4;
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
 //drawDebugCollisionBoxes(); // 这里是用于碰撞测试
}

//-----------------------------------------------------------------------------------------------------
// 这里是用于绘制碰撞测试边界的！！！！！！！！！！！注释掉前面 drawDebugCollisionBoxes();就行
function drawDebugCollisionBoxes() {
  noFill();

  // 玩家碰撞盒（红色）
  stroke(255, 0, 0);
  rect(player.position.x, player.position.y, player.size.x, player.size.y);

  // 障碍物碰撞盒（绿色）
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
//--------------------------------------------------------------------------------------------

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
