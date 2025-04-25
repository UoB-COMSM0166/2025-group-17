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

  //  初始化 gameStateManager，并 setPageDrawer
  room = new Room();
  let inputHandler = new InputHandler(room);
  const pageDrawer = new PageDrawer(eventBus, sceneData, sceneImgs, sceneSounds);
  gameStateManager = new GameStateManager(eventBus, pageDrawer, inputHandler);
  pageDrawer.setGameStateManager(gameStateManager);
  pageDrawer.setupMainMenu();
  pageDrawer.setupPauseMenu();
  pageDrawer.setupGameOverPage();
  gameStateManager.playMainmenuSound();

  player = new Player(playerX, playerY);

  // Extract all animation frames
  window.bossFrames = [];
  extractFrames(bossSpriteSheet, 3, window.bossFrames);

  window.shooterFrames = [];
  extractFrames(shooterSpriteSheet, 3, window.shooterFrames);

  window.enemyFrames = [];
  extractFrames(enemySpriteSheet, 4, window.enemyFrames);

  window.hitEffectFrames = [];
  extractFrames(hitEffectSheet, 10, window.hitEffectFrames);
}

function extractFrames(spriteSheet, frameCount, targetArray) {
  const frameW = spriteSheet.width / frameCount;
  const frameH = spriteSheet.height;
  
  for (let i = 0; i < frameCount; i++) {
    targetArray.push(spriteSheet.get(i * frameW, 0, frameW, frameH));
  }
}

function draw() {
  adjustCanvasWithAspectRatio();
  background(220);
  player.updateBlinking();
  if (!gameStateManager.shouldRenderMenu()) gameStateManager.update();
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

function keyPressed() {
  gameStateManager.handlePlayerShooting();
}

function setRoomImg() {
  rooms = rawRoomData.rooms;
  rooms.forEach(room => {
    room.backgroundImg = loadImage(room.background);
    if (room.obstacles) {
      room.obstacles.forEach(obs => {
        obs.img = loadImage(obs.image);
      });
    }
    if (room.enemies) {
      room.enemies.forEach(enes => {
        console.log(`Loading ${enes.image} into room ${room.currentRoomId}`)
        enes.img = loadImage(enes.image);
        console.log(`Enemy image size ${enes.img.width}, ${enes.img.height}`)
      });
    }
  });
}
