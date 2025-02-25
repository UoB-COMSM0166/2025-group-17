class Bullet {
   constructor(x, y, direction) {
      this.x = x;
      this.y = y;
      this.speed = 5;
      this.direction = direction;
   }

   update() {
      if (this.direction === 87) this.y -= this.speed;
      if (this.direction === 83) this.y += this.speed;
      if (this.direction === 65) this.x -= this.speed;
      if (this.direction === 68) this.x += this.speed;
   }

   display() {
      fill(255, 0, 0);
      ellipse(this.x, this.y, 15);
   }
}