class Obstacle {
   constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 30;
   }

   display() {
      fill(100);
      rect(this.x, this.y, 30, 30);
   }
}