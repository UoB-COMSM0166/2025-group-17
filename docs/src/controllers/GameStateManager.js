class GameStateManager {
  #inputHandler;
  #isGameCompleted;
  #PageDrawer;
  #pauseTime;

  // Manage which page and buttons to draw
  constructor(eventBus, PageDrawer, inputHandler) {
    this.#PageDrawer = PageDrawer;
    this.#inputHandler = inputHandler;
    this.#pauseTime = null;
    this.#isGameCompleted = false;

    // 当前BGM引用 + 滤波器
    this.currentBGM = null;
    this.filter = new p5.LowPass();

    // room index -> BGM 映射（可多个 index 共用）
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
    if (this.#shouldRenderMenu()) return;

    const currentRoomId = this.#inputHandler.getCurrentRoomId();
    this.playBGMForRoom(this.#inputHandler.getCurrentRoomId());
    this.#PageDrawer.updatePauseBtnPosition();
    this.#inputHandler.update(player);
    player.healByTime(timeSpent);

    PlayerStatusDisplayer.display(player, currentRoomId, startTime, heartImg, damagedHeartImg, uiFont);
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
      this.#PageDrawer.renderMenu(player, timeSpent);
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
    localStorage.setItem('playerHp', JSON.stringify(player.hp));
    localStorage.setItem('timeSpent', JSON.stringify(timeSpent));
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
    const savedPlayerHp = localStorage.getItem('playerHp');
    const savedTimeSpent = localStorage.getItem('timeSpent');
    if (!savedXData || !savedYData || !savedPlayerHp || !savedTimeSpent) {
      console.log("Parts of save data missing; starting from scratch...");
      return this.startNewGame();
    }

    const savedPositionX = JSON.parse(savedXData);
    const savedPositionY = JSON.parse(savedYData);
    const savedPosition = new SavePoint(savedPositionX, savedPositionY);
    player.position.x = savedPosition.position.x;
    player.position.y = savedPosition.position.y;
    player.hp = JSON.parse(savedPlayerHp);
    startTime = millis() - JSON.parse(savedTimeSpent);
    this.#inputHandler.lastLoadTime = millis();
    player.resetInvincibleTimer();
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
    this.stopBGM(); // 确保此时停止任何主菜单 BGM
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

    if (pauseSound) pauseSound.play();
    this.#PageDrawer.showResumeButtons();

    // 添加滤波器（电话音效）
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

    // 移除滤波器
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

    this.playBGM(mainmenuSound); // 返回主菜单播放主界面音乐
  }

  playMainmenuSound() { this.playBGM(mainmenuSound); }

  playBGM(sound) {
    try {
      if (this.currentBGM && this.currentBGM.isPlaying()) {
        this.currentBGM.stop();
      }

      this.currentBGM = sound;
      if (this.currentBGM) {
        this.currentBGM.disconnect(); // 清除旧连接
        this.currentBGM.connect();    // 重新连接主输出
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
    if (currentPageState !== "inGame") return; // 如果还在剧情，就不播放音乐
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