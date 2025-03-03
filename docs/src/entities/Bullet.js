class Bullet {
   constructor(x, y, direction, dmg, s = 20) {
      this.position = createVector(x, y);
      this.size = createVector(s, s);
      this.speed = 5;
      this.direction = direction; // Use a vector direction instead of a letter
      this.damage = dmg;
      this.image = bulletImage;
      this.angle = 0;
   }

   update() {
      // Move the bullet along its direction
      //this.position.add(p5.Vector.mult(this.direction, this.speed));
      if (this.direction === 'w') this.position.y -= this.speed;
      if (this.direction === 'a') this.position.x -= this.speed;
      if (this.direction === 's') this.position.y += this.speed;
      if (this.direction === 'd') this.position.x += this.speed;
      this.angle += 0.1;

   }

   display() {
      push();
      translate(this.position.x, this.position.y);
      rotate(this.angle);
      //imageMode(CENTER);
      image(this.image, 0, 0, this.size.x, this.size.y);
      pop();
      // fill(255, 0, 0);
      // rect(this.position.x, this.position.y, this.size.x, this.size.y);
   }
}
