class Obstacle {
  constructor(x, y, obImage) {
    this.position = createVector(x, y);
    this.size = createVector(heightInPixel / 12, heightInPixel / 12);
    //randomly choose an image from the loaded obstacle images
    this.image = obImage;

  }

  display() {
    image(this.image, this.position.x, this.position.y, this.size.x, this.size.y);
  }
}
