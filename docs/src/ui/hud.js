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

  // Centre the cnv
  cnv.position((windowWidth - cnvWidth) / 2, (windowHeight - cnvHeight) / 2);
  scale(cnvWidth / widthInPixel, cnvHeight / heightInPixel);
}

function drawUiHub() {
  // Reset the button positions to support proper resizing
  btnPause.position(cnv.x + width - hPadding, cnv.y + vPadding);
  drawHealthBar();
  drawCurrentLevel();
  drawBossStatus();
  timeSpent = millis() - startTime;
  drawTimer();
}

function drawHealthBar() {
  // Draw current HP
  for (let h = 0; h < player.hp; h++) {
    image(heart, hPadding + h * (iconSize + iconPadding), vPadding, iconSize, iconSize);
  }

  // Draw lost HP
  for (let dh = 0; dh < defaultHp - player.hp; dh++) {
    image(damagedHeart, hPadding + (dh + player.hp) * (iconSize + iconPadding), vPadding, iconSize, iconSize);
  }
}

function drawCurrentLevel() {
  fill(255);
  stroke(0);
  strokeWeight(5);
  textFont(uiFont, uiTextSize);
  textAlign(LEFT, BOTTOM);
//  text(`Level:${currentLevel}-${currentStage}`, hPadding, heightInPixel - vPadding);
  text(`Level:${currentRoomIndex + 1} = 1`, hPadding, heightInPixel - vPadding);

}

function drawBossStatus() {
  if (!isBossStage) return;
  let hpPercentage = boss.hp / boss.maxHp;
  let barX = (widthInPixel / 2) - (bossHpWidth / 2);

  // Draw HP bar background
  fill(0);
  rect(barX, vPadding, bossHpWidth, bossHpHeight, bossHpCorner);

  // Draw HP bar
  adjustBossStatusColor(hpPercentage);
  rect(barX, vPadding, bossHpWidth * hpPercentage, bossHpHeight);

  // Draw percentage markers
  for (let i of [0.25, 0.5, 0.75]) {
    let lineX = barX + bossHpWidth * i;
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

// // Add from feature_enemies_lyz_before0225
// function displayTutorial() {
//   fill(0);
//   textSize(14);
//   textAlign(CENTER);
  
//   text(tutorialMessages.join('\n'), widthInPixel / 2,  120);
// }

