const { describe, test, expect, beforeEach } = require('@jest/globals');


// Mock Bullet class
global.Bullet = class {
  constructor(x, y, direction, atk) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.atk = atk;
  }
};

global.createVector = (x = 0, y = 0) => ({ x, y, set(x2, y2) { this.x = x2; this.y = y2; }, mag() { return Math.sqrt(this.x**2 + this.y**2); } });

// Mock p5.Vector.mult
global.p5 = {
  Vector: {
    mult: (vec, scalar) => ({ x: vec.x * scalar, y: vec.y * scalar })
  }
};

global.max = Math.max;

global.deathSound = { play: jest.fn(), currentTime: 0 };
global.shootSound = { play: jest.fn(), currentTime: 0 };

global.defaultHp = 3;
global.defaultSpeed = 5;
global.defaultAcceleration = 0.5;
global.defaultFriction = 0.8;
global.playerMaxSpeed = 15;
global.playerMaxAtk = 20;
global.defaultAtk = 5;
global.heightInPixel = 600;
global.playerImage = 'mockImage';

// 引入 Player 类
const Player = require('../entities/Player');  // 请根据你实际路径调整

describe('Player Class Functionality', () => {
  let player;

  beforeEach(() => {
    player = new Player(100, 100);
  });

  test('Initial HP should be defaultHp', () => {
    expect(player.hp).toBe(3);
  });

  test('shoot() should add bullet to bullets array', () => {
    expect(player.bullets.length).toBe(0);
    player.shoot('right');
    expect(player.bullets.length).toBe(1);
    expect(player.bullets[0].direction).toBe('right');
    expect(shootSound.play).toHaveBeenCalled();
  });

  test('updateHp() reduces HP without death', () => {
    player.updateHp(2);
    expect(player.hp).toBe(2);
    expect(deathSound.play).not.toHaveBeenCalled();
  });

  test('updateHp() reduces HP to 0 and triggers death sound', () => {
    player.updateHp(0);
    expect(player.hp).toBe(0);
    expect(deathSound.play).toHaveBeenCalled();
  });

  test('updatePosition() updates position by velocity', () => {
    player.velocity = { x: 5, y: -3 };
    player.updatePosition();
    expect(player.position.x).toBe(105);
    expect(player.position.y).toBe(97);
  });

  test('revertPosition() resets position after move', () => {
    player.velocity = { x: 2, y: 2 };
    player.updatePosition();
    player.revertPosition();
    expect(player.position.x).toBe(100);
    expect(player.position.y).toBe(100);
  });
});
