function preload() {
  uiFont = loadFont('assets/fonts/PressStart2P.ttf');
  heart = loadImage('assets/icons/full_heart.png');
  damagedHeart = loadImage('assets/icons/empty_heart.png');
  startMenuImg = loadImage('assets/background/menu_start.png');
  closedDoorImg = loadImage('assets/door/close-right.png');
  openDoorImg = loadImage('assets/door/open-right.png');

  //load obstacles images
  //obstacleImages.push(loadImage('assets/obstacles/level1/pillow1.png'));
  //obstacleImages.push(loadImage('assets/obstacles/level1/pillow2.png'));
  obstacleImages.push(loadImage('assets/obstacles/level1/PC-1.png'));
  obstacleImages.push(loadImage('assets/obstacles/level1/PC-2.png'));
  obstacleImages.push(loadImage('assets/obstacles/level1/PC-3.png'));
  obstacleImages.push(loadImage('assets/obstacles/level1/PC-4.png'));
  obstacleImages.push(loadImage('assets/obstacles/level1/PC-5.png'));
  ///obstacleImages.push(loadImage('assets/obstacles/level1/desk.png'));
  //obstacleImages.push(loadImage('assets/obstacles/level1/chair.png'));

  //load player image
  playerImage = loadImage('assets/character/Character.png');
  //load bullet image
  bulletImage = loadImage('assets/character/bullets/NormalBullet.png');
  //load enemy image
  enemyImage = loadImage('assets/enemies/level1/CCTV.png');
  savePointImg = loadImage('assets/savepoint/savepoint.jpg');

  rooms.forEach((room, i) => {
    room.backgroundImg = loadImage(room.background);
    rooms[i] = room; // Ensure the reference is updated
  });
}