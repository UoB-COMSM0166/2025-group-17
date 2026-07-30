const GAME_SAVE_KEY = 'outGameSave';
const GAME_SAVE_VERSION = 1;

class GameStateManager {
  #inputHandler;
  #isGameCompleted;
  #PageDrawer;
  #pauseTime;
  #timeSpent;
  #canvasScaleX;
  #canvasScaleY;
  #bgmCache;
  #loadingBGMPaths;
  #requestedBGMPath;

  // Manage which page and buttons to draw
  constructor(eventBus, PageDrawer, inputHandler) {
    this.#PageDrawer = PageDrawer;
    this.#inputHandler = inputHandler;
    this.#pauseTime = null;
    this.#isGameCompleted = false;
    this.#timeSpent = 0;
    this.#canvasScaleX = 1;
    this.#canvasScaleY = 1;
    this.#bgmCache = new Map();
    this.#loadingBGMPaths = new Set();
    this.#requestedBGMPath = null;

    // Current BGM reference + filter
    this.currentBGM = null;
    this.filter = new p5.LowPass();

    // room index -> BGM mapping (can be shared by multiple indices)
    this.roomBGMPaths = {
      0: 'assets/music/bgm/L1_Office.mp3',
      1: 'assets/music/bgm/L1_Office.mp3',
      2: 'assets/music/bgm/L1_Office.mp3',
      3: 'assets/music/bgm/L1_Office.mp3',
      4: 'assets/music/bgm/L2_Casino.mp3',
      5: 'assets/music/bgm/L2_Casino.mp3',
      6: 'assets/music/bgm/L2_Casino.mp3',
      7: 'assets/music/bgm/L3_Psycho.mp3',
    };

    eventBus.subscribe('LOAD_GAME', () => this.loadGameData());
    eventBus.subscribe('START_NEW_GAME', () => this.startNewGame());
    eventBus.subscribe('RESUME_GAME', () => this.resumeGame());
    eventBus.subscribe('EXIT_TO_MAIN_MENU', () => this.exitToMainMenu());
    eventBus.subscribe('PAUSE_GAME', () => this.pauseGame());
  }

  update() {
    scale(this.#canvasScaleX, this.#canvasScaleY);
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
      room.savePoint.check();
    }
  }
  
  #saveGameData() {
    if (room.savePoint.isChecked) return;

    const saveData = {
      version: GAME_SAVE_VERSION,
      savedAt: Date.now(),
      roomDataId: room.getRoomDataId(),
      player: {
        x: room.savePoint.position.x,
        y: room.savePoint.position.y,
        hp: player.getHp(),
        attack: player.getAtk(),
        bulletSize: player.getBulletSize(),
      },
      timeSpent: this.#timeSpent,
    };

