class Player {
  //Character Attributes
  #maxHp = 3;
  #baseAtk = 50;
  #atk = 50;
  #maxAtk = 100;
  #maxSpeed = 4;
  #acceleration = 3.0;
  #friction = 0.85;
  #bulletSize = 20;
  #maxBulletSize = 40;
  #canShootAgain = true;
  #shootCoolDownDuration = 300;

  constructor(x = leftBoundary, y = heightInPixel / 2) {
    this.hp = this.#maxHp;
    this.position = createVector(x, y); //initial position
    this.velocity = createVector(0, 0); //initial velocity


    //------------Damage determination and image display are separated------------
    // Determination box size (The red box is used to detect collisions)
    this.size = createVector(36, 52);  // Adjustable collision determination size (originally heightInPixel / 7)
    //  Image display size (will not affect the determination box)
    this.displaySize = createVector(72, 72); // It is recommended to exceed the judgment box to prevent the image from being cropped
    //--------------------------------------------


    this.invincibleTimer = 0;   // Remaining unbeatable frames
    this.blinkCounter = 0;      // Used for the invincible flashing effect
    this.bullets = []; //Bullet management array


    this.image = playerImage; // Initial static image
    // -------------Character animation control module--------------
    this.animations = window.playerAnimations; // Get the animation frame from preload.js
    this.direction = 'down';                   // Initial orientation
    this.currentFrame = 0;                     // Current frame index
    this.frameCounter = 0;                     // Animation playback counter
    this.frameDelay = 6;                       // Switch the animation every few frames
    // ------------------------------------------
  }

  getAtk() { return this.#atk; }
  getBulletSize() { return this.#bulletSize; }
  getHp() { return this.hp; }
  getMaxHp() { return this.#maxHp; }
  setHp(newHp) { this.hp = newHp; }

  // Reset the room status to ensure that the player's position and status in the new room can be inherited
  resetRoomState(newHp, atk = this.#atk, bulletSize = this.#bulletSize, x = leftBoundary, y = heightInPixel / 2) {
    this.hp = newHp;
    this.#atk = atk;
    this.#bulletSize = bulletSize;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.invincibleTimer = 60; // Player becomes invincible when entering a room
    this.#canShootAgain = true;
    this.bullets = [];

    this.direction = 'down'; //idle status
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.frameDelay = 6;
  }

  updateHp(valueToAdd, invincibleDuration = 60) {
    if (this.invincibleTimer > 0) return;
    const newHp = this.hp + valueToAdd;
    if (newHp < this.hp) hurtSound.play();

    this.hp = max(0, min(newHp, this.#maxHp));
    console.log("Player hp updated to", this.hp);

    if (this.hp <= 0) playerDeathSound.play();
    this.resetInvincibleTimer(invincibleDuration);
  }

  shoot(direction) {
    if (!this.#canShootAgain) return;
    const centerX = this.position.x + this.size.x / 2;
    const centerY = this.position.y + this.size.y / 2;
    const bulletImg = (this.#atk <= this.#baseAtk) ? bulletImage : powerUpBulletImage;
    this.bullets.push(new Bullet(centerX, centerY, direction, this.#atk, bulletImg, this.#bulletSize));
    this.#canShootAgain = false;
    setTimeout(() => { this.#canShootAgain = true; }, this.#shootCoolDownDuration);
    console.log("A bullet has been shot");
    shootSound.play();
  }

  powerUp() {
    const upRatio = 1.25;
    this.#atk = min(this.#atk * upRatio, this.#maxAtk);
    this.#bulletSize = min(this.#bulletSize * upRatio, this.#maxBulletSize);
    console.log(`Power Up activated! ATK: ${this.#atk}, Bullet size: ${this.#bulletSize}`);
  }

  updateBlinking() {
    if (this.invincibleTimer > 0) {
      this.invincibleTimer--;
      this.blinkCounter = (this.blinkCounter + 1) % 10;
    }
  }

  display() {
    // When invincible, skip drawing for half the blink cycle.
    if (this.invincibleTimer > 0 && this.blinkCounter < 5) return;

    // Offset the display image to center and align the collision box
    const offsetX = (this.size.x - this.displaySize.x) / 2;
    const offsetY = (this.size.y - this.displaySize.y) / 2;

    image(
      this.image,
      this.position.x + offsetX,
      this.position.y + offsetY,
      this.displaySize.x,
      this.displaySize.y
    );
  }

  updateVelocity() {
    let input = createVector(0, 0);

    if (keyIsDown(LEFT_ARROW)) input.x = -1;
    if (keyIsDown(RIGHT_ARROW)) input.x = 1;
    if (keyIsDown(UP_ARROW)) input.y = -1;
    if (keyIsDown(DOWN_ARROW)) input.y = 1;

    // Immediate response speed, no lerp (to avoid sliding through walls)
    if (input.mag() > 0) {
      input.normalize();
      // Change the acceleration to drive the velocity and simulate inertia
      let accelerationVector = p5.Vector.mult(input, this.#acceleration * 0.1);
      this.velocity.add(accelerationVector);

      // Limit the maximum speed
      if (this.velocity.mag() > this.#maxSpeed) {
        this.velocity.setMag(this.#maxSpeed);
      }
      // Direction determination is used for animation (priority level)
      if (abs(input.x) > abs(input.y)) {
        this.direction = input.x > 0 ? 'right' : 'left';
      } else if (input.y !== 0) {
        this.direction = input.y > 0 ? 'down' : 'up';
      }
    } else {
      // Apply friction when there is no input
      this.applyFriction();
    }


    // Animation frame switching logic
    if (this.velocity.mag() > 0.5) {
      this.frameCounter++;
      if (this.frameCounter >= this.frameDelay) {
        this.frameCounter = 0;
        this.currentFrame = (this.currentFrame + 1) % this.animations[this.direction].length;
      }
    } else {
      this.currentFrame = 0;
    }

    // Update the current image to the corresponding direction animation frame
    this.image = this.animations[this.direction][this.currentFrame];
  }

  applyFriction() {
    this.velocity.mult(this.#friction);

    // If the speed is small enough, force it to zero (to avoid continuous sliding)
    if (this.velocity.mag() < 0.1) {
      this.velocity.set(0, 0);
    }
  }

  resetVelocity() {
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  updatePosition() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  revertPosition() {
    this.position.x -= this.velocity.x;
    this.position.y -= this.velocity.y;
  }

  resetInvincibleTimer(duration = 60) {
    this.invincibleTimer = duration;
  }
}
