class HudDrawer {
  // TODO: Debug the class
  constructor(canvas, uiFont, heartImg, damagedHeartImg) {
    // Canvas properties
    this.cnv = canvas;
    this.widthInPixel = 1024;
    this.heightInPixel = 576;
    
    // UI properties
    this.hPadding = 50;
    this.vPadding = 20;
    this.uiFont = uiFont;
    this.uiTextSize = 20;
    this.heartImg = heartImg;
    this.damagedHeartImg = damagedHeartImg;
    
    // Constants
    this.BOSS_HP_WIDTH = 400;
    this.BOSS_HP_HEIGHT = 30;
    this.BOSS_HP_CORNER = 10;
    this.ICON_SIZE = 40;
    this.ICON_PADDING = 15;
  }

  adjustCanvasWithAspectRatio() {
    let cnvHeight, cnvWidth;
    // Calculate the max size that fits while keeping 16:9 aspect ratio
    if (windowWidth / windowHeight > 16 / 9) {
      cnvHeight = windowHeight;
      cnvWidth = round((16 / 9) * windowHeight);
    } else {
      cnvWidth = windowWidth;
      cnvHeight = round((9 / 16) * windowWidth);
    }

    resizeCanvas(this.cnv, cnvWidth, cnvHeight);

    // Centre the cnv
    this.cnv.position((windowWidth - cnvWidth) / 2, (windowHeight - cnvHeight) / 2);
    scale(cnvWidth / this.widthInPixel, cnvHeight / this.heightInPixel);
  }

  drawUiHub(playerObj, startTime, currentRoomIndex) {
    this.#drawHealthBar(playerObj);
    this.#drawCurrentLevel(currentRoomIndex);
    const timeSpent = millis() - startTime;
    this.#drawTimer(timeSpent);
  }

  #drawHealthBar(playerObj) {
    // Draw current HP
    for (let h = 0; h < playerObj.hp; h++) {
      image(
        this.heartImg,
        this.hPadding + h * (this.ICON_SIZE + this.ICON_PADDING),
        this.vPadding,
        this.ICON_SIZE,
        this.ICON_SIZE
      );
    }

    // Draw lost HP
    for (let dh = 0; dh < playerObj.maxHp - playerObj.hp; dh++) {
      image(
        this.damagedHeartImg,
        this.hPadding + (dh + playerObj.hp) * (this.ICON_SIZE + this.ICON_PADDING),
        this.vPadding,
        this.ICON_SIZE,
        this.ICON_SIZE
      );
    }
  }

  #drawCurrentLevel(currentRoomIndex) {
    fill(255);
    stroke(0);
    strokeWeight(5);
    textFont(this.uiFont, this.uiTextSize);
    textAlign(LEFT, BOTTOM);
    text(
      `Level: ${currentRoomIndex} / ${rooms.length}`,
      this.hPadding,
      this.heightInPixel - this.vPadding
    );
  }

  #drawBossHp(bossObj) {
    // TODO: Write corresponding logics and test
    const hpPercentage = bossObj.hp / bossObj.maxHp;
    const positionX = this.widthInPixel / 2 - this.BOSS_HP_WIDTH / 2;

    // Draw HP bar background
    stroke(0);
    strokeWeight(3);
    fill(230, 127); // 127 makes it 50% transparent
    rect(
      positionX,
      this.vPadding,
      this.BOSS_HP_WIDTH,
      this.BOSS_HP_HEIGHT,
      this.BOSS_HP_CORNER
    );

    // Draw HP bar
    noStroke();
    this.#adjustBossStatusColor(hpPercentage);
    const margin = 5;
    const barWidth = (this.BOSS_HP_WIDTH - margin * 2) * hpPercentage;
    rect(
      positionX + margin,
      this.vPadding + margin,
      barWidth,
      this.BOSS_HP_HEIGHT - margin * 2
    );
  }

  #adjustBossStatusColor(percentage) {
    if (percentage > 0.5) {
      fill('green');
    } else if (percentage > 0.25) {
      fill(255, 165, 0);
    } else {
      fill('red');
    }
  }

  #drawTimer(timeSpent) {
    let totalSecs = floor(timeSpent / 1000);
    let mins = floor(totalSecs/60);
    let secs = totalSecs % 60;

    fill(255);
    stroke(0);
    strokeWeight(5);
    textFont(this.uiFont, this.uiTextSize);
    textAlign(RIGHT, BOTTOM);
    text(
      `Time Taken:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
      this.widthInPixel - this.hPadding,
      this.heightInPixel - this.vPadding
    );
  }
}