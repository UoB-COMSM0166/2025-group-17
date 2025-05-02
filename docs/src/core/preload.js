function preload() {
  uiFont = loadFont('assets/fonts/PressStart2P.ttf');
  heartImg = loadImage('assets/ui/full_heart.png');
  damagedHeartImg = loadImage('assets/ui/empty_heart.png');
  bossHpBarImg = loadImage('assets/ui/bossBar.png');
  bossHpImg = loadImage('assets/ui/bossHp.png');
  startMenuImg = loadImage('assets/background/Menu_Start.png');
  pauseMenuImg = loadImage('assets/background/Menu_Pause.png');
  gameCompletedMenuImg = loadImage('assets/background/Menu_GameCompleted.png');
  gameOverMenuImg = loadImage('assets/background/Menu_GameOver.png');
  closedDoorImg = loadImage('assets/door/close-right.png');
  openDoorImg = loadImage('assets/door/open-right.png');

  //load player image
  playerImage = loadImage('assets/character/Character.png');
  //load bullet image
  bulletImage = loadImage('assets/character/bullets/NormalBullet.png');
  //load enemy image
  enemyImage = loadImage('assets/enemies/level1/CCTV.png');
  chaserImage = loadImage('assets/enemies/level1/Crab.png'); // 路径按你实际来
  shooterImage = loadImage('assets/enemies/level1/The Boss.png'); // 路径按你实际来
  BossBulletImgL2 = loadImage("assets/enemies/level2/L2_BossBullet.png");
  BossBulletImgL3 = loadImage('assets/enemies/level3/L3_BossBullet.png'); // 路径按你实际来
  savePointImg = loadImage('assets/savepoint/SavePoint.jpg');
  checkedSavePointImg = loadImage('assets/savepoint/SavePoint_Checked.png');

  // Load item images
    healthItemImg = loadImage('assets/items/item_health.png');
    powerUpItemImg = loadImage('assets/items/item_powerUp.png');
    photoItemImg = loadImage('assets/items/item_photo.png');

  // Use a callback to make sure we don't access data before loaded
  sceneData = loadJSON("assets/scenes/scene.json", preloadScenes);
  rawRoomData = loadJSON("assets/rooms.json", setRoomImg);
  helpBarData = loadJSON('assets/ui/helpBarContent.json');

  // -------------------------------------------
  // 加载玩家角色四方向动画帧（每个方向5张）
  // 存入全局变量 window.playerAnimations 供 Player.js 使用
  // -------------------------------------------
  window.playerAnimations = {
    up: [],
    down: [],
    left: [],
    right: []
  };

  ['up', 'down', 'left', 'right'].forEach(direction => {
    for (let i = 0; i < 5; i++) {
      const path = `assets/spritesheet/${direction}${i}.png`;
      window.playerAnimations[direction].push(loadImage(path));
    }
  });

  // 加载 Boss 精灵图（整张），等 setup 同步切帧
  bossSpriteSheet = loadImage("assets/spritesheet/Crab_Boss.png");
  shooterSpriteSheet = loadImage("assets/spritesheet/shooter_Boss.png");
  enemySpriteSheet = loadImage("assets/spritesheet/enemy.png"); 
  hitEffectSheet = loadImage("./assets/spritesheet/bullet_Effects.png");

  //  加载主界面和第一关的 BGM（使用 p5.sound）
  mainmenuSound = loadSound("assets/music/bgm/MainMenu.mp3");
  L1_OfficeSound = loadSound("assets/music/bgm/L1_Office.mp3");
  L2_CasinoSound = loadSound("assets/music/bgm/L2_Casino.mp3");
  L3_PsychoSound = loadSound("assets/music/bgm/L3_Psycho.mp3");

  // Load sound effects
  btnSound = loadSound("assets/music/se/Btn_Pressed.mp3");
  hitSound = loadSound("assets/music/se/Enemy_Hurt.mp3");
  playerDeathSound = loadSound("assets/music/se/Player_Death.mp3");
  enemyDeathSound = loadSound("assets/music/se/Enemy_Death.mp3");
  bossDeathSound = loadSound("assets/music/se/Boss_Death.mp3");
  shootSound = loadSound("assets/music/se/Player_Shoot.mp3");
  hurtSound = loadSound("assets/music/se/Player_Hurt.mp3");
  openDoorSound = loadSound("assets/music/se/Door_Open.mp3");
  itemPickSound = loadSound("assets/music/se/Item_Picked.mp3");
  //shooterFireSound  = loadSound("assets/music/se/Shooter_Shoot.mp3");
  shooterWarningSound  = loadSound("assets/music/se/Shooter_Shoot.mp3");
  bossDeathSound  = loadSound('assets/music/se/Boss_Death.mp3');
}

function preloadScenes() {
  const allScenes = [...sceneData.start, ...sceneData.end];
  for (let line of allScenes) {
    // Load once per unique filename
    if (line.image && !sceneImgs[line.image]) {
      sceneImgs[line.image] = loadImage(`assets/scenes/${line.image}.png`);
    }

    if (line.sound && !sceneSounds[line.sound.name]) {
      const folder = line.sound.type === "bgm" ? "assets/music/bgm" : "assets/music/se";
      sceneSounds[line.sound.name] = loadSound(`${folder}/${line.sound.name}.mp3`);
    }
  }
}

function setRoomImg() {
  roomData = rawRoomData.rooms;
  roomData.forEach(room => {
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
