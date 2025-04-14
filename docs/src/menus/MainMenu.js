class MainMenu extends BaseMenu {
  #btnContinue = null;
  #btnNewGame = null;

  _setup() {
    // this.#btnContinue = this._createButton('assets/buttons/Continue.png', 'Continue', -1.1, );
    // this.#btnNewGame = this._createButton('assets/buttons/NewGame.png', 'New Game', 1.1, );
  }

  draw() {
    image(startMenuImg, 0, 0, widthInPixel, heightInPixel);
    this.#btnContinue?.class('blink');
  }

  show() {
    this._getButtons().forEach(btn => btn.show());
  }

  hide() {
    this._getButtons().forEach(btn => btn.hide());
  }
}