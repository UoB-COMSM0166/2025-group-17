function preload() {
  uiFont = loadFont('assets/fonts/PressStart2P.ttf'); //Load font

  //Player's HP
  heartImg = loadImage('assets/ui/full_heart.png');
  damagedHeartImg = loadImage('assets/ui/empty_heart.png');

  //boss HP
  bossHpBarImg = loadImage('assets/ui/bossBar.png');
  bossHpImg = loadImage('assets/ui/bossHp.png');

  //Game menu picture
  startMenuImg = loadImage('assets/background/Menu_Start.png');
  pauseMenuImg = loadImage('assets/background/Menu_Pause.png');
  gameCompletedMenuImg = loadImage('assets/background/Menu_GameCompleted.png');
  gameOverMenuImg = loadImage('assets/background/Menu_GameOver.png');

  //Door
  closedDoorImg = loadImage('assets/door/close-right.png');
  openDoorImg = loadImage('assets/door/open-right.png');

  //Save point
  savePointImg = loadImage('assets/savepoint/SavePoint.jpg');
  checkedSavePointImg = loadImage('assets/savepoint/SavePoint_Checked.png');

  //Player
  playerImage = loadImage('assets/character/Character.png');
  //Player bullet (normal bullets)
  bulletImage = loadImage('assets/character/bullets/NormalBullet.png');
  powerUpBulletImage = loadImage('assets/character/bullets/UpperBullet.png');

  //Enemy
  enemyImage = loadImage('assets/enemies/level1/CCTV.png'); //只会瞎走的敌人
  chaserImage = loadImage('assets/enemies/level1/Crab.png'); //螃蟹
  shooterImage = loadImage('assets/enemies/level1/The Boss.png'); //the boss
  pigImage = loadImage('assets/enemies/level1/pig_6&10.png'); //猪猪，索敌+朝着主角射击


  //Boss bullet
  BossBulletImgL2 = loadImage("assets/enemies/level2/L2_BossBullet.png");
  BossBulletImgL3 = loadImage('assets/enemies/level3/L3_BossBullet.png');

  //Item
  healthItemImg = loadImage('assets/items/item_health.png');
  powerUpItemImg = loadImage('assets/items/item_powerUp.png');
  photoItemImg = loadImage('assets/items/item_photo.png');

  //Read JSON Documentation 
  sceneData = loadJSON("assets/scenes/scene.json", preloadScenes);
  rawRoomData = loadJSON("assets/rooms.json", setRoomImg);
  helpBarData = loadJSON('assets/ui/helpBarContent.json');

  // -------------------------------------------
  // Store the global variable window.playerAnimations for use by Player.js
  // -------------------------------------------
  // Player spirit sheet
  // Load the four-direction animation frames of the player character (5 frames in each direction)
  window.playerAnimations = {
    up: [],
    down: [],
    left: [],
    right: []
  };
  ['up', 'down', 'left', 'right'].forEach(direction => {
    for (let i = 0; i < 5; i++) {
      const path = `assets/spritesheet/Player/${direction}${i}.png`;
      window.playerAnimations[direction].push(loadImage(path));
    }
  });

  //enemy sprite sheet
  window.enemyAnimations = {
    level0: { small: [], large: [] },
    level1: { small: [], large: [] },
    level2: { small: [], large: [] },
  };

  // L1 enemy ani（4）
  for (let i = 0; i < 4; i++) {
    const s1 = loadImage(`assets/spritesheet/Enemy/L1/Enemy_L1_S${i}.png`);
    const l1 = loadImage(`assets/spritesheet/Enemy/L1/Enemy_L1_L${i}.png`);

    window.enemyAnimations.level0.small.push(s1);
    window.enemyAnimations.level0.large.push(l1);

    window.enemyAnimations.level1.small.push(s1);
    window.enemyAnimations.level1.large.push(l1);
  }
  // L2 - 3
  for (let i = 0; i < 3; i++) {
    window.enemyAnimations.level2.small.push(loadImage(`assets/spritesheet/Enemy/L2/Enemy_L2_S${i}.png`));
    window.enemyAnimations.level2.large.push(loadImage(`assets/spritesheet/Enemy/L2/Enemy_L2_L${i}.png`));
  }

  // Load the Boss Sprite image (the entire image) and wait for the setup to synchronize the frame cutting
  bossSpriteSheet = loadImage("assets/spritesheet/Chaser/Crab_Boss.png");
  shooterSpriteSheet = loadImage("assets/spritesheet/Shooter/shooter_Boss.png");
  enemySpriteSheet = loadImage("assets/spritesheet/enemy.png");
  hitEffectSheet = loadImage("./assets/spritesheet/bullet_Effects.png");
  //Add the boss animation frame of Level 3 additionally
  window.shooterFramesDefault = [];
  for (let i = 0; i < 3; i++) {
    window.shooterFramesDefault.push(loadImage(`assets/spritesheet/Shooter/Shooter_L1_${i}.png`));
  }
  window.chaserFramesDefault = [];
  for (let i = 0; i < 3; i++) {
    window.chaserFramesDefault.push(loadImage(`assets/spritesheet/Chaser/Chaser_L1_${i}.png`));
  }
  window.chaserFramesL3 = [];
  for (let i = 0; i < 3; i++) {
    window.chaserFramesL3.push(loadImage(`assets/spritesheet/Chaser/Chaser_L3_${i}.png`));
  }
  window.shooterFramesL3 = [];
  for (let i = 0; i < 4; i++) {
    window.shooterFramesL3.push(loadImage(`assets/spritesheet/Shooter/Shooter_L3_${i}.png`));
  }



  //  Load the BGM of the main interface and the first level (using p5.sound)
  mainmenuSound = loadSound("assets/music/bgm/MainMenu.mp3");
  L1_OfficeSound = loadSound("assets/music/bgm/L1_Office.mp3");
  L2_CasinoSound = loadSound("assets/music/bgm/L2_Casino.mp3");
  L3_PsychoSound = loadSound("assets/music/bgm/L3_Psycho.mp3");


  //Loading sound effect
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
  shooterSound = loadSound("assets/music/se/Shooter_Shoot.mp3");
  bossDeathSound = loadSound('assets/music/se/Boss_Death.mp3');
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
