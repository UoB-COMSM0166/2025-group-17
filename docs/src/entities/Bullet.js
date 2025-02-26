class Bullet {
   constructor(x, y, direction, s = 10, dmg = 50) {
      this.position = createVector(x, y);
      this.size = createVector(s, s);
      this.speed = 5;
      this.direction = direction;
      this.damage = dmg;
   }

   update() {
      if (this.direction === 'w') this.position.y -= this.speed;
      if (this.direction === 'a') this.position.x -= this.speed;
      if (this.direction === 's') this.position.y += this.speed;
      if (this.direction === 'd') this.position.x += this.speed;
   }

   display() {
      fill(255, 0, 0);
      rect(this.position.x, this.position.y, this.size.x, this.size.y);
   }
}