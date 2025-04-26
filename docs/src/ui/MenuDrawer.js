class MenuDrawer {
  #scenePlayer;
  #helpBar;
  #state = "mainMenu"; // "startScene", "endScene", "inGame", "mainMenu", "paused", "completed"
  constructor(eventBus, sceneData, sceneImgs, sceneSounds, helpBarData) {
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
    this.#helpBar = new HelpBar(helpBarData);
  }

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
    btn.mouseOver(() => { this.#handleMouseOver(btn) });
    btn.mouseOut(() => {
      btn.removeClass('blink');
      this.btnIndex = 0;
    });
    if (hidden) btn.hide();
    return btn;
  }

  #handleMouseOver(btn) {
    let btnArray;
    if (this.mainMenuBtns.includes(btn)) {
      btnArray = this.mainMenuBtns;
    } else if (this.pauseMenuBtns.includes(btn)) {
      btnArray = this.pauseMenuBtns;
    } else if (this.gameOverBtns.includes(btn)) {
      btnArray = this.gameOverBtns;
    }
    
    if (btnArray) {
      btnArray[this.btnIndex].removeClass('blink');
      this.btnIndex = btnArray.indexOf(btn);
      btn.class('blink');
    }
  }

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
    let pauseBtnSize = width / 16;
    this.btnPause = createImg('assets/buttons/Pause.png', 'Click to pause');
    this.btnPause.size(pauseBtnSize, pauseBtnSize);
    this.btnPause.position(windowWidth / 2 + width / 2 - this.btnPause.width, windowHeight / 2 - height / 2);
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
    this.#repositionButton(this.btnNewGame, 1.1);
    if (this.btnIndex !== null) this.mainMenuBtns[this.btnIndex].class('blink');
  }

  drawPauseMenu() {
    image(pauseMenuImg, 0, 0, widthInPixel, heightInPixel);
    // Reposition the buttons to the top half of the canvas
    this.#repositionButton(this.btnResume, -6.1);
    this.#repositionButton(this.btnExit, -3.9);
    if (this.btnIndex !== null) this.pauseMenuBtns[this.btnIndex].class('blink');
  }

  #drawMainMsg(title) {
    push();
    stroke(0);
    strokeWeight(5);
    textSize(32);
    textAlign(CENTER, CENTER);
    fill('#AFDDC9');
    textFont(uiFont, 20);
    text(title, widthInPixel / 2, heightInPixel / 3);
    pop();
  }

  drawGameOverPage() {
    clear();
    image(gameOverMenuImg, 0, 0, widthInPixel, heightInPixel);
    this.toggleResumeButtons();
    this.showGameOverButtons();
    this.#repositionButton(this.btnLoadLastSave, -1.1);
    this.#repositionButton(this.btnRestart, 1.1);
    if (this.btnIndex !== null) this.gameOverBtns[this.btnIndex].class('blink');
  }

  getGameState() { return this.#state; }
  setInGameState() { this.#state = "inGame"; }
  setCompletedState() { this.#state = "completed"; }

  drawGameCompleted(totalTime) {
    clear();
    this.btnPause.hide();
    background(220);

    const totalSecs = floor(totalTime / 1000);
    const mins = floor(totalSecs / 60);
    const secs = totalSecs % 60;
    this.#drawMainMsg(`YOU WON! Took ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} seconds`);
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
    if (!this.shouldRenderMenu(playerObj)) this.#helpBar.hide();
    if (this.#isScenePage()) this.#scenePlayer.draw();
    if (this.#state === "mainMenu") this.drawMainMenu();
    if (this.#state === "paused") this.drawPauseMenu();
    if (this.#state === "completed" && !this.#isScenePage()) this.drawGameCompleted(timeSpent); 
    if (this.#isGameOver(playerObj)) this.drawGameOverPage();

    if (this.#isScenePage()) this.#helpBar.update("scene");
    else this.#helpBar.update(this.#state, this.btnIndex);
  }

  #isScenePage() {
    return this.#state === "startScene" || this.#state === "endScene";
  }

  shouldRenderMenu(playerObj) {
    return this.#state === "mainMenu" || this.#state === "paused" || this.#state === "completed" || this.#isGameOver(playerObj) || this.#isScenePage();
  }

  updatePauseBtnPosition() {
    let btnPositionX = windowWidth / 2 + width / 2 - this.btnPause.width;
    let btnPositionY = windowHeight / 2 - height / 2;
    this.btnPause.position(btnPositionX, btnPositionY);
  }

  handleBtnPressed(playerObj) {
    this.#returnToPrevPage(playerObj);
    if (this.#state === "completed" || this.#isScenePage()) this.#handleSceneProgress();
    else if (this.#state === "mainMenu") {
      this.#controlBtnsByKeys(this.mainMenuBtns, ['LOAD_GAME', 'START_NEW_GAME']);
    } else if (this.#isGameOver(playerObj)) {
      this.#controlBtnsByKeys(this.gameOverBtns, ['LOAD_GAME', 'START_NEW_GAME']);
    } else if (this.#state === "paused") {
      this.#controlBtnsByKeys(this.pauseMenuBtns, ['RESUME_GAME', 'EXIT_TO_MAIN_MENU']);
    }
  }

  #handleSceneProgress() {
    if (!keyIsDown(ENTER) && !keyIsDown(ESCAPE)) return;
    if (this.#isScenePage()) this.#playNextStoryLine();
    else if (this.#state === "completed" && keyIsDown(ENTER)) this.#transitionToEndScene();
  }

  #playNextStoryLine() {
    this.#scenePlayer.next();
    if (!this.#scenePlayer.isSceneComplete() && !keyIsDown(ESCAPE)) return;
  
    this.#scenePlayer.stopBGM();
    switch (this.#state) {
      case "startScene":
        this.#state = "inGame";
        startTime = millis();
        this.btnPause.show();
        break;
      case "endScene":
        this.eventBus.publish("EXIT_TO_MAIN_MENU");
        this.#state = "mainMenu";
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
    if (this.#state === "completed" || this.#isGameOver(playerObj)) {
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
    buttons[prevBtnIndex].removeClass('blink');
    this.btnIndex = 0;
    if (buttons[prevBtnIndex] === this.btnNewGame) this.#handleNewGame();
    this.eventBus.publish(eventTypes[prevBtnIndex]);
    if (buttons[prevBtnIndex] === this.btnNewGame) this.btnPause.hide();
  }

  #moveBetweenBtnsByKeys(buttons) {
    if (this.btnIndex === null) return;
    const direction = keyIsDown(DOWN_ARROW) ? 1 : -1;
    buttons[this.btnIndex].removeClass('blink');
    this.btnIndex = (this.btnIndex + direction + buttons.length) % buttons.length;
    buttons[this.btnIndex].class('blink');
    this.#helpBar.updateText(this.#state, this.btnIndex);
  }

  #isGameOver(playerObj) {
    if (this.#state !== "mainMenu" && playerObj.hp <= 0) {
      console.log("Game over..");
      this.#state = "gameOver";
      return true;
    }
    return false;
  }

  resizeBtns() {
    this.btnContinue.size(width / 6, AUTO);
    this.btnNewGame.size(width / 6, AUTO);
    this.btnResume.size(width / 6, AUTO);
    this.btnExit.size(width / 6, AUTO);
    this.btnLoadLastSave.size(width / 6, AUTO);
    this.btnRestart.size(width / 6, AUTO);
    this.btnPause.size(width / 20, AUTO);
  }
}
