const uiTextSize = 24;
const hPadding = 50;
const vPadding = 20;

function setupMenu() {
  btnContinue = createButton('Continue');
  btnContinue.position(windowWidth / 2 - hPadding, windowHeight / 2 - vPadding);
  btnNewGame = createButton('New Game');
  btnNewGame.position(windowWidth / 2 - hPadding, windowHeight / 2 + vPadding);
  btnContinue.mousePressed(loadGameData);
  btnNewGame.mousePressed(startNewGame);
}

function setupPauseMenu() {
  btnPause = createImg('assets/icons/pause.svg', 'Click to pause');
  btnPause.position(windowWidth - 80, vPadding);
  btnPause.hide();
  
  btnResume = createButton('Resume');
  btnResume.position(windowWidth / 2 - hPadding, windowHeight / 2 - vPadding);
  btnResume.hide();

  btnExit = createButton('Exit');
  btnExit.position(windowWidth / 2 - hPadding, windowHeight / 2 + vPadding);
  btnExit.hide();
  
  btnPause.mousePressed(pauseGame);
  btnResume.mousePressed(resumeGame);
  btnExit.mousePressed(exitGame);
}

function drawMenu() {
  fill(0);
  textSize(uiTextSize);
  textAlign(CENTER);
  text("Welcome to the Game!", width / 2, height / 3);

  btnContinue.position(windowWidth / 2 - hPadding, windowHeight / 2 - vPadding);
  btnNewGame.position(windowWidth / 2 - hPadding, windowHeight / 2 + vPadding);
}

function drawPauseMenu() {
  fill(255);
  textSize(uiTextSize);
  textAlign(CENTER);
  text("Paused", width / 2, height / 3);

  // Reset the button positions to support proper resizing
  btnResume.position(windowWidth / 2 - hPadding, windowHeight / 2 - vPadding);
  btnExit.position(windowWidth / 2 - hPadding, windowHeight / 2 + vPadding);
}

function drawGameOver() {
  clear();
  background(220);
  fill(255, 0, 0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
}

