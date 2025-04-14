class Chaser {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = createVector(heightInPixel / 4, heightInPixel / 4);
    this.hp = 800;
    this.speed = 1;
    this.dashSpeed = 10;
    this.chaseRange = 100;
    this.isDashing = false;
    this.dashCooldown = 100;
    this.currentCooldown = 0;
    this.dashDamageApplied = false; // 每次 dash 只造成一次伤害
    // 新增：dash 最大持续帧数
    this.dashDuration = 10; // 例如 30 帧
    this.currentDashTime = 0; // 当前 dash 状态持续时间计时器
    this.image = chaserImage; // 你需要在 preload 中加载这个图片
  }

  update() {
    if (this.currentCooldown > 0) {
      this.currentCooldown--;
    }

    let distanceToPlayer = dist(
      this.position.x, this.position.y,
      player.position.x, player.position.y
    );



    if (this.isDashing) {
      // 执行 dash 移动
      this.position.add(this.dashDirection);
      // 计时 dash 持续时间
      this.currentDashTime++;

      // 仅在 dash 状态下检测碰撞，并保证本次 dash 只扣一次血
      if (this.checkPlayerCollision() && !this.dashDamageApplied) {
        this.applyDashDamage();
      }


  
      if (this.hitWall() || distanceToPlayer > player.size.x * 3 || this.currentDashTime >= this.dashDuration) {
        this.isDashing = false;
        this.currentCooldown = this.dashCooldown;
        this.dashDamageApplied = false; // 重置，允许下一次 dash 扣血
        this.currentDashTime = 0;       // 重置 dash 计时器
      }
      
    
    } else {
      // 达到设定距离并且冷却完毕则启动 dash
      if (distanceToPlayer < this.chaseRange && this.currentCooldown === 0) {
        this.startDash();
      } else {
        this.chasePlayer();
      }
    }
    console.log(`Frame: ${frameCount}, isDashing: ${this.isDashing}, currentDashTime: ${this.currentDashTime}, distanceToPlayer: ${distanceToPlayer.toFixed(2)}, dashDamageApplied: ${this.dashDamageApplied}`);
  // 非 dash 状态：只阻挡，不扣血
  if (!this.isDashing && this.checkPlayerCollision()) {
    const pushDir = p5.Vector.sub(player.position, this.position).normalize().mult(4);
    player.position.add(pushDir);
  
    // ✅ 保证 player 位置在边界内
    player.position.x = constrain(player.position.x, leftBoundary, rightBoundary - player.size.x);
    player.position.y = constrain(player.position.y, topBoundary, bottomBoundary - player.size.y);
  }
  

  }

  applyDashDamage() {
    player.updateHp(player.hp - 0.5);
    console.log('Dash damage applied at frame ' + frameCount + ', player HP: ' + player.hp);
    hurtSound.currentTime = 0;
    hurtSound.play();
    this.dashDamageApplied = true;
  
    // ✅ 添加反弹
    const pushDir = p5.Vector.sub(player.position, this.position).normalize().mult(20);
    player.position.add(pushDir);
  
    player.position.x = constrain(player.position.x, leftBoundary, rightBoundary - player.size.x);
    player.position.y = constrain(player.position.y, topBoundary, bottomBoundary - player.size.y);
  
    if (player.hp <= 0 && typeof menuDrawer !== 'undefined') {
      menuDrawer.showGameOverPage();
    }
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
    this.currentDashTime = 0;  // 重置 dash 计时器
    let direction = createVector(
      player.position.x - this.position.x,
      player.position.y - this.position.y
    );
    direction.normalize().mult(this.dashSpeed);
    this.dashDirection = direction;
    this.dashDamageApplied = false;
    // 每次 dash 一启动就扣血，而不依赖碰撞检测
    this.applyDashDamage();
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
    hitSound.currentTime = 0;
    hitSound.play();
    if (this.hp === 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }
  }

  detectBulletCollision(bullets) {
    bullets.forEach((bullet, index) => {
      if (this.checkBulletCollision(bullet)) {
        this.takeDamage(bullet.damage);
        bullets.splice(index, 1);
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

  // 检测玩家与 chaser 是否相交
  checkPlayerCollision() {
    return (
      this.position.x < player.position.x + player.size.x &&
      this.position.x + this.size.x > player.position.x &&
      this.position.y < player.position.y + player.size.y &&
      this.position.y + this.size.y > player.position.y
    );
  }

  display() {
    if (this.hp <= 0) return;
    fill(this.isDashing ? 'red' : 'purple');
    //rect(this.position.x, this.position.y, this.size.x, this.size.y);
    image(this.image, this.position.x, this.position.y, this.size.x, this.size.y);
  }
}
