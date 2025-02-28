class Obstacle {
  constructor(x, y) {
  this.position = createVector(x, y);
  this.size = createVector(heightInPixel / 12, heightInPixel / 12);
  }

  display() {
    fill(100);
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
}
