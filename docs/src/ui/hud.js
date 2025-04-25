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

function drawUiHud(playerObj, currentRoomId) {
  drawHealthBar(playerObj);
  drawCurrentLevel(currentRoomId);
  timeSpent = millis() - startTime;
  drawTimer(timeSpent);
}

function drawHealthBar(playerObj) {
  const iconSize = 40;
  const iconPadding = 15;
  // Draw current HP
  for (let h = 0; h < playerObj.hp; h++) {
    image(heartImg, hPadding + h * (iconSize + iconPadding), vPadding, iconSize, iconSize);
  }

  // Draw lost HP
  for (let dh = 0; dh < playerObj.maxHp - playerObj.hp; dh++) {
    image(damagedHeartImg, hPadding + (dh + playerObj.hp) * (iconSize + iconPadding), vPadding, iconSize, iconSize);
  }
}

function drawCurrentLevel(currentRoomId) {
  fill(255);
  stroke(0);
  strokeWeight(5);
  textFont(uiFont, uiTextSize);
  textAlign(LEFT, BOTTOM);
  text(`Level: ${currentRoomId} / ${rooms.length - 6}`, hPadding, heightInPixel - vPadding);
}

function drawBossStatus(bossObj) {
  const hpPercentage = bossObj.hp / bossObj.maxHp;
  const positionX = widthInPixel / 2 - bossHpBarImg.width / 2;

  const vPadding = 20;
  bossHpBarImg.loadPixels();
  bossHpImg.loadPixels();
  
  const currentHpWidth = Math.floor(bossHpImg.width * hpPercentage);

  // Create a new image with only the current HP
  let hpPercentageImg = createImage(bossHpImg.width, bossHpImg.height);
  hpPercentageImg.copy(
    bossHpImg, 
    0, 0, currentHpWidth, bossHpImg.height,
    0, 0, currentHpWidth, bossHpImg.height
  );
  
  // Compute drawing location (excluding the boss icon)
  // TODO: Update it with the new HP bar
  const hpDrawX = positionX + 40;
  const hpDrawY = vPadding + 10;

  // Draw HP background
  tint(127);
  image(bossHpImg, hpDrawX, hpDrawY);
  noTint();

  // Draw hit effects
  const flashFrame = 21;
  bossObj.applyHitEffect(flashFrame);
  image(hpPercentageImg, hpDrawX, hpDrawY);
  noTint();

  image(bossHpBarImg, positionX, vPadding);
}

function drawTimer(timeSpent) {
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

function displayInstruction(textContent, displayStartTime) {
  const alpha = calculateAlpha(displayStartTime);
  if (alpha === null) return;
  
  console.log("Displaying instruction..");
  drawDialogBox(alpha);
  drawHighlightEdges(alpha);
  drawInstructionText(textContent, alpha);
}

function calculateAlpha(displayStartTime) {
  const fadeDuration = 500;
  const displayDuration = 1000;
  let elapsedTime = millis() - displayStartTime;
  
  if (elapsedTime < fadeDuration) {
    return map(elapsedTime, 0, fadeDuration, 0, 255);
  } 
  else if (elapsedTime < fadeDuration + displayDuration) {
    return 255;
  } 
  else if (elapsedTime < fadeDuration * 2 + displayDuration) {
    return map(
      elapsedTime, 
      fadeDuration + displayDuration, 
      fadeDuration * 2 + displayDuration, 
      255, 0
    );
  }
  return null;
}

function drawDialogBox(alpha) {
  const boxSize = 60;
  fill(0, alpha / 2);
  noStroke();
  rect(widthInPixel / 2, heightInPixel / 3 + boxSize / 2, widthInPixel, boxSize);
}

function drawHighlightEdges(alpha) {
  const boxSize = 60;
  fill(255, 255, 255, alpha / 2);
  rect(widthInPixel / 2, heightInPixel / 3, widthInPixel, 1);
  rect(widthInPixel / 2, heightInPixel / 3 + boxSize, widthInPixel, 1);
}

function drawInstructionText(textContent, alpha) {
  const boxSize = 60;
  fill(255, alpha);
  textAlign(CENTER, CENTER);
  textFont("monospace", 20);
  text(textContent, widthInPixel / 2, heightInPixel / 3 + boxSize / 2);
}

