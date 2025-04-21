class PageDrawer {
  #scenePlayer;
  #state = "mainMenu"; // "startScene", "endScene", "inGame", "mainMenu", "paused", "completed"
  constructor(eventBus, sceneData, sceneImgs, sceneSounds) {
    this.btnIndex = 0;
    this.eventBus = eventBus;
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

    this.#scenePlayer = new ScenePlayer(sceneData, sceneImgs, sceneSounds);
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
    btn.mouseOver(() => { 
      btn.class('blink');
      this.btnIndex = null;
    });
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

  setupMainMenu() {
    this.btnContinue = this.createMenuButton('assets/buttons/Continue.png', 'Continue', -1.1, () => this.eventBus.publish('LOAD_GAME'));
    this.btnNewGame = this.createMenuButton('assets/buttons/NewGame.png', 'New Game', 1.1, () => this.#handleNewGame());
    this.mainMenuBtns.push(this.btnContinue, this.btnNewGame);
  }

  #handleNewGame() {
    console.log("Load start scene..");
    this.#playStartScene();
    console.log("Start new game..");
    this.eventBus.publish('START_NEW_GAME');
    this.btnPause.hide();
  }

  #playStartScene() {
    console.log("Load start scene..");
    this.#scenePlayer.setScene("start");
    this.#state = "startScene";
  }

  setupPauseMenu() {
    let pauseBtnSize = 40;
    this.btnPause = createImg('assets/buttons/Pause.png', 'Click to pause');
    this.btnPause.size(pauseBtnSize, pauseBtnSize);
    this.btnPause.position(windowWidth / 2 + width / 2 - this.btnPause.width, windowHeight / 2 - height / 2);
    // Make the button a circle
    this.btnPause.style('border-radius', '50%');
    this.btnPause.mousePressed(() => this.eventBus.publish('PAUSE_GAME'));
    this.btnPause.hide();

    this.btnResume = this.createMenuButton('assets/buttons/Resume.png', 'Resume', -1.1, () => this.eventBus.publish('RESUME_GAME'), true);
    this.btnExit = this.createMenuButton('assets/buttons/Exit.png', 'Exit', 1.1, () => this.eventBus.publish('EXIT_TO_MAIN_MENU'), true);
    this.pauseMenuBtns.push(this.btnResume, this.btnExit);
  }

  setupGameOverPage() {
    this.btnLoadLastSave = this.createMenuButton('assets/buttons/LastSave.png', 'Last Save', -1.1, () => this.eventBus.publish('LOAD_GAME'), true);
    this.btnRestart = this.createMenuButton('assets/buttons/Restart.png', 'Restart', 1.1, () => this.eventBus.publish('START_NEW_GAME'), true);
    this.gameOverBtns.push(this.btnLoadLastSave, this.btnRestart);
  }

  drawMainMenu() {
    image(startMenuImg, 0, 0, widthInPixel, heightInPixel);
    this.#repositionButton(this.btnContinue, -1.1);
    this.#repositionButton(this.btnNewGame,  1.1);
    if (this.btnIndex !== null) this.mainMenuBtns[this.btnIndex].class('blink');
  }

  drawPauseMenu() {
    this.#drawMainMsg("Paused");
    this.#repositionButton(this.btnResume, -1.1);
    this.#repositionButton(this.btnExit, 1.1);
    if (this.btnIndex !== null) this.pauseMenuBtns[this.btnIndex].class('blink');
  }

  #drawMainMsg(title) {
    stroke(0);
    strokeWeight(5);
    textSize(32);
    textAlign(CENTER, CENTER);
    fill('#AFDDC9');
    text(title, widthInPixel / 2, heightInPixel / 3);
  }

  drawGameOverPage() {
    console.log("Drawing game over page..")
    clear();
    background(220);
    
    this.toggleResumeButtons();
    this.showGameOverButtons();
    this.#drawMainMsg("Game Over");
    this.#repositionButton(this.btnLoadLastSave, -1.1);
    this.#repositionButton(this.btnRestart, 1.1);
    if (this.btnIndex !== null) this.gameOverBtns[this.btnIndex].class('blink');
  }

  setInGameState() {
    this.#state = "inGame";
  }

  drawGameCompleted(totalTime) {
    clear();
    this.btnPause.hide();
    background(220);

    const totalSecs = floor(totalTime / 1000);
    const mins = floor(totalSecs / 60);
    const secs = totalSecs % 60;
    this.#drawMainMsg(`YOU WON! Took ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} seconds`);

    textSize(24);
    text(`Press ENTER to enter the epilogue`, widthInPixel / 2, 2 * heightInPixel / 3);
    text(`Press ESC to return`, widthInPixel / 2, 5 * heightInPixel / 6);
  }

  showStartButtons() {
    this.btnPause.hide();
    this.btnResume.hide();
    this.btnExit.hide();
    this.btnNewGame.show();
    this.btnContinue.show();
    this.#state = "mainMenu";
  }

  toggleStartButtons() {
    this.btnContinue.hide();
    this.btnNewGame.hide();
    this.btnPause.show();
  }

  showResumeButtons() {
    this.#state = "paused";
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
    this.btnPause.hide();
    this.btnLoadLastSave.show();
    this.btnRestart.show();
  }

  toggleGameOverButtons() {
    this.btnLoadLastSave.hide();
    this.btnRestart.hide();
  }

  renderMenu(playerObj, timeSpent) {
    if (this.#isScenePage()) this.#scenePlayer.draw();
    if (this.#state === "mainMenu") this.drawMainMenu();
    if (this.#state === "paused") this.drawPauseMenu();
    if (isGameCompleted && !this.#isScenePage()) this.drawGameCompleted(timeSpent);
    if (this.#isGameOver(playerObj)) this.drawGameOverPage();
  }

  #isScenePage() {
    return this.#state === "startScene" || this.#state === "endScene";
  }

  shouldRenderMenu(playerObj) {
    return this.#state === "mainMenu" || this.#state === "paused" || isGameCompleted || this.#isGameOver(playerObj) || this.#isScenePage();
  }

  updatePauseBtnPosition() {
    // Reset the button positions to support proper resizing
    let btnPositionX = windowWidth / 2 + width / 2 - this.btnPause.width;
    let btnPositionY = windowHeight / 2 - height / 2;
    this.btnPause.position(btnPositionX, btnPositionY);
  }

  handleBtnPressed(playerObj) {
    this.#returnToPrevPage(playerObj);
    if (isGameCompleted || this.#isScenePage()) this.#handleSceneProgress();
    else if (this.#state === "mainMenu") {
      this.#controlBtnsByKeys(this.mainMenuBtns, ['LOAD_GAME', 'START_NEW_GAME']);
    } else if (this.#isGameOver(playerObj)) {
      this.#controlBtnsByKeys(this.gameOverBtns, ['LOAD_GAME', 'START_NEW_GAME']);
    } else if (this.#state === "paused") {
      this.#controlBtnsByKeys(this.pauseMenuBtns, ['RESUME_GAME', 'EXIT_TO_MAIN_MENU']);
    }
  }

  #handleSceneProgress() {
    if (!keyIsDown(ENTER)) return;
    if (this.#isScenePage()) this.#playNextStoryLine();
    else if (isGameCompleted) this.#transitionToEndScene();
  }

  #playNextStoryLine() {
    this.#scenePlayer.next();
    console.log(this.#scenePlayer.isSceneComplete());
    if (!this.#scenePlayer.isSceneComplete()) return;
    
    this.#scenePlayer.stopBGM();
    switch (this.#state) {
      case "startScene":
        this.#state = "inGame";
        this.btnPause.show();
        console.log("Progress to playing..");
        break;
      case "endScene":
        this.eventBus.publish("EXIT_TO_MAIN_MENU");
        this.#state = "mainMenu";
        console.log("Back to main menu from the story..");
        break;
    }
  }

  #transitionToEndScene() {
    this.#state = "endScene";
    this.#scenePlayer.setScene("end");
  }
  
  #returnToPrevPage(playerObj) {
    if (!keyIsDown(ESCAPE)) return;
    if (this.#state === "mainMenu" || this.#isScenePage()) return;
  
    this.btnIndex = 0;
    if (isGameCompleted || this.#isGameOver(playerObj)) {
      this.eventBus.publish('EXIT_TO_MAIN_MENU');
      return;
    }
    if (this.#state === "paused") {
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
    if (this.btnIndex === null) return;
    const prevBtnIndex = this.btnIndex;      
    // Reset previous button style
    buttons[prevBtnIndex].removeClass('blink');
    // Reset before the game state function to make sure the correct button is highlighted
    this.btnIndex = 0;
    if (buttons[prevBtnIndex] === this.btnNewGame) this.#handleNewGame();
    this.eventBus.publish(eventTypes[prevBtnIndex]);
    if (buttons[prevBtnIndex] === this.btnNewGame) this.btnPause.hide();
  }

  #moveBetweenBtnsByKeys(buttons) {
    if (this.btnIndex === null) return;
    const direction = keyIsDown(DOWN_ARROW) ? 1 : -1;
    buttons[this.btnIndex].removeClass('blink');

    // Highlight new button
    this.btnIndex = (this.btnIndex + direction + buttons.length) % buttons.length;
    buttons[this.btnIndex].class('blink');
  }

  #isGameOver(playerObj) {
    return (this.#state !== "mainMenu") && playerObj.hp <= 0; 
  }
}
