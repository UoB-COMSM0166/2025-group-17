class MenuDrawer {
  constructor(eventBus) {
    this.btnIndex = 0;
    this.eventBus = eventBus;
    this.mainMenuDisplayed = true;
    this.isGamePaused = false;
    isGameCompleted = false;
    // Buttons for the main menu
    this.btnContinue = null;
    this.btnNewGame = null;
    this.mainMenuBtns = [];

    // Buttons for the pause menu
    this.btnPause = null;
    this.btnResume = null;
    this.btnExit = null;
    this.pauseMenuBtns = [];

    // Buttons for the game over page
    this.btnLoadLastSave = null;
    this.btnRestart = null;
    this.gameOverBtns = [];
  }

  // Helper to create a button with standard positioning and behavior
  createMenuButton(imgPath, label, yOffset, callback, hidden = false) {
    const btnHeight = 48;
    const btnWidth = 4 * btnHeight;
    let btn = createImg(imgPath, label);
    btn.style('background-color', '#AFDDC9');
    btn.size(btnWidth, btnHeight);
    btn.position(windowWidth / 2 - btn.width / 2, windowHeight / 2 + yOffset * btn.height / 2);
    btn.mouseClicked(() => {
      callback();
      this.btnIndex = 0;
    });
    btn.mouseOver(() => { btn.class('blink'); });
    btn.mouseOut(() => {
      btn.removeClass('blink');
      this.btnIndex = 0; 
    });
    if (hidden) btn.hide();
    return btn;
  }

  // Helper to update button position in case of on window resizing
  #repositionButton(btn, yOffset) {
    if (!btn) return;
    btn.position(windowWidth / 2 - btn.width / 2, windowHeight / 2 + yOffset * btn.height / 2);
  }

  setupMenu() {
    this.btnContinue = this.createMenuButton('assets/buttons/Continue.png', 'Continue', -1.1, () => this.eventBus.publish('LOAD_GAME'));
    this.btnNewGame = this.createMenuButton('assets/buttons/NewGame.png', 'New Game', 1.1, () => this.eventBus.publish('START_NEW_GAME'));
    this.mainMenuBtns.push(this.btnContinue, this.btnNewGame);
  }

  setupPauseMenu() {
    let pauseBtnSize = 40;
    this.btnPause = createImg('assets/buttons/pause.png', 'Click to pause');
    this.btnPause.size(pauseBtnSize, pauseBtnSize);
    this.btnPause.position(windowWidth / 2 + width / 2 - this.btnPause.width, windowHeight / 2 - height / 2);
    // Make the button a circle
    this.btnPause.style('border-radius', '50%');
    this.btnPause.mousePressed(() => this.eventBus.publish('PAUSE_GAME'));
    this.btnPause.hide();

    this.btnResume = this.createMenuButton('assets/buttons/Resume.png', 'Resume', -1.1, () => this.eventBus.publish('RESUME_GAME'), true);
    this.btnExit = this.createMenuButton('assets/buttons/Exit.png', 'Exit', 1.1, () => this.eventBus.publish('EXIT_TO_MENU'), true);
    this.pauseMenuBtns.push(this.btnResume, this.btnExit);
  }

  setupGameOverPage() {
    this.btnLoadLastSave = this.createMenuButton('assets/buttons/LastSave.png', 'Last Save', -1.1, () => this.eventBus.publish('LOAD_GAME'), true);
    this.btnRestart = this.createMenuButton('assets/buttons/Restart.png', 'Restart', 1.1, () => this.eventBus.publish('START_NEW_GAME'), true);
    this.gameOverBtns.push(this.btnLoadLastSave, this.btnRestart);
  }

  drawMenu() {
    image(startMenuImg, 0, 0, widthInPixel, heightInPixel);
    this.#repositionButton(this.btnContinue, -1.1);
    this.#repositionButton(this.btnNewGame,  1.1);
    this.mainMenuBtns[this.btnIndex].class('blink');
  }

  drawPauseMenu() {
    fill(255);
    stroke(0);
    strokeWeight(5);
    textSize(uiTextSize);
    textAlign(CENTER, CENTER);
    text("Paused", widthInPixel / 2, heightInPixel / 3);

    this.#repositionButton(this.btnResume, -1.1);
    this.#repositionButton(this.btnExit, 1.1);
    this.pauseMenuBtns[this.btnIndex].class('blink');
  }

  drawGameOverPage() {
    console.log("Drawing game over menu..")
    clear();
    background(220);
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    
    this.toggleResumeButtons();
    this.showGameOverButtons();
    text("Game Over", widthInPixel / 2, heightInPixel / 3);
    this.#repositionButton(this.btnLoadLastSave, -1.1);
    this.#repositionButton(this.btnRestart, 1.1);
    this.gameOverBtns[this.btnIndex].class('blink');
  }

  drawGameCompleted(totalTime) {
    clear();
    this.btnPause.hide();
    background(220);
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);

    const totalSecs = floor(totalTime / 1000);
    const mins = floor(totalSecs / 60);
    const secs = totalSecs % 60;
    text(
      `YOU WON! Took ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} seconds`,
      widthInPixel / 2,
      heightInPixel / 2
    );

    textSize(24);
    text(`Press ESC to return`, widthInPixel / 2, 2 * heightInPixel / 3);
    this.gameOverBtns[this.btnIndex].class('blink');
  }

  showStartButtons() {
    this.btnPause.hide();
    this.btnResume.hide();
    this.btnExit.hide();
    this.btnNewGame.show();
    this.btnContinue.show();
    this.mainMenuDisplayed = true;
  }

  toggleStartButtons() {
    this.mainMenuDisplayed = false;
    this.btnContinue.hide();
    this.btnNewGame.hide();
    this.btnPause.show();
  }

  showResumeButtons() {
    this.isGamePaused = true;
    this.btnPause.hide();
    this.btnResume.show();
    this.btnExit.show();
  }

  toggleResumeButtons() {
    this.isGamePaused = false;
    this.btnPause.show();
    this.btnResume.hide();
    this.btnExit.hide();
  }

  showGameOverButtons() {
    this.btnPause.hide();
    this.btnLoadLastSave.show();
    this.btnRestart.show();
  }

  toggleGameOverButtons() {
    this.btnLoadLastSave.hide();
    this.btnRestart.hide();
  }

  renderMenu(playerObj, timeSpent) {
    if (this.mainMenuDisplayed) this.drawMenu();
    if (this.isGamePaused) this.drawPauseMenu();
    if (isGameCompleted) this.drawGameCompleted(timeSpent);
    if (this.#isGameOver(playerObj)) this.drawGameOverPage();
  }

  shouldRenderMenu(playerObj) {
    return this.mainMenuDisplayed || this.isGamePaused || isGameCompleted || this.#isGameOver(playerObj);
  }

  updatePauseBtnPosition() {
    // Reset the button positions to support proper resizing
    let btnPositionX = windowWidth / 2 + width / 2 - this.btnPause.width;
    let btnPositionY = windowHeight / 2 - height / 2;
    this.btnPause.position(btnPositionX, btnPositionY);
  }

  handleBtnPressed(playerObj) {
    this.#returnToPrevPage(playerObj);
    
    if (this.mainMenuDisplayed) {
      this.#controlBtnsByKeys(this.mainMenuBtns, ['LOAD_GAME', 'START_NEW_GAME']);
    }
    if (this.#isGameOver(playerObj)) {
      this.#controlBtnsByKeys(this.gameOverBtns, ['LOAD_GAME', 'START_NEW_GAME']);
    }
    if (this.isGamePaused) {
      this.#controlBtnsByKeys(this.pauseMenuBtns, ['RESUME_GAME', 'EXIT_TO_MENU']);
    }
  }
  
  #returnToPrevPage(playerObj) {
    if (!keyIsDown(ESCAPE)) return;
    if (this.mainMenuDisplayed) return;
  
    this.btnIndex = 0;
    if (isGameCompleted || this.#isGameOver(playerObj)) {
      this.eventBus.publish('EXIT_TO_MENU');
      return;
    }
    if (this.isGamePaused) {
      this.eventBus.publish('RESUME_GAME');
      return;
    }
    this.eventBus.publish('PAUSE_GAME');
  }
  
  #controlBtnsByKeys(buttons, eventTypes) {
    if (keyIsDown(ENTER)) this.#pressBtnsByKeys(buttons, eventTypes);
    if (keyIsDown(DOWN_ARROW) || keyIsDown(UP_ARROW)) this.#moveBetweenBtnsByKeys(buttons);
  }
  
  #pressBtnsByKeys(buttons, eventTypes) {
    const prevBtnIndex = this.btnIndex;      
    // Reset previous button style
    buttons[prevBtnIndex].removeClass('blink');
    // Reset before the game state function to make sure the correct button is highlighted
    this.btnIndex = 0;
    this.eventBus.publish(eventTypes[prevBtnIndex]);
  }

  #moveBetweenBtnsByKeys(buttons) {
    const direction = keyIsDown(DOWN_ARROW) ? 1 : -1;
    buttons[this.btnIndex].removeClass('blink');

    // Highlight new button
    this.btnIndex = (this.btnIndex + direction + buttons.length) % buttons.length;
    buttons[this.btnIndex].class('blink');
  }

  #isGameOver(playerObj) {
    return !this.mainMenuDisplayed && playerObj.hp <= 0; 
  }
  showGameOverPage() {
    this.drawGameOverPage();
  }
  
}
