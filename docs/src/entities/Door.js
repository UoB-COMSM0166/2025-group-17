const doorSize = 30;

class Door {
  constructor(xPosition, yPosition) {
    this.xPos = xPosition;
    this.yPos = yPosition;
  }

  display() {
    fill('blue');
    noStroke();
    ellipse(this.xPos, this.yPos, doorSize);
  };
}