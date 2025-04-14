let pauseSound = new Audio("assets/music/Pause.mp3");
let hitSound = new Audio("assets/music/Enemy_Hurt.mp3");
let deathSound = new Audio("assets/music/Enemy_Death.mp3");
let shootSound = new Audio("assets/music/Player_Shoot.mp3");
let hurtSound = new Audio("assets/music/Player_Hurt.mp3");
let deathSound2 = new Audio("assets/music/Player_Death.mp3");

let openDoorSound = new Audio("assets/music/Door_Open.mp3");

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  menuDrawer = new MenuDrawer();
  adjustCanvasWithAspectRatio();
  player = new Player(playerX, playerY);
  room = new Room();
  
  currentRoomIndex = 0;
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
  player.updateBlinking();
  // if (menuDrawer.isGameOver) {
  //   menuDrawer.showGameOverPage(); // ✅ 主动显示 Game Over 页面
  //   return; // ❗停止其他更新逻辑
  // }

  if (menuDrawer.shouldRenderMenu(player)) return menuDrawer.renderMenu(player, timeSpent);
  updateGameState();
}

function updateGameState() {
  menuDrawer.updatePauseBtnPosition();
  room.update();
  inputHandler.update(player);
  player.display();
  player.healByTime(timeSpent);
  drawUiHub();
  checkSavePoint();
}

function keyPressed() {
  menuDrawer.handleBtnPressed(player);
  if (!menuDrawer.shouldRenderMenu(player)) inputHandler.handlePlayerShooting(player);
}

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