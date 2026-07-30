const { describe, test, expect } = require('@jest/globals');

global.millis = () => 0;
global.CollisionDetector = class {};

const InputHandler = require('../controllers/InputHandler');

function createBullet(removed) {
  return {
    update: jest.fn(),
    display: jest.fn(),
    shouldBeRemoved: jest.fn(() => removed),
  };
}

describe('InputHandler bullet updates', () => {
  test('processes every bullet when consecutive bullets are removed', () => {
    const firstRemoved = createBullet(true);
    const secondRemoved = createBullet(true);
    const retained = createBullet(false);
    const player = {
      bullets: [firstRemoved, secondRemoved, retained],
    };
    const handler = Object.create(InputHandler.prototype);

    handler.updateBullets(player);

    expect(firstRemoved.update).toHaveBeenCalledTimes(1);
    expect(secondRemoved.update).toHaveBeenCalledTimes(1);
    expect(retained.update).toHaveBeenCalledTimes(1);
    expect(retained.display).toHaveBeenCalledTimes(1);
    expect(player.bullets).toEqual([retained]);
  });
});
