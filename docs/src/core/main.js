function setup() {
  // 防止 bossSpriteSheet 未加载时报错
  if (!bossSpriteSheet) {
    console.warn(" bossSpriteSheet not loaded yet!");
    return;
  }

  //画布建立
  cnv = createCanvas(windowWidth, windowHeight);

  //转场管理
  window.fadeMgr = new FadeManager(0.05);
  fadeMgr = window.fadeMgr;

  //初始化房间
  room = new Room();
  let inputHandler = new InputHandler(room);
  inputHandler.fadeMgr = fadeMgr;

  const eventBus = new EventBus();
  //页面管理器
  const PageDrawer = new MenuDrawer(eventBus, sceneData, sceneImgs, sceneSounds, helpBarData);
  gameStateManager = new GameStateManager(eventBus, PageDrawer, inputHandler);
  PageDrawer.setupMainMenu();
  PageDrawer.setupPauseMenu();
  PageDrawer.setupGameOverPage();
  setTimeout(() => gameStateManager.playMainmenuSound(), 2500); // 设置阻塞，在privacy的2.5秒后播放音效

  //初始化角色
  player = new Player();

  //----------------精灵图提取------------------
  // Extract all animation frames
  window.bossFrames = [];
  extractFrames(bossSpriteSheet, 3, window.bossFrames);

  window.shooterFrames = [];
  extractFrames(shooterSpriteSheet, 3, window.shooterFrames);

  window.enemyFrames = [];
  extractFrames(enemySpriteSheet, 4, window.enemyFrames);

  window.hitEffectFrames = [];
  extractFrames(hitEffectSheet, 10, window.hitEffectFrames);
  //-------------------------------------------
}

//辅助函数，用于提取精灵图动画帧
function extractFrames(spriteSheet, frameCount, targetArray) {
  const frameW = spriteSheet.width / frameCount;
  const frameH = spriteSheet.height;

  for (let i = 0; i < frameCount; i++) {
    targetArray.push(spriteSheet.get(i * frameW, 0, frameW, frameH));
  }
}

function draw() {
  player.updateBlinking();
  gameStateManager.update();
  // drawDebugCollisionBoxes(); // 这里是用于碰撞测试
  fadeMgr.update();
  fadeMgr.draw();
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

function keyPressed() {
  if (fadeMgr.isActive()) return;
  if (gameStateManager) gameStateManager.handlePlayerShooting();
}
