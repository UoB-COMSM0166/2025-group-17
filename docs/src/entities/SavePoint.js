class SavePoint {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = createVector(savePointParam.w, savePointParam.h);
    this.image = savePointImg;
    this.checkedImg = checkedSavePointImg;
    this.lastSaveTime = 0;
    this.isChecked = false;
  }

  display() {
    // Turn red once checked, and back to unchecked after 1 second
    if (this.isChecked && (millis() - this.lastSaveTime < 1000)) {
      image(this.checkedImg, this.position.x, this.position.y, this.size.x, this.size.y);
    } else {
      this.isChecked = false;
      image(this.image, this.position.x, this.position.y, this.size.x, this.size.y);
    }
  };

  checked() {
    this.isChecked = true;
    this.lastSaveTime = millis();
  }
}