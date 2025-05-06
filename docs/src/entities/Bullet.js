class Bullet {
  constructor(x, y, direction, dmg, img = bulletImage, s = 20) {
    this.position = createVector(x, y);
    this.size = createVector(s, s);
    this.speed = 4;
    this.direction = direction; // Use a vector direction instead of a letter
    this.damage = dmg;
    this.image = img;

    this.initialAngle = random(TWO_PI); //Assign a random initial Angle to the bullet
    this.spin = 0; //Rotation increment
    this.rotationSpeed = random([-1, 1]) * random(0.01, 0.08)  // Rotate 0.5 to 1 arc per frame

    this.isHit = false;
    this.hitFrame = 0;
    this.frames = window.hitEffectFrames;

    //Increase the lifespan of bullets
    this.life = 0;
    this.maxLife = 100;

    this.trail = [];          // Store afterimage particles
    this.trailMax = 15;       // Record up to 15 trails at most

  }

  update() {
    if (this.isHit) {
      this.hitFrame++;
      // Clear the wake (Clear the wake immediately when the bullet dies)
      if (this.isHit || this.life >= this.maxLife) {
        this.trail = [];  // Clear the wake array immediately
      }
      return;
    }



    // Move the bullet along its direction
    //this.position.add(p5.Vector.mult(this.direction, this.speed));
    if (this.direction === 'w') this.position.y -= this.speed;
    if (this.direction === 'a') this.position.x -= this.speed;
    if (this.direction === 's') this.position.y += this.speed;
    if (this.direction === 'd') this.position.x += this.speed;

    //rotation
    this.spin += this.rotationSpeed;

    //cumulative life
    this.life++;

    // Add the current position as a afterimage
    this.trail.unshift({
      pos: this.position.copy(),
      age: 0
    });
    // Limit the maximum length of the wake
    if (this.trail.length > this.trailMax) this.trail.pop();
    // Age increases with each frame
    for (let t of this.trail) t.age++;
  }

  display() {
    push();
    imageMode(CENTER);
    noStroke();

    // Draw the wake particles first
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      // The transparency of particles decays with age
      const alpha = map(t.age, 0, this.trailMax, 200, 0);

      // The size decreases with age, and the base is half the size of a bullet
      const baseSize = this.size.x * 0.5; // The base is half of the main bullet
      const shrink = map(t.age, 0, this.trailMax, 1.0, 0.3); // attenuation ratio
      const flicker = map(sin(frameCount * 0.3 + i), -1, 1, 0.9, 1.1); // Glitter
      const radius = baseSize * shrink * flicker;
      fill(255, 255, 180, alpha);
      ellipse(t.pos.x, t.pos.y, radius, radius);
    }

    translate(this.position.x, this.position.y);
    rotate(this.initialAngle + this.spin); //Each bullet has an independent Angle


    // Advance to next hit animation frame each 3 frame
    if (this.isHit) image(this.frames[Math.floor(this.hitFrame / 3)], 0, 0, 2.5 * this.size.x, 2.5 * this.size.y);
    else image(this.image, 0, 0, this.size.x, this.size.y);
    pop();
  }

  markAsHit(playSound = true) {
    if (this.isHit === true) return;
    this.isHit = true;

    // Omit further damage and hit sound
    if (playSound) hitSound.play();
    this.damage = 0;
  }

  // Let the bullet lasts for 30 frames
  shouldBeRemoved() { return this.hitFrame >= 30 || this.life >= this.maxLife; }
}
