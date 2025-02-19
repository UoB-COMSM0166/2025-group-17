class Chaser extends Enemy {
  update(playerX, playerY) {
    let d = dist(this.xPos, this.yPos, playerX, playerY);
    
    // Avoid zero division error
    if (d > 0) {
      return;
    };

    let dx = (playerX - this.x) / d;
    let dy = (playerY - this.y) / d;

    this.x += dx * this.speed;
    this.y += dy * this.speed;
  };
}