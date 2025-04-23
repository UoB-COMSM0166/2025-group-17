let bossSpriteSheet;
let shooterSpriteSheet;
let enemySpriteSheet;
let mainmenuSound;
let L1_OfficeSound;
let L3_PsychoSound;

function preload() {
  uiFont = loadFont('assets/fonts/PressStart2P.ttf');
  heartImg = loadImage('assets/icons/full_heart.png');
  damagedHeartImg = loadImage('assets/icons/empty_heart.png');
  startMenuImg = loadImage('assets/background/Menu_Start.png');
  pauseMenuImg = loadImage('assets/background/Menu_Pause.png');
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

  savePointImg = loadImage('assets/savepoint/SavePoint.jpg');
  checkedSavePointImg = loadImage('assets/savepoint/SavePoint_Checked.png');
  rawData = loadJSON("assets/rooms.json");

  // Use a callback to make sure we don't access data before loaded
  sceneData = loadJSON("assets/scenes/scene.json", preloadScenes);

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

  //  加载主界面和第一关的 BGM（使用 p5.sound）
  mainmenuSound = loadSound("assets/music/bgm/MainMenu.mp3");
  L1_OfficeSound = loadSound("assets/music/bgm/L1_Office.mp3");
  L3_PsychoSound = loadSound("assets/music/bgm/L3_Psycho.mp3");
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
