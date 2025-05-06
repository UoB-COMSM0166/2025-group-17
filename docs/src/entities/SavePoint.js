class SavePoint {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = createVector(30, 30);
    this.image = savePointImg;
    this.checkedImg = checkedSavePointImg;
    this.isChecked = false;
  }

  display() {
    // Turn red once checked for each room
    if (this.isChecked) {
      image(this.checkedImg, this.position.x, this.position.y, this.size.x, this.size.y);
    } else {
      image(this.image, this.position.x, this.position.y, this.size.x, this.size.y);
    }
  };

  check() { this.isChecked = true; }
}

