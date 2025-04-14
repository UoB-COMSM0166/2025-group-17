class BaseMenu {
  // TODO: separate parts of MenuDrawer into menu classes
  #btnIndex = 0;
  #buttons = [];

  constructor() {
    this._setup();
  }

  // Use _ to represent protected method
  _setup() {
    throw new Error('Subclass must implement _setup');
  }

  _createButton(imgPath, label, yOffset, callback, hidden = false) {
    const btnHeight = 48;
    const btnWidth = 4 * btnHeight;
    const btn = createImg(imgPath, label);
    
    btn.style('background-color', '#AFDDC9');
    btn.size(btnWidth, btnHeight);
    this.#positionButton(btn, yOffset);
    
    btn.mouseClicked(() => {
      callback();
      this.#resetButtonIndex();
    });
    
    btn.mouseOver(() => btn.class('blink'));
    btn.mouseOut(() => {
      btn.removeClass('blink');
      this.#resetButtonIndex();
    });
    
    if (hidden) btn.hide();
    this.#buttons.push(btn);
    return btn;
  }

  #positionButton(btn, yOffset) {
    btn.position(windowWidth / 2 - btn.width / 2, windowHeight / 2 + yOffset * btn.height / 2);
  }

  #resetButtonIndex() { this.#btnIndex = 0; }

  _drawTitle(title) {
    fill(255);
    stroke(0);
    strokeWeight(5);
    textSize(uiTextSize);
    textAlign(CENTER, CENTER);
    text(title, widthInPixel / 2, heightInPixel / 3);
  }

  _handleKeyControls(functions) {
    if (keyIsDown(ENTER)) this.#pressButton(functions);
    if (keyIsDown(DOWN_ARROW) || keyIsDown(UP_ARROW)) this.#moveBetweenButtons();
  }

  #pressButton(functions) {
    const prevIndex = this.#btnIndex;
    this.#buttons[prevIndex]?.removeClass('blink');
    this.#resetButtonIndex();
    functions[prevIndex]?.();
  }

  #moveBetweenButtons() {
    const direction = keyIsDown(DOWN_ARROW) ? 1 : -1;
    this.#buttons[this.#btnIndex]?.removeClass('blink');
    this.#btnIndex = (this.#btnIndex + direction + this.#buttons.length) % this.#buttons.length;
    this.#buttons[this.#btnIndex]?.class('blink');
  }

  _getButtons() {
    return this.#buttons;
  }
}
