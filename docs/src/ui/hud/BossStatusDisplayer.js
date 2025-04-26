class BossStatusDisplayer {
  static #vPadding = 20;
  static #hpBarOffsetX = 40; // x Offset of HP relative to HP bar
  static #hpBarOffsetY = 10; // y Offset of HP relative to HP bar

  static display(bossObj, bossHpBarImg, bossHpImg) {
    push();
    this.#preprocessImages(bossHpBarImg, bossHpImg);
    
    const positionX = this.#calculateBarPositionX(bossHpBarImg);
    const hpPercentageImg = this.#createHpPercentageImage(bossObj, bossHpImg);
    
    this.#drawHpBackground(bossHpImg, positionX);
    this.#applyHitEffects(bossObj);
    this.#drawCurrentHp(hpPercentageImg, positionX);
    this.#drawHpBar(bossHpBarImg, positionX);
    
    pop();
  }

  static #preprocessImages(bossHpBarImg, bossHpImg) {
    bossHpBarImg.loadPixels();
    bossHpImg.loadPixels();
  }

  static #calculateBarPositionX(bossHpBarImg) {
    return widthInPixel / 2 - bossHpBarImg.width / 2;
  }

  static #createHpPercentageImage(bossObj, bossHpImg) {
    const hpPercentage = bossObj.hp / bossObj.maxHp;
    const currentHpWidth = Math.floor(bossHpImg.width * hpPercentage);
    
    let hpPercentageImg = createImage(bossHpImg.width, bossHpImg.height);
    hpPercentageImg.copy(
      bossHpImg, 
      0, 0, currentHpWidth, bossHpImg.height,
      0, 0, currentHpWidth, bossHpImg.height
    );
    return hpPercentageImg;
  }

  static #drawHpBackground(bossHpImg, positionX) {
    tint(127);
    image(bossHpImg, positionX + this.#hpBarOffsetX, this.#vPadding + this.#hpBarOffsetY);
    noTint();
  }

  static #applyHitEffects(bossObj) {
    const flashFrame = 21;
    bossObj.applyHitEffect(flashFrame);
  }

  static #drawCurrentHp(hpPercentageImg, positionX) {
    image(hpPercentageImg, positionX + this.#hpBarOffsetX, this.#vPadding + this.#hpBarOffsetY);
  }

  static #drawHpBar(bossHpBarImg, positionX) {
    noTint();
    image(bossHpBarImg, positionX, this.#vPadding);
  }
}