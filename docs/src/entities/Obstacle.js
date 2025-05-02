class Obstacle {
  constructor(x, y, obImage) {
    this.position = createVector(x, y);
    const obsWidth = heightInPixel / 9;
    const obsHeight = obsWidth * (obImage.height / obImage.width);
    this.size = createVector(obsWidth, obsHeight);
    //randomly choose an image from the loaded obstacle images
    this.image = obImage;

  }

  display() {
    image(this.image, this.position.x, this.position.y, this.size.x, this.size.y);
  }
}
