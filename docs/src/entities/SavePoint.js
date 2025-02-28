class SavePoint {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = savePointSize;
    this.size = createVector(savePointSize.w, savePointSize.h);
  }

  display() {
    fill('blue');
    noStroke();
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
  };
}