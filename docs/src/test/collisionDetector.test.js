// tests/collisionDetector.test.js
const { describe, test, expect, beforeEach } = require('@jest/globals');

const CollisionDetector = require('../controllers/CollisionDetector');

global.Audio = class {
  constructor() {
    this.currentTime = 0;
  }
  play() {}
  pause() {}
};
global.hitSound = new Audio();
global.deathSound = new Audio();

global.leftBoundary = 0;
global.rightBoundary = 800;
global.topBoundary = 0;
global.bottomBoundary = 600;
global.boundaryInPixel = { w: 800, h: 600 };

function createMockObj(x, y, w = 20, h = 20) {
  return {
    position: { x, y },
    size: { x: w, y: h },
    velocity: { x: 0, y: 0 }
  };
}

describe('CollisionDetector Functionality Tests', () => {
  let detector;

  beforeEach(() => {
    detector = new CollisionDetector();
  });

  test('detectPlayerCollision - player collides with obstacle', () => {
    const player = createMockObj(100, 100);
    const obstacles = [createMockObj(100, 100)];
    const result = detector.detectPlayerCollision(player, obstacles);
    expect(result).toBe(true);
  });

  test('detectPlayerCollision - player does not collide', () => {
    const player = createMockObj(100, 100);
    const obstacles = [createMockObj(300, 300)];
    const result = detector.detectPlayerCollision(player, obstacles);
    expect(result).toBe(false);
  });

  test('detectBulletEnemyCollision - bullet hits enemy, hp reduced', () => {
    const bullet = createMockObj(100, 100);
    bullet.damage = 10;
    const bullets = [bullet];

    const enemy = createMockObj(100, 100);
    enemy.hp = 20;
    const enemies = [enemy];

    detector.detectBulletEnemyCollision(bullets, enemies);

    expect(enemies[0].hp).toBe(10); 
    expect(bullets.length).toBe(0); 
  });

  test('detectBulletCollision - bullet hits obstacle and disappears', () => {
    const bullet = createMockObj(200, 200);
    const bullets = [bullet];

    const enemy = createMockObj(100, 100);
    enemy.hp = 20;
    const enemies = [enemy];

    const obstacle = createMockObj(200, 200);
    const obstacles = [obstacle];

    detector.detectBulletCollision(bullets, enemies, obstacles);
    expect(bullets.length).toBe(0); // 子弹被删掉
  });

  test('isBulletHitWall - bullet outside boundary returns true', () => {
    const bullet = createMockObj(-100, -100); // 超出边界
    const result = detector.isBulletHitWall(bullet);
    expect(result).toBe(true);
  });

  test('isBulletHitWall - bullet inside boundary returns false', () => {
    const bullet = createMockObj(100, 100);
    const result = detector.isBulletHitWall(bullet);
    expect(result).toBe(false);
  });
});
