function adjustCanvasWithAspectRatio() {
  let cnvHeight, cnvWidth;
  // Calculate the max size that fits while keeping 16:9 aspect ratio
  if (windowWidth / windowHeight > 16 / 9) {
    cnvHeight = windowHeight;
    cnvWidth = round((16 / 9) * windowHeight);
  } else {
    cnvWidth = windowWidth;
    cnvHeight = round((9 / 16) * windowWidth);
  }

  resizeCanvas(cnvWidth, cnvHeight);
  gameStateManager.resizeBtns();

  // Centre the cnv
  cnv.position((windowWidth - cnvWidth) / 2, (windowHeight - cnvHeight) / 2);
  scale(cnvWidth / widthInPixel, cnvHeight / heightInPixel);
}

function drawUiHub() {
  drawHealthBar();
  drawCurrentLevel();
  // drawBossStatus();
  timeSpent = millis() - startTime;
  drawTimer();
}

function drawHealthBar() {
  const iconSize = 40;
  const iconPadding = 15;
  // Draw current HP
  for (let h = 0; h < player.hp; h++) {
    image(heartImg, hPadding + h * (iconSize + iconPadding), vPadding, iconSize, iconSize);
  }

  // Draw lost HP
  for (let dh = 0; dh < player.maxHp - player.hp; dh++) {
    image(damagedHeartImg, hPadding + (dh + player.hp) * (iconSize + iconPadding), vPadding, iconSize, iconSize);
  }
}

function drawCurrentLevel() {
  fill(255);
  stroke(0);
  strokeWeight(5);
  textFont(uiFont, uiTextSize);
  textAlign(LEFT, BOTTOM);
  text(`Level: ${currentRoomIndex} / ${rooms.length - 5}`, hPadding, heightInPixel - vPadding);

}

function drawBossStatus(bossObj) {
  if (!isBossStage) return;
  const hpPercentage = bossObj.hp / bossObj.maxHp;
  const positionX = widthInPixel / 2 - bossHpWidth / 2;
  const bossHpWidth = 400;
  const bossHpHeight = 30;
  const bossHpCorner = 10;

  // Draw HP bar background
  stroke(0);
  strokeWeight(3);
  fill(230, 127); // 127 makes it 50% transparent
  rect(positionX, vPadding, bossHpWidth, bossHpHeight, bossHpCorner);

  // Draw HP bar
  noStroke();
  adjustBossStatusColor(hpPercentage);
  const margin = 5;
  const barWidth = (bossHpWidth - margin * 2) * hpPercentage;
  rect(positionX + margin, vPadding + margin, barWidth, bossHpHeight - margin * 2);

  // Draw percentage markers
  for (let i of [0.25, 0.5, 0.75]) {
    let lineX = positionX + bossHpWidth * i;
    line(lineX, vPadding, lineX, vPadding + bossHpHeight);
  }
}

function adjustBossStatusColor(percentage) {
  if (percentage > 0.5) {
    fill('green');
  } else if (percentage > 0.25) {
    fill(255, 165, 0);
  } else {
    fill('red');
  }
}

function drawTimer() {
  let totalSecs = floor(timeSpent / 1000);
  let mins = floor(totalSecs/60);
  let secs = totalSecs % 60;

  fill(255);
  stroke(0);
  strokeWeight(5);
  textFont(uiFont, uiTextSize);
  textAlign(RIGHT, BOTTOM);
  text(`Time Taken:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`, widthInPixel - hPadding, heightInPixel - vPadding);
}

