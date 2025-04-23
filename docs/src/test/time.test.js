const { test, describe, beforeEach, expect } = require('@jest/globals');

// Global mocks
let startTime;
let timeSpent;

// Mock millis() to simulate passage of time
let mockTime = 0;
global.millis = () => mockTime;

// Mock p5.js text formatting helpers
global.floor = Math.floor;
global.text = jest.fn();

// Mock text display in drawGameCompleted
function drawGameCompleted() {
  const totalSecs = floor(timeSpent / 1000);
  const mins = floor(totalSecs / 60);
  const secs = totalSecs % 60;
  text(`YOU WON! Took ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} seconds`, 100, 100);
}

describe('Game Time Tracking Tests', () => {
  beforeEach(() => {
    mockTime = 0;
    startTime = 0;
    timeSpent = 0;
    text.mockClear();
  });

  test('startTime is set correctly at game start', () => {
    mockTime = 12345;
    startTime = millis();
    expect(startTime).toBe(12345);
  });

  test('timeSpent correctly calculates elapsed time', () => {
    startTime = 1000;
    mockTime = 6000; // 5 seconds later
    timeSpent = millis() - startTime;
    expect(timeSpent).toBe(5000);
  });

  test('drawGameCompleted formats time correctly', () => {
    timeSpent = 125000; // 125 seconds = 2 mins 5 secs
    drawGameCompleted();

    expect(text).toHaveBeenCalledWith(
      'YOU WON! Took 02:05 seconds',
      100,
      100
    );
  });
});
