class SavePoint {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = createVector(savePointParam.w, savePointParam.h);
    this.image = savePointImg;
  }

  display() {
    noStroke();
    image(this.image, this.position.x, this.position.y, this.size.x, this.size.y);
  };
}