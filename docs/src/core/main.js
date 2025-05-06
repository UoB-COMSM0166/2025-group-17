function setup() {
  // Prevent errors when the bossSpriteSheet is not loaded
  if (!bossSpriteSheet) {
    console.warn(" bossSpriteSheet not loaded yet!");
    return;
  }

  //Canvas establishment
  cnv = createCanvas(windowWidth, windowHeight);

  //Transfer management
  window.fadeMgr = new FadeManager(0.05);
  fadeMgr = window.fadeMgr;

  //Initialize the room
  room = new Room();
  let inputHandler = new InputHandler(room);
  inputHandler.fadeMgr = fadeMgr; //Handle the transfer

  const eventBus = new EventBus();
  //Page Manager
  const PageDrawer = new MenuDrawer(eventBus, sceneData, sceneImgs, sceneSounds, helpBarData);
  gameStateManager = new GameStateManager(eventBus, PageDrawer, inputHandler);
  PageDrawer.setupMainMenu();
  PageDrawer.setupPauseMenu();
  PageDrawer.setupGameOverPage();
  setTimeout(() => gameStateManager.playMainmenuSound(), 2500); // Set blocking and play the sound effect after 2.5 seconds of privacy

  //Initialize the player
  player = new Player();

  //----------------Extraction of Sprite Sheet------------------
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

//Auxiliary function, used for extracting Sprite animation frames
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
  // drawDebugCollisionBoxes(); // Used for collision testing
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
