class Chaser {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = createVector(heightInPixel / 4, heightInPixel / 4);
    this.hp = 800;
    this.speed = 1.5;
    this.dashSpeed = 6;
    this.chaseRange = heightInPixel / 2;
    this.isDashing = false;
    this.dashCooldown = 120; // Dash冷却时间（帧数）
    this.currentCooldown = 0;
  }

  update() {
    if (this.hp <= 0) return; // 血量为0时不更新
    
    if (this.currentCooldown > 0) {
      this.currentCooldown--;
    }

    let distanceToPlayer = dist(this.position.x, this.position.y, player.position.x, player.position.y);

    if (this.isDashing) {
      this.position.add(this.dashDirection);
      
      // 如果撞到墙或者超出屏幕，停止冲撞
      if (this.hitWall() || distanceToPlayer < player.size.x) {
        this.isDashing = false;
        this.currentCooldown = this.dashCooldown;
      }
    } else {
      if (distanceToPlayer < this.chaseRange && this.currentCooldown === 0) {
        this.startDash();
      } else {
        this.chasePlayer();
      }
    }
  }

  chasePlayer() {
    let direction = createVector(player.position.x - this.position.x, player.position.y - this.position.y);
    direction.normalize().mult(this.speed);
    this.position.add(direction);
  }

  startDash() {
    this.isDashing = true;
    let direction = createVector(player.position.x - this.position.x, player.position.y - this.position.y);
    direction.normalize().mult(this.dashSpeed);
    this.dashDirection = direction;
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
    if (this.hp === 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }
  }

  display() {
    if (this.hp <= 0) return; // Boss 死亡后不显示
    fill(this.isDashing ? 'red' : 'purple');
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
}
