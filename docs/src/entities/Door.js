class Door {
  constructor() {
    const doorSize = { w: 73, h: 95 };
    const x = widthInPixel - doorSize.w;
    const y = heightInPixel / 2 - doorSize.h / 2;
    this.position = createVector(x, y);

    this.size = createVector(doorSize.w, doorSize.h);
    this.currentDoorImg = closedDoorImg;

    this.isOpen = false;
    this.updateImage();
  }

  display() {
    image(this.currentDoorImg, this.position.x, this.position.y, this.size.x, this.size.y);
  }

  open() {
    if (this.currentDoorImg === openDoorImg) return;
    this.currentDoorImg = openDoorImg;
    this.isOpen = true;

    openDoorSound.play();
  }

  close() {
    if (this.currentDoorImg === closedDoorImg) return;
    this.currentDoorImg = closedDoorImg;
    this.isOpen = false;
  }

  updateImage() {
    image(this.currentDoorImg, this.position.x, this.position.y);
  }
}
