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
  btnPause.position(widthInPixel - hPadding, vPadding);
  btnPause.size(iconSize, iconSize);
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
  image(startMenuImg, 0, 0, widthInPixel, heightInPixel);
  btnContinue.position(windowWidth / 2 - hPadding, windowHeight / 2 - vPadding);
  btnNewGame.position(windowWidth / 2 - hPadding, windowHeight / 2 + vPadding);
}

function drawPauseMenu() {
  fill(255);
  stroke(0);
  strokeWeight(5);
  textSize(uiTextSize);
  textAlign(CENTER, CENTER);
  text("Paused", widthInPixel / 2, heightInPixel / 3);

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
  text("Game Over", widthInPixel / 2, heightInPixel / 2);
}

function drawGameCompleted() {
  clear();
  background(220);
  fill(255, 0, 0);
  textSize(32);
  textAlign(CENTER, CENTER);
  
  let totalSecs = floor(timeSpent / 1000);
  let mins = floor(totalSecs/60);
  let secs = totalSecs % 60;
  text(`YOU WON! Took ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} seconds`, widthInPixel / 2, heightInPixel / 2);
  // text("THE END? ALL CLEARED.", widthInPixel / 2, heightInPixel / 2);
  // text("YOU WON!", widthInPixel / 2, heightInPixel / 2);

}

