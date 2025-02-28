class SavePoint {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = createVector(savePointParam.w, savePointParam.h);
  }

  display() {
    fill('blue');
    noStroke();
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
  };
}