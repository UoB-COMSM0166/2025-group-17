class InputHandler {
  #currentRoom;
  constructor(roomObj) {
    this.#currentRoom = roomObj;
    this.collisionDetector = new CollisionDetector();
    this.lastCollisionTime = millis();
    // if (!this.fadeMgr) this.fadeMgr = window.fadeMgr;
    this.fadeMgr = window.fadeMgr;
  }

  update(playerObj) {
    this.#currentRoom.update(playerObj);
    this.#currentRoom.display(playerObj);
    playerObj.updateVelocity();

    // Predict the next position
    const nextX = playerObj.position.x + playerObj.velocity.x;
    const nextY = playerObj.position.y + playerObj.velocity.y;

    // Construct a temporary object for collision determination (it must include velocity; otherwise, an error will be reported)
    const tempPlayer = {
      position: createVector(nextX, nextY),
      size: playerObj.size,
      velocity: playerObj.velocity
    };

    // Detect collisions using predicted positions
    const collideWithEnemies = this.collisionDetector.detectPlayerCollision(tempPlayer, this.#currentRoom.enemies);
    const collideWithObstacles = this.collisionDetector.detectPlayerCollision(tempPlayer, this.#currentRoom.obstacles);
    const playerHitBoundary = this.collisionDetector.isHitBoundary(tempPlayer);

    if (!collideWithEnemies && !collideWithObstacles && !playerHitBoundary) {
      playerObj.updatePosition();
    } else {
      playerObj.resetVelocity();

      // Player loses health when colliding with the enemies
      if (collideWithEnemies) playerObj.updateHp(-1, 90);
    }

    this.collisionDetector.handleEnemyCollision(this.#currentRoom.enemies, this.#currentRoom.obstacles);
    this.updateBullets(playerObj);
    this.collisionDetector.detectBulletCollision(playerObj.bullets, this.#currentRoom.enemies, this.#currentRoom.obstacles);
    this.#moveToNextRoom(playerObj);
  }

  handlePlayerShooting(playerObj) {
    const direction = key.toLowerCase();
    if (direction === 'w' || direction === 'a' || direction === 's' || direction === 'd') {
      console.log("Bullet input detected!");
      playerObj.shoot(direction);
    }
  }

  updateBullets(playerObj) {
    playerObj.bullets.forEach((b, bIndex) => {
      b.update();
      if (b.shouldBeRemoved()) playerObj.bullets.splice(bIndex, 1);
      else b.display();
    });
  }

  #moveToNextRoom(playerObj, tolerance = playerObj.size.x) {
    if (!this.#currentRoom.checkClearCondition()) return;

    const playerMidX = playerObj.position.x + playerObj.size.x / 2;
    const playerMidY = playerObj.position.y + playerObj.size.y / 2;
    const doorX = this.#currentRoom.door.position.x;
    const doorY = this.#currentRoom.door.position.y + this.#currentRoom.door.size.y / 2;

    if (dist(playerMidX, playerMidY, doorX, doorY) < tolerance) {
      console.log("Move to the next room!");
      this.fadeMgr.start(() => this.#loadRoom());
    }
  }

  #loadRoom() {
    if (this.isGameCompleted()) {
      console.log("Game Completed!");
      return;
    }
    const nextRoomId = this.#currentRoom.getCurrentRoomId() + 1;

    // Only reset player HP after the tutorial
    const newHp = (nextRoomId === 1) ? 3 : player.getHp();
    player.resetRoomState(newHp);
  
    // Load room
    if (nextRoomId === 1) {
      const randomRoomId = random([1, 2, 3, 4, 5, 6]);
      room.setup(roomData[randomRoomId]);      
    } 
    else if (nextRoomId === 2) {
      room.setup(roomData[7]);
    }
    else if (nextRoomId === 3) {
      room.setup(roomData[8]);
    }
    else if (nextRoomId === 4) {
      const randomRoomId = random([9, 10, 11, 12]);
      room.setup(roomData[randomRoomId]);
    } else if (nextRoomId === 5) {
      room.setup(roomData[13]);
    } else if (nextRoomId === 6) {
      room.setup(roomData[14]);
    } else if (nextRoomId === 7) {
      room.setup(roomData[15]);
    }
  }

  getCurrentRoomId() { return this.#currentRoom.getCurrentRoomId(); }
  // getCurrentRoomData() { return this.#currentRoom.getCurrentRoomData(); }
  getCurrentLevelId() { return this.#currentRoom.getCurrentLevelId(); }
  getCurrentRoomNo() { return this.#currentRoom.getCurrentRoomNo(); }

  isGameCompleted() {
    const maxCurrentRoomId = this.#getMaxCurrentRoomId(rawRoomData);
    
    if (this.#currentRoom.getCurrentRoomId() >= maxCurrentRoomId && this.#currentRoom.checkClearCondition()) {
      return true;
    }
    return false;
  }

  #getMaxCurrentRoomId(rawRoomData) {
    let maxRoomId = -Infinity;
    for (const room of rawRoomData.rooms) {
        if (room.currentRoomId > maxRoomId) {
            maxRoomId = room.currentRoomId;
        }
    }
    return maxRoomId;
  }
}
