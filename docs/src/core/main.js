let mainmenuSound = new Audio("assets/music/Scene_music/MainMenu.mp3");
let pauseSound = new Audio("assets/music/Pause.mp3");
let hitSound = new Audio("assets/music/Enemy_Hurt.mp3");
let deathSound = new Audio("assets/music/Enemy_Death.mp3");
let shootSound = new Audio("assets/music/Player_Shoot.mp3");
let hurtSound = new Audio("assets/music/Player_Hurt.mp3");
let deathSound2 = new Audio("assets/music/Player_Death.mp3");

let openDoorSound = new Audio("assets/music/Door_Open.mp3");

function preload() {
  uiFont = loadFont('assets/fonts/PressStart2P.ttf');
  heart = loadImage('assets/icons/heart.svg');
  damagedHeart = loadImage('assets/icons/damagedHeart.svg');
  startMenuImg = loadImage('assets/background/menu_start.png');
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
  savePointImg = loadImage('assets/savepoint/savepoint.jpg');

  rooms.forEach((room, i) => {
    room.backgroundImg = loadImage(room.background);
    rooms[i] = room; // Ensure the reference is updated
  });

}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  menuDrawer = new MenuDrawer();
  adjustCanvasWithAspectRatio();
  player = new Player(playerX, playerY);
  room = new Room();
  room.setup(rooms[currentRoomIndex]);
  inputHandler = new InputHandler(room);

  menuDrawer.setupMenu();
  menuDrawer.setupPauseMenu();
  menuDrawer.setupGameOverPage();
}

function draw() {
  // // If loading is not complete, display the loading bar.
  // if (!loadingComplete) {
  //   drawLoadingBar();
  //   return;
  // }

  adjustCanvasWithAspectRatio();
  background(220);

  if (menuDisplayed || isGamePaused || isGameOver() || isGameCompleted) {
    return menuDrawer.renderMenu();
  }
  // Reset the button positions to support proper resizing
  menuDrawer.btnPause.position(cnv.x + width - hPadding, vPadding);
  updateGameState();
}

function updateGameState() {
  room.update();
  inputHandler.update();
  player.display();
  drawUiHub();
  checkSavePoint();
}

function keyPressed() {
  inputHandler.handlePlayerShooting();
}

let boss = {
  hp: 30,
  maxHp: 100
};

// //for testing the loading bar of the pictures
// function checkLoadingComplete() {
//   if (assetsLoaded === totalAssets) {
//     loadingComplete = true;
//   }
// }
// // Function to draw the loading bar on screen.
// function drawLoadingBar() {
//   background(50);

//   // Calculate progress as a fraction.
//   let progress = assetsLoaded / totalAssets;

//   // Define dimensions and position for the loading bar.
//   let barWidth = width - 200;
//   let barHeight = 20;
//   let x = 100;
//   let y = height / 2;

//   // Draw the empty bar outline.
//   noFill();
//   stroke(255);
//   rect(x, y, barWidth, barHeight);

//   // Draw the filled portion of the bar.
//   noStroke();
//   fill(0, 255, 0);
//   rect(x, y, progress * barWidth, barHeight);

//   // Draw the loading percentage text.
//   fill(255);
//   textAlign(CENTER, CENTER);
//   textSize(20);
//   text("Loading... " + floor(progress * 100) + "%", width / 2, y - 30);
// }