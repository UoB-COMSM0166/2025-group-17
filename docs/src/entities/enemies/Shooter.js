class Shooter {
  #shakeIntensity;
  #isDead;

  constructor(x, y, collisionDetector, speed, shootCooldown) {
    this.position = createVector(x, y);
    this.size = createVector(heightInPixel / 4, heightInPixel / 4);
    this.collisionDetector = collisionDetector; 
    this.maxHp = 800;
    this.hp = this.maxHp;
    this.isHurt = false;
    this.hitFrame = 0;
    this.speed = speed;
    this.moveCooldown = 60;
    this.currentMoveCooldown = 0;
    this.direction = p5.Vector.random2D().mult(this.speed);
    this.shootCooldown = shootCooldown;
    this.currentShootCooldown = this.shootCooldown;
    this.bullets = [];
    this.warningTime = 0;
    this.warningDuration = 60;
    this.shooterSoundOn = false;          //  Mark "Playing continuously"
    this.#shakeIntensity = 0;
    this.#isDead = false;

    // Shooter Boss animation
    this.frames = window.shooterFrames || window.shooterFramesDefault;
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.frameDelay = 10; // Set the carousel speed at will
  }

  update() {
    //if (this.hp <= 0) return;
    if (this.hp <= 0) {
      this.#markAsDead(); // Ensure that the death handling logic is triggered (including the stop sound effect)
      return;
    }

    // Animation switching logic
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }

    if (this.currentMoveCooldown <= 0) {
      this.direction = p5.Vector.random2D().mult(this.speed);
      this.currentMoveCooldown = this.moveCooldown;
    } else {
      this.currentMoveCooldown--;
    }

    this.position.add(this.direction);
    this.checkBoundaryCollision();

    if (this.warningTime > 0) {
      this.warningTime--;
    }

    if (this.currentShootCooldown <= this.warningDuration) {
      this.warningTime = this.warningDuration;
      // It is played in a loop throughout the entire period of time
      if (!this.shooterSoundOn && shooterSound && !this.#isDead) {
        shooterSound.playMode("untilDone"); 
        shooterSound.play();        // Start from the beginning and loop
        this.shooterSoundOn = true;
      }
    }

    if (this.currentShootCooldown <= 0) {
         
     if (this.shooterSoundOn && shooterSound) {
         //shooterSound.stop();   // stop() will automatically reset the playback head to zero
         this.shooterSoundOn = false;
     }

      this.warningTime = 60;
      this.shoot();
      this.currentShootCooldown = this.shootCooldown;
    } else {
      this.currentShootCooldown--;
    }

    this.bullets.forEach(bullet => bullet.update());

    this.collisionDetector.detectBulletCollision(
      this.bullets,          // bullets Array
      [player],              // Treat player as an "enemy"
      []             // Obstacle array (have defined it externally)
    );
    //this.detectPlayerCollision();
    //this.bullets = this.bullets.filter(bullet => !this.isBulletOutOfBounds(bullet));
    

    this.bullets = this.bullets.filter(b => !b.isHit);

    this.checkPlayerCollisionDirect();
  }

  checkBoundaryCollision() {
    if (this.position.x < leftBoundary || this.position.x + this.size.x > rightBoundary) {
      this.direction.x *= -1;
    }
    if (this.position.y < topBoundary || this.position.y + this.size.y > bottomBoundary) {
      this.direction.y *= -1;
    }
  }

  shoot() {
    const directions = [
      createVector(1, 0), createVector(-1, 0),
      createVector(0, 1), createVector(0, -1),
      createVector(1, 1), createVector(-1, -1),
      createVector(1, -1), createVector(-1, 1)
    ];

    const bulletsPerDirection = 5;
    const spacing = 40;

    directions.forEach(dir => {
      dir.normalize();
      for (let i = 0; i < bulletsPerDirection; i++) {
        const offset = p5.Vector.mult(dir, i * spacing);
        const bullet = new ShooterBullet(
          this.position.x + this.size.x / 2 + offset.x,
          this.position.y + this.size.y / 2 + offset.y,
          dir.copy(),
          1,
          3,
          BossBulletImgL3
        );
        this.bullets.push(bullet);
      }
    });
  }

  //isBulletOutOfBounds(bullet) {
  //  return (
  //    bullet.position.x < leftBoundary ||
  //    bullet.position.x > rightBoundary ||
  //    bullet.position.y < topBoundary ||
  //    bullet.position.y > bottomBoundary
  //  );
  //}

  takeDamage(damage) {
    this.hp = max(0, this.hp - damage);
    if (this.hp <= 0) this.#markAsDead();
  }

  #markAsDead() {
    if (this.#isDead) return;
    this.#isDead = true;
    this.#shakeIntensity = 30;


    // Stop sound
    if (shooterSound && shooterSound.isPlaying()) {
      shooterSound.stop();
       }


    // Playing death sound
    if (bossDeathSound) {
      bossDeathSound.currentTime = 0;  
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

  //detectPlayerCollision() {
  //  if (this.#isDead) return;
  //  this.bullets = this.bullets.filter(bullet => {
  //    if (this.checkPlayerCollision(bullet)) {
  //      player.updateHp(-bullet.damage, 90);
  //      return false;
  //    }
  //    return true;
  //  });
  //}

  //detectPlayerCollision() {
  //  if (this.#isDead) return;
  //  this.bullets = this.bullets.filter(bullet => {
  //    if (collisionDetector.detectCollisionWithBullet(bullet, player)) {
  //      player.updateHp(-bullet.damage, 90);
  //      return false;
  //    }
 //     return true;
 //   });
  //}

  //checkPlayerCollision(bullet) {
  //  return (
  //    bullet.position.x < player.position.x + player.size.x &&
  //    bullet.position.x + bullet.size.x > player.position.x &&
  //    bullet.position.y < player.position.y + player.size.y &&
  //    bullet.position.y + bullet.size.y > player.position.y
  //  );
  //}

  checkPlayerCollisionDirect() {
    const p = player;
    const s = this;
    
    const collided =
      p.position.x < s.position.x + s.size.x &&
      p.position.x + p.size.x > s.position.x &&
      p.position.y < s.position.y + s.size.y &&
      p.position.y + p.size.y > s.position.y;

    if (collided) {
      const pushDir = p5.Vector.sub(p.position.copy().add(p.size.x / 2, p.size.y / 2),
                                    s.position.copy().add(s.size.x / 2, s.size.y / 2))
                             .normalize().mult(5);

      p.position.add(pushDir);
      p.position.x = constrain(p.position.x, leftBoundary, rightBoundary - p.size.x);
      p.position.y = constrain(p.position.y, topBoundary, bottomBoundary - p.size.y);

      player.updateHp(-1, 90);
    }
  }

  display() {
    const img = this.frames[this.currentFrame];
    if (this.#isDead) {
      this.#displayDeadBoss(img);
      return;
    }

    image(img, this.position.x, this.position.y, this.size.x, this.size.y);
    this.bullets.forEach(bullet => bullet.display());
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
    this.#shakeIntensity -= 0.4;
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

  getPosition() {
    return this.position.copy();
  }

  getSize() {
    return this.size.copy();
  }
}



// A Shooter that fires bullets in four directions
class ShooterFourDir extends Shooter {
  constructor(x, y, collisionDetector, speed, shootCooldown) {
    super(x, y, collisionDetector, speed, shootCooldown);
  }
  shoot() {
    //shooterFireSound.play();

    
    const directions = [
      createVector(1, 0),
      createVector(-1, 0),
      createVector(0, 1),
      createVector(0, -1)
    ];
    const bulletsPerDirection = 5;
    const spacing = 40;

    directions.forEach(dir => {
      dir.normalize();
      for (let i = 0; i < bulletsPerDirection; i++) {
        const offset = p5.Vector.mult(dir, i * spacing);
        const bullet = new ShooterBullet(
          this.position.x + this.size.x / 2 + offset.x,
          this.position.y + this.size.y / 2 + offset.y,
          dir.copy(),
          1,
          3,
          BossBulletImgL2
        );
        this.bullets.push(bullet);
      }
    });
  }
}

// A Shooter that fires bullets in eight directions
class ShooterEightDir extends Shooter {
  constructor(x, y, collisionDetector, speed, shootCooldown) {
    super(x, y, collisionDetector, speed, shootCooldown); // Pass it to the parent class of Shooter
  }

  
  shoot() {
    //shooterFireSound.play();
    super.shoot();
  }
}
