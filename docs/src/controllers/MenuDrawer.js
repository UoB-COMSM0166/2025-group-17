class MenuDrawer {
  constructor() {
    // Buttons for the main menu
    this.btnContinue = null;
    this.btnNewGame = null;

    // Buttons for the pause menu
    this.btnPause = null;
    this.btnResume = null;
    this.btnExit = null;

    // Buttons for the game over page
    this.btnLoadLastSave = null;
    this.btnRestart = null;
  }

  // Helper to create a button with standard positioning and behavior
  createMenuButton(label, yOffset, callback, hidden = false) {
    const btn = createButton(label);
    btn.position(windowWidth / 2 - hPadding, windowHeight / 2 + yOffset);
    if (hidden) btn.hide();
    btn.mousePressed(callback);
    return btn;
  }

  // Helper to update button position in case of on window resizing
  repositionButton(btn, yOffset) {
    if (btn) btn.position(windowWidth / 2 - hPadding, windowHeight / 2 + yOffset);
  }

  setupMenu() {
    this.btnContinue = this.createMenuButton('Continue', -vPadding, loadGameData);
    this.btnNewGame  = this.createMenuButton('New Game', vPadding, startNewGame);
  }

  setupPauseMenu() {
    this.btnPause = createImg('assets/icons/pause.svg', 'Click to pause');
    this.btnPause.position(widthInPixel - hPadding, vPadding);
    this.btnPause.size(iconSize, iconSize);
    this.btnPause.hide();
    this.btnPause.mousePressed(pauseGame);

    this.btnResume = this.createMenuButton('Resume', -vPadding, resumeGame, true);
    this.btnExit   = this.createMenuButton('Exit', vPadding, exitGame, true);
  }

  setupGameOverPage() {
    this.btnLoadLastSave = this.createMenuButton('Load Last Save', -vPadding, loadGameData, true);
    this.btnRestart = this.createMenuButton('Restart', vPadding, startNewGame, true);
  }

  drawMenu() {
    image(startMenuImg, 0, 0, widthInPixel, heightInPixel);
    this.repositionButton(this.btnContinue, -vPadding);
    this.repositionButton(this.btnNewGame,  vPadding);
  }

  drawPauseMenu() {
    fill(255);
    stroke(0);
    strokeWeight(5);
    textSize(uiTextSize);
    textAlign(CENTER, CENTER);
    text("Paused", widthInPixel / 2, heightInPixel / 3);

    this.repositionButton(this.btnResume, -vPadding);
    this.repositionButton(this.btnExit,   vPadding);
  }

  drawGameOverPage() {
    clear();
    background(220);
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    
    this.showGameOverButtons();
    text("Game Over", widthInPixel / 2, heightInPixel / 3);
    this.repositionButton(this.btnLoadLastSave, -vPadding);
    this.repositionButton(this.btnRestart, vPadding);
  }

  drawGameCompleted() {
    clear();
    background(220);
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);

    let totalSecs = floor(timeSpent / 1000);
    let mins = floor(totalSecs / 60);
    let secs = totalSecs % 60;
    text(
      `YOU WON! Took ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} seconds`,
      widthInPixel / 2,
      heightInPixel / 2
    );
  }

  showStartButtons() {
    this.btnPause.hide();
    this.btnResume.hide();
    this.btnExit.hide();
    this.btnNewGame.show();
    this.btnContinue.show();
  }

  toggleStartButtons() {
    this.btnContinue.hide();
    this.btnNewGame.hide();
    this.btnPause.show();
  }

  showResumeButtons() {
    this.btnPause.hide();
    this.btnResume.show();
    this.btnExit.show();
  }

  toggleResumeButtons() {
    this.btnPause.show();
    this.btnResume.hide();
    this.btnExit.hide();
  }

  showGameOverButtons() {
    this.btnLoadLastSave.show();
    this.btnRestart.show();
  }

  toggleGameOverButtons() {
    this.btnLoadLastSave.hide();
    this.btnRestart.hide();
  }

  renderMenu() {
    if (menuDisplayed) return this.drawMenu();
    if (isGamePaused) return this.drawPauseMenu();
    if (isGameOver()) return this.drawGameOverPage();
    if (isGameCompleted) return this.drawGameCompleted();
  }
}
