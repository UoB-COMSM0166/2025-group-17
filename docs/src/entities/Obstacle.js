class Obstacle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = createVector(heightInPixel / 12, heightInPixel / 12);
    //randomly choose an image from the loaded obstacle images
    this.image = random(obstacleImages);

  }

  display() {
    //Draw the obstacle image at its position
    //imageMode(CORNER);
    image(this.image, this.position.x, this.position.y, this.size.x, this.size.y);
  }
}
