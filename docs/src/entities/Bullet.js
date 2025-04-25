class Bullet {
   constructor(x, y, direction, dmg, s = 20) {
      this.position = createVector(x, y);
      this.size = createVector(s, s);
      this.speed = 5;
      this.direction = direction; // Use a vector direction instead of a letter
      this.damage = dmg;
      this.image = bulletImage;
      this.angle = 0;
      this.isHit = false;
      this.hitFrame = 0;
      this.frames = window.hitEffectFrames;
   }

  update() {
    if (this.isHit) {
      this.hitFrame++;
      return;
    }
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
    // Advance to next hit animation frame each 3 frame
    if (this.isHit) image(this.frames[Math.floor(this.hitFrame / 3)], 0, 0, 1.2 * this.size.x, 1.2 * this.size.y);
    else image(this.image, 0, 0, this.size.x, this.size.y);
    pop();
  }

  markAsHit() {
    this.isHit = true;
    // Reset the damage to zero to omit further damage to bosses
    this.damage = 0;
  }

  // Let the bullet lasts for 30 frames
  shouldBeRemoved() {
    return this.hitFrame >= 30;
  }
}
