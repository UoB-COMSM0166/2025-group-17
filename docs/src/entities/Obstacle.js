let obstacleSize = { w: 30, h: 30 };

class Obstacle {
  constructor(x, y) {
  this.position = createVector(x, y);
  this.size = createVector(obstacleSize.w, obstacleSize.h);
  }

  display() {
    fill(100);
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
}