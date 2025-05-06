class Chaser {
  #shakeIntensity;
  #isDead;

  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = createVector(heightInPixel / 4, heightInPixel / 4);
    this.collisionDetector = new CollisionDetector();
    //this.size = createVector(heightInPixel / 4, (heightInPixel / 4) * 2 / 3);
    this.maxHp = 800;
    this.hp = this.maxHp;
    this.isHurt = false;
    this.hitFrame = 0;
    this.speed = 1;
    this.dashSpeed = 20;
    this.chaseRange = 150;
    this.isDashing = false;
    this.dashCooldown = 100;
    this.currentCooldown = 0;
    this.dashDamageApplied = false;
    this.dashDuration = 10;
    this.currentDashTime = 0;
    this.#shakeIntensity = 0;
    this.#isDead = false;
    this.frames = window.chaserFrames || []; 
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.frameDelay = 12;
  }

  update() {
    // Animation update: Switch one image for each frameDelay frame
    if (this.#isDead) return;
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }

    if (this.currentCooldown > 0) this.currentCooldown--;

   // let distanceToPlayer = dist(
      //this.position.x, this.position.y,
      //player.position.x, player.position.y
   //);
    const chCenter = p5.Vector.add(this.position, this.size.copy().mult(0.5));
    const plCenter = p5.Vector.add(player.position, player.size.copy().mult(0.5));
    const distanceToPlayer = p5.Vector.dist(chCenter, plCenter);
    

    if (this.isDashing) {
      this.position.add(this.dashDirection);
      this.currentDashTime++;

      //const rSum = max(this.size.x, this.size.y)/2 + max(player.size.x, player.size.y)/2;
      //const centerDistSq = p5.Vector.sub(chCenter, plCenter).magSq();
      const chCenter = p5.Vector.add(this.position, this.size.copy().mult(0.5));
      const plCenter = p5.Vector.add(player.position,  player.size.copy().mult(0.5));
      const rSum          = max(this.size.x, this.size.y)/2 + max(player.size.x, player.size.y)/2;
      const centerDistSq  = p5.Vector.sub(chCenter, plCenter).magSq();
      
      const collided = centerDistSq < rSum * rSum;
      
      //if (this.collisionDetector.detectCollision(this, player) && !this.dashDamageApplied) {
      if (collided && !this.dashDamageApplied) {
        this.applyDashDamage();
      }

      if (this.hitWall() || this.currentDashTime >= this.dashDuration) {
        this.isDashing = false;
        this.currentCooldown = this.dashCooldown;
        this.dashDamageApplied = false;
        this.currentDashTime = 0;
      }

    } else {
      if (distanceToPlayer < this.chaseRange && this.currentCooldown === 0) {
        this.startDash();
      } else {
        this.chasePlayer();
      }
    }

    // Hit the player but not dash
    if (!this.isDashing && this.collisionDetector.detectCollision(this, player)) {
      const pushDir = p5.Vector.sub(player.position, this.position).normalize().mult(4);
      player.position.add(pushDir);
      player.position.x = constrain(player.position.x, leftBoundary, rightBoundary - player.size.x);
      player.position.y = constrain(player.position.y, topBoundary, bottomBoundary - player.size.y);
    }
  }

  applyDashDamage() {
    if (this.#isDead) return;
    player.updateHp(-1);
    this.dashDamageApplied = true;

    const pushDir = p5.Vector.sub(player.position, this.position).normalize().mult(160);
    player.position.add(pushDir);
    player.position.x = constrain(player.position.x, leftBoundary, rightBoundary - player.size.x);
    player.position.y = constrain(player.position.y, topBoundary, bottomBoundary - player.size.y);
  }

  chasePlayer() {
    let direction = createVector(
      player.position.x - this.position.x,
      player.position.y - this.position.y
    );
    direction.normalize().mult(this.speed);
    this.position.add(direction);
  }

  startDash() {
    this.isDashing = true;
    this.currentDashTime = 0;
    let direction = createVector(
      player.position.x - this.position.x,
      player.position.y - this.position.y
    );
    direction.normalize().mult(this.dashSpeed);
    this.dashDirection = direction;
    this.dashDamageApplied = false;
    //this.applyDashDamage(); // The initial dash impact immediately deducts health
  }

  hitWall() {
    return (
      this.position.x < leftBoundary ||
      this.position.x + this.size.x > rightBoundary ||
      this.position.y < topBoundary ||
      this.position.y + this.size.y > bottomBoundary
    );
  }

  takeDamage(damage) {
    this.hp = max(0, this.hp - damage);
    if (this.hp <= 0) this.#markAsDead();
  }

  #markAsDead() {
    if (this.#isDead) return;
    this.#isDead = true;
    this.#shakeIntensity = 30;

    // Play the death sound effect
    if (bossDeathSound) {
      bossDeathSound.currentTime = 0;  // Play the sound effect from the beginning
      bossDeathSound.play();
      }
  }

  // Remove boss after the animation
  shouldBeRemoved() {
    if (this.#isDead && this.#shakeIntensity <= 0) {
      // bossDeathSound.play();
      return true;
    }
    return false;
  }

  detectBulletCollision(bulletArr) {
    bulletArr.forEach((bulletObj, bulletIndex) => {
      if (this.checkBulletCollision(bulletObj)) {
        this.takeDamage(bulletObj.damage);
        this.isHurt = true;
        bulletArr[bulletIndex].markAsHit(!this.#isDead);
      }
    });
  }

  checkBulletCollision(bullet) {
    return (
      bullet.position.x < this.position.x + this.size.x &&
      bullet.position.x + bullet.size.x > this.position.x &&
      bullet.position.y < this.position.y + this.size.y &&
      bullet.position.y + bullet.size.y > this.position.y
    );
  }

  display() {
    // Play the current animation frame
    const img = this.frames[this.currentFrame];
    if (this.#isDead) this.#displayDeadBoss(img);
    else image(img, this.position.x, this.position.y, this.size.x, this.size.y);
  }

  #displayDeadBoss(img) {
    // Compute random shaking displacement
    let shakeX = random(-this.#shakeIntensity, this.#shakeIntensity);
    let shakeY = random(-this.#shakeIntensity, this.#shakeIntensity);
    
    // Draw the enemy with shaking effects
    if (this.#shakeIntensity % 5 >= 2) {
      image(img, this.position.x + shakeX, this.position.y + shakeY, this.size.x, this.size.y);
    }

    // Decrease intensity
    this.#shakeIntensity -= 0.5;
  }

  applyHitEffect(flashFrame) {
    if (this.isHurt && this.hitFrame < flashFrame) {
      const flashIntensity = this.hitFrame % 3;
      tint(255, 100, 100, flashIntensity * 255);
      this.hitFrame++;
    } else {
      this.isHurt = false;
      this.hitFrame = 0;
      noTint();
    }
  }
}
