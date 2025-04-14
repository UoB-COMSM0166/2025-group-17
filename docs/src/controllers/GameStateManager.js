class GameStateManager {
  // Manage which page and buttons to draw
  constructor(eventBus, pageDrawer) {
    this.pageDrawer = pageDrawer;
    this.pauseTime = null;
    eventBus.subscribe('LOAD_GAME', () => this.loadGameData());
    eventBus.subscribe('START_NEW_GAME', () => this.startNewGame());
    eventBus.subscribe('RESUME_GAME', () => this.resumeGame());
    eventBus.subscribe('EXIT_TO_MAIN_MENU', () => this.exitToMainMenu());
    eventBus.subscribe('PAUSE_GAME', () => this.pauseGame());
  }

  loadGameData() {
    nearSavedPosition = true;
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
    this.pageDrawer.toggleGameOverButtons();
  }

  startNewGame() {
    console.log("New Game Start!");
    this.#resetGame();
    this.pageDrawer.toggleResumeButtons();
    this.pageDrawer.toggleStartButtons();
    this.pageDrawer.toggleGameOverButtons();
  }

  #resetGame() {
    isGameCompleted = false;
    currentRoomIndex = 0;
  
    player = new Player(playerX, playerY);
    room.setup(rooms[currentRoomIndex]); // reset to the initial room
    inputHandler = new InputHandler(room);
    console.log("Game is reset!")
  }

  pauseGame() {
    this.pauseTime = millis();
    console.log("Game pause!");
  
    if (pauseSound) pauseSound.play();
    this.pageDrawer.showResumeButtons();
  }
  
  resumeGame() {
    console.log("Game resume!");
    this.pageDrawer.toggleResumeButtons();
    startTime += millis() - this.pauseTime;
  }
  
  exitToMainMenu() {
    console.log("Exit to the main menu!")
    isGameCompleted = false;
    this.pageDrawer.drawMainMenu();
    this.pageDrawer.showStartButtons();
    this.pageDrawer.toggleGameOverButtons();
  }
}