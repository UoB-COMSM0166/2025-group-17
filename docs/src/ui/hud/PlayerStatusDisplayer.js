class PlayerStatusDisplayer {
  static #iconSize = 40;
  static #iconPadding = 15;
  static #hPadding = 20;
  static #vPadding = 20;
  static #uiTextSize = 24;

  static display(playerObj, currentlevelId, currentRoomNo, timeSpent, heartImg, damagedHeartImg, uiFont) {
    push();
    this.#drawHealthBar(playerObj, heartImg, damagedHeartImg);
    this.#drawCurrentLevel(currentlevelId, currentRoomNo, uiFont);
    this.#drawTimer(timeSpent, uiFont);
    pop();
  }

  static #drawHealthBar(playerObj, heartImg, damagedHeartImg) {
    // Draw current HP
    for (let h = 0; h < playerObj.hp; h++) {
      image(
        heartImg, 
        this.#hPadding + h * (this.#iconSize + this.#iconPadding), 
        this.#vPadding, 
        this.#iconSize, 
        this.#iconSize
      );
    }

    // Draw lost HP
    for (let dh = 0; dh < playerObj.maxHp - playerObj.hp; dh++) {
      image(
        damagedHeartImg, 
        this.#hPadding + (dh + playerObj.hp) * (this.#iconSize + this.#iconPadding), 
        this.#vPadding, 
        this.#iconSize, 
        this.#iconSize
      );
    }
  }

  static #drawCurrentLevel(currentlevelId, currentRoomNo, uiFont) {
    fill(255);
    stroke(0);
    strokeWeight(5);
    textFont(uiFont, this.#uiTextSize);
    textAlign(LEFT, BOTTOM);
    let levelText = "";
    if (currentlevelId === 0 && currentRoomNo === 0) levelText = "Tutorial";
    else levelText = `${currentlevelId} - ${currentRoomNo}`
    text(
      `Level: ${levelText}`,
      this.#hPadding, 
      heightInPixel - this.#vPadding
    );
  }

  static #drawTimer(timeSpent, uiFont) {
    const totalSecs = floor(timeSpent / 1000);
    const mins = floor(totalSecs / 60);
    const secs = totalSecs % 60;

    fill(255);
    stroke(0);
    strokeWeight(5);
    textFont(uiFont, this.#uiTextSize);
    textAlign(RIGHT, BOTTOM);
    text(
      `Time Taken:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`, 
      widthInPixel - this.#hPadding, 
      heightInPixel - this.#vPadding
    );
  }
}
