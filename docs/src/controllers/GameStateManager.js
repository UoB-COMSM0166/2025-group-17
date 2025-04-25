class GameStateManager {
  #inputHandler;
  #isGameCompleted;

  // Manage which page and buttons to draw
  constructor(eventBus, pageDrawer, inputHandler) {
    this.pageDrawer = pageDrawer;
    this.#inputHandler = inputHandler;
    this.pauseTime = null;
    this.#isGameCompleted = false;

    // 当前BGM引用 + 滤波器
    this.currentBGM = null;
    this.filter = new p5.LowPass();

    // room index -> BGM 映射（可多个 index 共用）
    this.roomBGMs = {
      0: L1_OfficeSound,
      1: L3_PsychoSound,
      2: L1_OfficeSound,
      3: L1_OfficeSound,
      4: L3_PsychoSound,
      5: L3_PsychoSound,
    };

    eventBus.subscribe('LOAD_GAME', () => this.loadGameData());
    eventBus.subscribe('START_NEW_GAME', () => this.startNewGame());
    eventBus.subscribe('RESUME_GAME', () => this.resumeGame());
    eventBus.subscribe('EXIT_TO_MAIN_MENU', () => this.exitToMainMenu());
    eventBus.subscribe('PAUSE_GAME', () => this.pauseGame());
  }

  update() {
    this.playBGMForRoom(this.#inputHandler.getCurrentRoomId());
    this.pageDrawer.updatePauseBtnPosition();
    this.#inputHandler.update(player);
    player.healByTime(timeSpent);
  
    drawUiHud(player, this.#inputHandler.getCurrentRoomId());
    checkSavePoint();
    this.#isGameCompleted = this.#inputHandler.isGameCompleted();
    if (this.#isGameCompleted === true) {
      this.pageDrawer.setCompletedState();
      this.stopBGM();
    }
  }

  handlePlayerShooting() {
    this.pageDrawer.handleBtnPressed(player);
    if (!this.pageDrawer.shouldRenderMenu(player)) {
      this.#inputHandler.handlePlayerShooting(player);
    }
  }

  shouldRenderMenu() {
    if (this.pageDrawer.shouldRenderMenu(player)) {
      this.pageDrawer.renderMenu(player, timeSpent);
      return true;
    }
    return false;
  }

  loadGameData() {
    const savedRoomDataId = localStorage.getItem('currentRoomDataId');
    if (savedRoomDataId) {
      this.pageDrawer.setInGameState();
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

    this.pageDrawer.toggleStartButtons();
    this.pageDrawer.toggleGameOverButtons();
  }

  startNewGame() {
    console.log("New Game Start!");
    this.#resetGame();
    this.pageDrawer.toggleResumeButtons();
    this.pageDrawer.toggleStartButtons();
    this.pageDrawer.toggleGameOverButtons();
    this.stopBGM(); // 确保此时停止任何主菜单 BGM
  }

  #resetGame() {
    player = new Player(playerX, playerY);
    this.#setupRoom(0); // reset to the initial room from first room in JSON data
    this.#inputHandler = new InputHandler(room);
    console.log("Game is reset!");
  }

  pauseGame() {
    this.pauseTime = millis();
    console.log("Game pause!");

    if (pauseSound) pauseSound.play();
    this.pageDrawer.showResumeButtons();

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
    this.pageDrawer.toggleResumeButtons();
    this.pageDrawer.setInGameState();
    startTime += millis() - this.pauseTime;

    // 移除滤波器
    if (this.currentBGM) {
      this.currentBGM.setVolume(0.5);
      this.currentBGM.disconnect();
      this.currentBGM.connect(); // reconnect to master output
    }
  }

  exitToMainMenu() {
    console.log("Exit to the main menu!");
    this.pageDrawer.drawMainMenu();
    this.pageDrawer.showStartButtons();
    this.pageDrawer.toggleGameOverButtons();

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
    console.log(this.pageDrawer.getGameState());
    const currentPageState = this.pageDrawer.getGameState();
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
    room.setup(rooms[roomDataId]);
    this.playBGMForRoom(room.getCurrentRoomId());
  }

  resizeBtns() { this.pageDrawer.resizeBtns(); }
}