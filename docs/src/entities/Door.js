class Door {
  constructor(x = rightBoundary, y = heightInPixel / 2 - doorSize.h / 2) {
    this.position = createVector(x, y);
    this.size = createVector(doorSize.w, doorSize.h);
    this.currentDoorImg = closedDoorImg;

    this.isOpen = false;
  }

  display() {
    image(this.currentDoorImg, this.position.x, this.position.y, this.size.x, this.size.y);
  }

  open() {
    if (this.currentDoorImg === openDoorImg) return;
    this.currentDoorImg = openDoorImg;
    
    this.isOpen = true;
  }
}
