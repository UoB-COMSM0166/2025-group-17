class GameOverMenu extends BaseMenu {
  constructor() {
    super();
    this.btnLoadLastSave = null;
    this.btnRestart = null;
    this.setup();
  }
  #btnLoadLastSave = null;
  #btnRestart = null;

  _setup() {
  }
}