    try {
      localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(saveData));
    } catch (error) {
      console.warn('Unable to save the game:', error);
    }
  }

  loadGameData() {
    const saveData = this.#readSaveData();
    if (!saveData) {
      this.#PageDrawer.setInGameState();
      return this.startNewGame();
    }

    this.#PageDrawer.setInGameState();
    this.#setupRoom(saveData.roomDataId);
    player.resetRoomState(
      saveData.player.hp,
      saveData.player.attack,
      saveData.player.bulletSize,
      saveData.player.x,
      saveData.player.y
    );
    startTime = millis() - saveData.timeSpent;

    this.#PageDrawer.toggleStartButtons();
    this.#PageDrawer.toggleGameOverButtons();
  }

  #readSaveData() {
    try {
      const storedSave = localStorage.getItem(GAME_SAVE_KEY);
      if (storedSave) {
        const parsedSave = JSON.parse(storedSave);
        if (this.#isValidSaveData(parsedSave)) return parsedSave;
      }

      const legacySave = this.#readLegacySaveData();
      if (this.#isValidSaveData(legacySave)) {
        localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(legacySave));
        return legacySave;
      }
    } catch (error) {
      console.warn('Ignoring invalid save data:', error);
    }
    return null;
  }

  #readLegacySaveData() {
    const legacyKeys = [
      'currentRoomDataId', 'lastSavePointX', 'lastSavePointY',
      'playerHp', 'playerAtk', 'playerBulletSize', 'timeSpent'
    ];
    const values = legacyKeys.map(key => localStorage.getItem(key));
    if (values.some(value => value === null)) return null;

    return {
      version: GAME_SAVE_VERSION,
      savedAt: Date.now(),
      roomDataId: Number(values[0]),
      player: {
        x: Number(values[1]),
        y: Number(values[2]),
        hp: Number(values[3]),
        attack: Number(values[4]),
        bulletSize: Number(values[5]),
      },
      timeSpent: Number(values[6]),
    };
  }

  #isValidSaveData(saveData) {
    if (!saveData || saveData.version !== GAME_SAVE_VERSION || !saveData.player) return false;
    const numericValues = [
      saveData.roomDataId, saveData.player.x, saveData.player.y,
      saveData.player.hp, saveData.player.attack,
      saveData.player.bulletSize, saveData.timeSpent
    ];
    return Number.isInteger(saveData.roomDataId)
      && Boolean(roomData[saveData.roomDataId])
      && numericValues.every(Number.isFinite)
      && saveData.player.hp >= 0
      && saveData.player.attack > 0
      && saveData.player.bulletSize > 0
      && saveData.timeSpent >= 0;
  }

  startNewGame() {
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
  }

  pauseGame() {
    this.#pauseTime = millis();

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
    this.#PageDrawer.drawMainMenu();
    this.#PageDrawer.showStartButtons();
    this.#PageDrawer.toggleGameOverButtons();

    this.#requestedBGMPath = null;
    this.playBGM(mainmenuSound, 'main-menu');
  }

  playMainmenuSound() {
    this.#requestedBGMPath = null;
    this.playBGM(mainmenuSound, 'main-menu');
  }

  playBGM(sound, key = sound) {
    try {
      if (this.currentBGMKey === key && this.currentBGM?.isPlaying()) return;
      if (this.currentBGM && this.currentBGM.isPlaying()) {
        this.currentBGM.stop();
      }

      this.currentBGM = sound;
      this.currentBGMKey = key;
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
    const currentPageState = this.#PageDrawer.getGameState();
    if (currentPageState !== "inGame") return; // If it's still in the plot, don't play the music
    const bgmPath = this.roomBGMPaths[index];
    if (!bgmPath) return;

    this.#requestedBGMPath = bgmPath;
    const cachedBGM = this.#bgmCache.get(bgmPath);
    if (cachedBGM) return this.playBGM(cachedBGM, bgmPath);
    if (this.#loadingBGMPaths.has(bgmPath)) return;

    this.#loadingBGMPaths.add(bgmPath);
    loadSound(
      bgmPath,
      sound => {
        this.#loadingBGMPaths.delete(bgmPath);
        this.#bgmCache.set(bgmPath, sound);
        if (
          this.#requestedBGMPath === bgmPath
          && this.#PageDrawer.getGameState() === 'inGame'
        ) {
          this.playBGM(sound, bgmPath);
        }
      },
      error => {
        this.#loadingBGMPaths.delete(bgmPath);
        console.warn(`Unable to load BGM: ${bgmPath}`, error);
      }
    );
  }

  stopBGM() {
    if (this.currentBGM && this.currentBGM.isPlaying()) {
      this.currentBGM.stop();
    }
    this.currentBGM = null;
    this.currentBGMKey = null;
  }

  // Set up room and play BGM
  #setupRoom(roomDataId) {
    room.setup(roomData[roomDataId]);
    this.playBGMForRoom(room.getCurrentRoomId());
  }

  resizeCanvasToWindow() {
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
    this.#canvasScaleX = cnvWidth / widthInPixel;
    this.#canvasScaleY = cnvHeight / heightInPixel;
  
    // Centre the cnv
    cnv.position((windowWidth - cnvWidth) / 2, (windowHeight - cnvHeight) / 2);
  }

  #resizeBtns() { this.#PageDrawer.resizeBtns(); }
}