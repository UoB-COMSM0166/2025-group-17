class GameStateManager {
  // Manage which page and buttons to draw
  constructor(eventBus, pageDrawer) {
    this.pageDrawer = pageDrawer;
    this.pauseTime = null;

    // 当前BGM引用 + 滤波器
    this.currentBGM = null;
    this.filter = new p5.LowPass();

    this.delayBGM = false; // 控制是否延迟播放房间 BGM（用于剧情未播完时）

    // room index -> BGM 映射（可多个 index 共用）
    this.roomBGMs = {
      0: L1_OfficeSound,
      1: L1_OfficeSound,
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

  loadGameData() {
    const savedRoomIndex = localStorage.getItem('currentRoomIndex');
    if (savedRoomIndex) currentRoomIndex = parseInt(savedRoomIndex);
    room.setup(rooms[currentRoomIndex]);

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
    inputHandler.lastLoadTime = millis();
    player.resetInvincibleTimer();
    console.log("Game Loaded!");

    this.pageDrawer.toggleStartButtons();
    this.pageDrawer.setInGameState();
    this.pageDrawer.toggleGameOverButtons();

    this.delayBGM = false; // 直接进入游戏，播放 BGM
    this.playBGMForRoom(currentRoomIndex);
  }

  startNewGame() {
    console.log("New Game Start!");
    this.#resetGame();
    this.pageDrawer.toggleResumeButtons();
    this.pageDrawer.toggleStartButtons();
    this.pageDrawer.toggleGameOverButtons();

    this.delayBGM = true; // 延迟播放，等待剧情结束时再调用 playBGMForRoom()
    this.stopBGM(); // 确保此时停止任何主菜单 BGM
  }

  #resetGame() {
    isGameCompleted = false;
    currentRoomIndex = 0;

    player = new Player(playerX, playerY);
    room.setup(rooms[currentRoomIndex]); // reset to the initial room
    inputHandler = new InputHandler(room);
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

    // 恢复房间 BGM（主菜单音乐如果还在播要被切掉）
    this.delayBGM = false;
    this.playBGMForRoom(currentRoomIndex);
  }

  exitToMainMenu() {
    console.log("Exit to the main menu!");
    isGameCompleted = false;
    this.pageDrawer.drawMainMenu();
    this.pageDrawer.showStartButtons();
    this.pageDrawer.toggleGameOverButtons();

    this.delayBGM = false;
    this.playBGM(mainmenuSound); // 返回主菜单播放主界面音乐
  }

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
    if (this.delayBGM) return; // 如果还在剧情，就不播放音乐
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
}
