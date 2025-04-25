class HelpBar {
  #visible;
  #height;
  #opacity;
  #btnOpacity;
  #animation;
  #stateMap;
  #currentState;
  #currentBtnIdx;
  #pages;

  constructor(jsonData) {
    this.#visible = true;
    this.#height = 50;
    this.#opacity = 180;
    this.#btnOpacity = 150;
    this.#animation = { y: 0, targetY: 0, easing: 0.2, duration: 150 };
    this.#pages = []; // Will be populated from JSON
    this.#stateMap = {}; // Maps states to page indices
    this.#currentState = "mainMenu";
    this.#currentBtnIdx = 0;
    this.#pages = jsonData.pages;

    // Create a mapping from state to page index
    this.#pages.forEach((page, index) => { this.#stateMap[page.state] = index; });
    this.#animation.y = heightInPixel;
    this.#animation.targetY = heightInPixel - this.#height;
  }

  update(currentState, currentBtnIdx = 0) {
    this.#updateAnimation();
    if (!this.#visible) return;
    if (currentBtnIdx === null) return;
    if (this.#currentState !== currentState || this.#currentBtnIdx !== currentBtnIdx) {
      this.updateText(currentState, currentBtnIdx);
    }
    this.#draw(this.#currentState, this.#currentBtnIdx);
  }

  updateText(currentState, currentBtnIdx = 0) {
    this.#visible = false;
    this.#currentState = currentState;
    this.#currentBtnIdx = currentBtnIdx;
    setTimeout(() => { this.#visible = true; }, this.#animation.duration);
  }

  #updateAnimation() {
    let anim = this.#animation;
    anim.targetY = this.#visible ? heightInPixel - this.#height : heightInPixel;
    anim.y += (anim.targetY - anim.y) * anim.easing;
  }

  #draw(currentState, btnIndex = 0) {
    rectMode(CORNER);
    // Get current page content based on state
    const pageIndex = this.#stateMap[currentState];
    const currentPage = this.#pages[pageIndex];
    
    // Draw background bar
    fill(0, 0, 0, this.#opacity);
    noStroke();
    rect(0, this.#animation.y, widthInPixel, this.#height);
    
    // Draw top edge highlight
    fill(255, 255, 255, this.#btnOpacity);
    rect(0, this.#animation.y, widthInPixel, 1);
    
    const textY = this.#animation.y + 20;
    const padding = 30;
    
    // Draw help text if available
    let helpText = "";
    if (currentPage.text_btn0 !== undefined && currentPage.text_btn1 !== undefined) {
      helpText = btnIndex === 0 ? currentPage.text_btn0 : currentPage.text_btn1;
    }
    if (helpText) this.#drawText(helpText, padding, textY, LEFT, 14, 220);
    
    // Draw key buttons and descriptions
    if (currentPage.keys) this.#drawKeyButtons(textY, padding, currentPage.keys);
  }  
  
  #drawKeyButtons(textY, padding, keys) {
    let currentItemX = widthInPixel;
    
    keys.forEach(item => {
      currentItemX -= textWidth(item.key) * 2 + textWidth(item.action) + padding;
      const endX = this.#drawKey(item.key, currentItemX, textY);
      this.#drawText(item.action, endX, textY, LEFT, 14, 200, " ");
    });
  }

  #drawKey(keyString, x, y) {
    let currentX = x;
    const charWidth = textWidth(keyString.charAt(0));
    const padding = 0.15 * charWidth;
    noStroke();
    fill(255);  

    for (let j = 0; j < keyString.length; j++) {
      const char = keyString.charAt(j);
      if (["↑", "↓", "↵"].includes(char)) {
        textAlign(LEFT, CENTER);
        currentX = this.#drawSpecialCharacter(char, currentX, y, charWidth, padding);
        if (j === keyString.length - 1) currentX -= padding * 1.25;
      } else {
        currentX = this.#drawRegularCharacter(char, currentX, y);
      }
    }
    if (this.#containsRegularCharacters(keyString)) {
      currentX = this.#drawTextBackground(x, y, currentX, charWidth, padding);
    }
    return currentX;
  }

  #drawSpecialCharacter(char, x, y, charWidth, padding) {
    textFont('monospace', 14);
    this.#drawButtonBackground(x, y - 1.2 * charWidth, charWidth * 2.4, charWidth * 2);
    text(char, x + 0.75 * charWidth, y - padding);
    
    let newX = x + charWidth * 2.6;
    return newX;
  }

  #drawRegularCharacter(char, x, y) {
    textFont('monospace', 12);
    text(char, x, y);
    return x + textWidth(char);
  }

  #containsRegularCharacters(keyString) {
    for (let char of keyString) {
      if (!["↑", "↓", "↵"].includes(char)) return true;
    }
    return false;
  }

  #drawTextBackground(startX, y, currentX, charWidth, padding) {
    this.#drawButtonBackground(
      startX - 2 * padding,
      y - 1.2 * charWidth,
      (currentX - startX) * 1.25,
      charWidth * 2
    );
    return currentX + padding * 1.25;
  }

  #drawButtonBackground(x, y, width, height) {
    strokeWeight(1);
    stroke(255, this.#btnOpacity);
    fill(255, this.#btnOpacity);
    rect(x, y, width, height, 4);
  }

  #drawText(textContent, x, y, align = LEFT, size, color = 255, prefix = "") {
    fill(color);
    noStroke();
    textFont('monospace', size);
    textAlign(align, CENTER);
    text(prefix + textContent, x, y);
  }
}
