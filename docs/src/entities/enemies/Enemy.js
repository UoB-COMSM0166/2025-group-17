class Enemy {
  constructor(x, y, hp, enImage, levelId) {
    this.hp = hp;
    this.position = createVector(x, y);
    const smallEnemyHp = 50;

    // Enemy size
    const isSmall = (hp === smallEnemyHp);
    const enemyHeight = isSmall ? heightInPixel / 8 : heightInPixel / 6;
    const enemyWidth = Math.floor(enemyHeight * (enImage.width / enImage.height));
    this.size = createVector(enemyWidth, enemyHeight);
    console.log(`Enemy image size ${enImage.width}, ${enImage.height}`);
    console.log(`Enemy size ${this.size.x}, ${this.size.y}`);
    
    this.velocity = createVector(random([-1, 1]), random([-1, 1]));
    this.image = enImage;

    // Add animation frame-related content and select frame groups based on level and size
    const levelKey = `level${levelId}`;
    const sizeKey = isSmall ? 'small' : 'large';
    this.frames = window.enemyAnimations?.[levelKey]?.[sizeKey] || [enImage]; // fallback to a single image
    console.log(`Enemy sprite size ${this.frames[0].width}, ${this.frames[0].height}`);
    
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.frameDelay = 10; // Control the playback speed. The higher, the slower
  }

  update() {
    // Animation update: Switch to one image every frameDelay frame
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }

    // Keep the original motion logic unchanged
    this.position.add(this.velocity);

    // Each frame checks for collisions and causes damage (instead of uniform processing in InputHandler)
    // this.checkPlayerCollisionAndDamage();
  }

  display() {
    // Play the current frame
    const img = this.frames[this.currentFrame] || this.image;
    image(img, this.position.x, this.position.y, this.size.x, this.size.y);
  }

  collide(otherObj) {
    // Calculate direction away from collision
    const enemyCenter = p5.Vector.sub(this.position.copy(), this.size.copy().div(2));
    const otherObjCenter = p5.Vector.sub(otherObj.position.copy(), otherObj.size.copy().div(2));
    const direction = p5.Vector.sub(enemyCenter, otherObjCenter).normalize();
    
    // Add some randomness to prevent perfect oscillation
    const randomness = p5.Vector.random2D().mult(0.2);
    direction.add(randomness).normalize();

    this.velocity = direction.mult(this.velocity.mag());
    this.position.add(direction);
  }
}
