const enemySize = 20;
const chaserSize = 30;
const shootSize = 25;
const smallEnemyHp = 50;
const largeEnemyHp = 100;
const smallEnemySize = { w: 40, h: 40 };
const largeEnemySize = { w: 50, h: 60 };

class Enemy {
  constructor(x, y, hp) {
    this.hp = hp;
    this.position = createVector(x, y);
    this.size = createVector(
        hp === smallEnemyHp ? smallEnemySize.w : largeEnemySize.w,
        hp === smallEnemyHp ? smallEnemySize.h : largeEnemySize.h
    );
    this.velocity = createVector(random([-1, 1]), random([-1, 1]));
  }

  update() {
    this.position.add(this.velocity);
    if (this.position.x < 0 || this.position.x > width) this.velocity.x *= -1;
    if (this.position.y < 0 || this.position.y > height) this.velocity.y *= -1;
  }

  display() {
    fill('green');
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
}

