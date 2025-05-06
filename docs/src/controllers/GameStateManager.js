class GameStateManager {
  #inputHandler;
  #isGameCompleted;
  #PageDrawer;
  #pauseTime;
  #timeSpent;

  // Manage which page and buttons to draw
  constructor(eventBus, PageDrawer, inputHandler) {
    this.#PageDrawer = PageDrawer;
    this.#inputHandler = inputHandler;
    this.#pauseTime = null;
    this.#isGameCompleted = false;
    this.#timeSpent = 0;

    // Current BGM reference + filter
    this.currentBGM = null;
    this.filter = new p5.LowPass();

    // room index -> BGM mapping (can be shared by multiple indices)
    this.roomBGMs = {
      0: L1_OfficeSound,
      1: L1_OfficeSound,
      2: L1_OfficeSound,
      3: L1_OfficeSound,
      4: L2_CasinoSound,
      5: L2_CasinoSound,
      6: L2_CasinoSound,
      7: L3_PsychoSound,
    };

    eventBus.subscribe('LOAD_GAME', () => this.loadGameData());
    eventBus.subscribe('START_NEW_GAME', () => this.startNewGame());
    eventBus.subscribe('RESUME_GAME', () => this.resumeGame());
    eventBus.subscribe('EXIT_TO_MAIN_MENU', () => this.exitToMainMenu());
    eventBus.subscribe('PAUSE_GAME', () => this.pauseGame());
  }

  update() {
    this.#adjustCanvasWithAspectRatio();
    if (!this.#isGameCompleted) this.#timeSpent = millis() - startTime;
    if (this.#shouldRenderMenu()) return;

    const currentLevelId = this.#inputHandler.getCurrentLevelId();
    const currentRoomNo = this.#inputHandler.getCurrentRoomNo();
    this.playBGMForRoom(this.#inputHandler.getCurrentRoomId());
    this.#PageDrawer.updatePauseBtnPosition();
    this.#inputHandler.update(player);

    PlayerStatusDisplayer.display(
      player, currentLevelId, currentRoomNo, this.#timeSpent, heartImg, damagedHeartImg, uiFont
    );
    this.#checkSavePoint();
    this.#isGameCompleted = this.#inputHandler.isGameCompleted();
    if (this.#isGameCompleted === true) {
      this.#PageDrawer.setCompletedState();
      this.stopBGM();
    }
  }

  handlePlayerShooting() {
    this.#PageDrawer.handleBtnPressed(player);
    if (!this.#PageDrawer.shouldRenderMenu(player)) {
      this.#inputHandler.handlePlayerShooting(player);
    }
  }

  #shouldRenderMenu() {
    if (this.#PageDrawer.shouldRenderMenu(player)) {
      this.#PageDrawer.renderMenu(player, this.#timeSpent);
      return true;
    }
    return false;
  }

  #checkSavePoint() {
    // Save when player crosses the target position
    const nearSavePoint = player.position.x < room.savePoint.position.x + room.savePoint.size.x &&
    player.position.x + player.size.x > room.savePoint.position.x &&
    player.position.y < room.savePoint.position.y + room.savePoint.size.y &&
    player.position.y + player.size.y > room.savePoint.position.y;
    if (!room.savePoint.isChecked && nearSavePoint) {
      this.#saveGameData();
      room.savePoint.checked();
    }
  }
  
  #saveGameData() {
    if (room.savePoint.isChecked) return;
    console.log("Can be saved again!");
  
    localStorage.setItem('currentRoomDataId', room.getRoomDataId());
    localStorage.setItem('lastSavePointX', JSON.stringify(room.savePoint.position.x));
    localStorage.setItem('lastSavePointY', JSON.stringify(room.savePoint.position.y));
    localStorage.setItem('playerHp', JSON.stringify(player.getHp()));
    localStorage.setItem('playerAtk', JSON.stringify(player.getAtk()));
    localStorage.setItem('playerBulletSize', JSON.stringify(player.getBulletSize()));
    localStorage.setItem('timeSpent', JSON.stringify(this.#timeSpent));
    console.log("Game Saved!");
  }

  loadGameData() {
    const savedRoomDataId = localStorage.getItem('currentRoomDataId');
    if (savedRoomDataId) {
      this.#PageDrawer.setInGameState();
      this.#setupRoom(parseInt(savedRoomDataId));
    }

    const savedXData = localStorage.getItem('lastSavePointX');
    const savedYData = localStorage.getItem('lastSavePointY');
    const savedHp = localStorage.getItem('playerHp');
    const savedAtk = localStorage.getItem('playerAtk');
    const savedBulletSize = localStorage.getItem('playerBulletSize');
    const savedTimeSpent = localStorage.getItem('timeSpent');
    if (!savedXData || !savedYData || !savedHp || !savedAtk || !savedBulletSize || !savedTimeSpent) {
      console.log("Parts of save data missing; starting from scratch...");
      return this.startNewGame();
    }

    const savedPositionX = JSON.parse(savedXData);
    const savedPositionY = JSON.parse(savedYData);
    player.resetRoomState(JSON.parse(savedHp), JSON.parse(savedAtk), JSON.parse(savedBulletSize), savedPositionX, savedPositionY);
    startTime = millis() - JSON.parse(savedTimeSpent);
    console.log("Game Loaded!");

    this.#PageDrawer.toggleStartButtons();
    this.#PageDrawer.toggleGameOverButtons();
  }

  startNewGame() {
    console.log("New Game Start!");
    this.#resetGame();
    this.#PageDrawer.toggleResumeButtons();
    this.#PageDrawer.toggleStartButtons();
    this.#PageDrawer.toggleGameOverButtons();
    this.stopBGM(); // Make sure to stop any main menu BGM at this time
  }

  #resetGame() {
    player = new Player();
    this.#setupRoom(0); // reset to the initial room from first room in JSON data
    this.#inputHandler = new InputHandler(room);
    console.log("Game is reset!");
  }

  pauseGame() {
    this.#pauseTime = millis();
    console.log("Game pause!");

    if (btnSound) btnSound.play();
    this.#PageDrawer.showResumeButtons();

    // Add a filter (telephone sound effect)
    if (this.currentBGM) {
      this.currentBGM.setVolume(0.3);
      this.currentBGM.disconnect();
      this.currentBGM.connect(this.filter);
      this.filter.freq(800);
      this.filter.res(15);
    }
  }

  resumeGame() {
    console.log("Game resume!");
    this.#PageDrawer.toggleResumeButtons();
    this.#PageDrawer.setInGameState();
    startTime += millis() - this.#pauseTime;

    // Remove the filter
    if (this.currentBGM) {
      this.currentBGM.setVolume(0.5);
      this.currentBGM.disconnect();
      this.currentBGM.connect(); // reconnect to master output
    }
  }

  exitToMainMenu() {
    console.log("Exit to the main menu!");
    this.#PageDrawer.drawMainMenu();
    this.#PageDrawer.showStartButtons();
    this.#PageDrawer.toggleGameOverButtons();

    this.playBGM(mainmenuSound); // Return to the main menu and play the music on the main interface
  }

  playMainmenuSound() { this.playBGM(mainmenuSound); }

  playBGM(sound) {
    try {
      if (this.currentBGM && this.currentBGM.isPlaying()) {
        this.currentBGM.stop();
      }

      this.currentBGM = sound;
      if (this.currentBGM) {
        this.currentBGM.disconnect(); // Clear the old connection
        this.currentBGM.connect();    // Reconnect the main output
        this.currentBGM.setLoop(true);
        this.currentBGM.setVolume(0.5);
        this.currentBGM.play();
      }
    } catch (err) {
      console.warn("音频播放失败：", err);
    }
  }

  playBGMForRoom(index) {
    console.log(this.#PageDrawer.getGameState());
    const currentPageState = this.#PageDrawer.getGameState();
    if (currentPageState !== "inGame") return; // If it's still in the plot, don't play the music
    const nextBGM = this.roomBGMs[index];
  
    if (this.currentBGM === nextBGM && this.currentBGM?.isPlaying()) return;
  
    this.stopBGM();
    this.currentBGM = nextBGM;
  
    if (this.currentBGM) {
      this.currentBGM.disconnect();
      this.currentBGM.connect();
      this.currentBGM.setLoop(true);
      this.currentBGM.setVolume(0.5);
      this.currentBGM.play();
    }
  }

  stopBGM() {
    if (this.currentBGM && this.currentBGM.isPlaying()) {
      this.currentBGM.stop();
      this.currentBGM = null;
    }
  }

  // Set up room and play BGM
  #setupRoom(roomDataId) {
    room.setup(roomData[roomDataId]);
    this.playBGMForRoom(room.getCurrentRoomId());
  }

  #adjustCanvasWithAspectRatio() {
    let cnvHeight, cnvWidth;
    // Calculate the max size that fits while keeping 16:9 aspect ratio
    if (windowWidth / windowHeight > 16 / 9) {
      cnvHeight = windowHeight;
      cnvWidth = round((16 / 9) * windowHeight);
    } else {
      cnvWidth = windowWidth;
      cnvHeight = round((9 / 16) * windowWidth);
    }
  
    resizeCanvas(cnvWidth, cnvHeight);
    this.#resizeBtns();
  
    // Centre the cnv
    cnv.position((windowWidth - cnvWidth) / 2, (windowHeight - cnvHeight) / 2);
    scale(cnvWidth / widthInPixel, cnvHeight / heightInPixel);
  }

  #resizeBtns() { this.#PageDrawer.resizeBtns(); }
}