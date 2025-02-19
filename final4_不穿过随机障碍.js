let player;
let speed = 5;
let move = { left: false, right: false, up: false, down: false };
let enemies = [];
let bullets = [];
let boss;
let bossAlive = true;
let obstacles = [];

let keys = {};

function setup() {
    createCanvas(600, 400);
	generateObstacles();
    player = { x: width / 2, y: height / 2, health: 100 };
	boss = { x: width / 2, y: 50, health: 500, attackCooldown: 150, dx: 2, dy: 1.5 };
    setInterval(spawnEnemy, 3000); // 每3秒生成一个敌人
    //setInterval(moveEnemies, 1000); // 每1秒更新敌人位置	
}

function draw() {
    background(0);
    drawPlayer();
	handlePlayerMovement();
	drawObstacles();
	//drawBoss();
	//bossAttack();
    //moveBoss();
	if (bossAlive) {
        drawBoss();
        moveBoss();
        bossAttack();
    }
    drawEnemies();
    updateBullets();
    drawBullets();
    checkCollisions();
    displayHealth();
    if (move.left) player.x -= speed;
    if (move.right) player.x += speed;
    if (move.up) player.y -= speed;
    if (move.down) player.y += speed;
	checkWinCondition();
}


function generateObstacles() {
    let numObstacles = 5; // 生成5个随机障碍物
    for (let i = 0; i < numObstacles; i++) {
        let obs = {
            x: random(50, width - 50),
            y: random(50, height - 50),
            w: random(30, 70),
            h: random(30, 70)
        };
        obstacles.push(obs);
    }
}

function drawObstacles() {
    fill(100, 100, 100);
    for (let obs of obstacles) {
        rect(obs.x, obs.y, obs.w, obs.h);
    }
}

function drawPlayer() {
    fill(0, 255, 0);
    ellipse(player.x, player.y, 20, 20);
}


function drawBoss() {
    fill(255, 0, 0);
    ellipse(boss.x, boss.y, 50, 50);
}




function drawEnemies() {
    fill(255, 0, 255);
    for (let enemy of enemies) {
        ellipse(enemy.x, enemy.y, 20, 20);
    }
}

//function drawBullets() {
 //   fill(255, 255, 0);
 //   for (let bullet of bullets) {
 //       ellipse(bullet.x, bullet.y, 5, 5);
 //   }
//}

function drawBullets() {
    fill(255, 255, 0);
    for (let bullet of bullets) {
        ellipse(bullet.x, bullet.y, bullet.size, bullet.size);
    }
}

function keyPressed() {
    keys[keyCode] = true;
    let newX = player.x;
    let newY = player.y;
    if (keyCode === UP_ARROW) newY -= 10;
    if (keyCode === DOWN_ARROW) newY += 10;
    if (keyCode === LEFT_ARROW) newX -= 10;
    if (keyCode === RIGHT_ARROW) newX += 10;
    
    if (!isCollidingWithObstacle(newX, newY) && newX >= 10 && newX <= width - 10 && newY >= 10 && newY <= height - 10) {
        player.x = constrain(newX, 10, width - 10);
        player.y = constrain(newY, 10, height - 10);
    }
    
	
    //if (key === ' ') shootBullet();
	if (key === 'w') shootBullet(0, -5); // 向上射击
    if (key === 's') shootBullet(0, 5);  // 向下射击
    if (key === 'a') shootBullet(-5, 0); // 向左射击
    if (key === 'd') shootBullet(5, 0);  // 向右射击
    if (key === 'e') upgradeBullet();
}

function keyReleased() {
    keys[keyCode] = false;
}

//function shootBullet() {
//    bullets.push({ x: player.x, y: player.y, dx: 5 });
//}

function shootBullet(dx, dy) {
    let bullet = { x: player.x, y: player.y, dx: dx, dy: dy, size: 5, damage: 10 };
    bullets.push(bullet);
}


function updateBullets() {
    for (let bullet of bullets) {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
    }
}

function moveBoss() {
    boss.x += boss.dx;
    boss.y += boss.dy;
    
    // 碰到边界反弹
    if (boss.x <= 50 || boss.x >= width - 50) {
        boss.dx *= -1;
    }
    if (boss.y <= 50 || boss.y >= height / 2) {
        boss.dy *= -1;
    }
}

function bossAttack() {
    boss.attackCooldown--;
    if (boss.attackCooldown <= 0) {
        fireBossLaser();
        boss.attackCooldown = 150; // 重新冷却时间
    }
}

function fireBossLaser() {
    stroke(255, 0, 0);
    strokeWeight(6);
    // 四个方向同时发射激光
    line(boss.x, boss.y, boss.x, height);
    line(boss.x, boss.y, boss.x, 0);
    line(boss.x, boss.y, 0, boss.y);
    line(boss.x, boss.y, width, boss.y);
    
    if (abs(player.x - boss.x) < 25 || abs(player.y - boss.y) < 25) {
        player.health -= 20;
        if (player.health <= 0) {
            alert('游戏失败！');
            noLoop();
        }
    }
}

//function spawnEnemy() {
 //   enemies.push({ x: random(width), y: random(height), health: 50, dx: random(-2, 2), dy: random(-2, 2) });
//}

function spawnEnemy() {
    if (bossAlive) {
        enemies.push({ x: random(50, width - 50), y: random(50, height - 50), health: 50 });
    }
}

function moveEnemies() {
    for (let enemy of enemies) {
        enemy.x += enemy.dx * 10;
        enemy.y += enemy.dy * 10;
        
        // 限制敌人不会移出边界
        enemy.x = constrain(enemy.x, 0, width);
        enemy.y = constrain(enemy.y, 0, height);
        
        // 随机变换方向
        if (random() < 0.2) {
            enemy.dx = random(-2, 2);
            enemy.dy = random(-2, 2);
        }
    }
}

function handlePlayerMovement() {
    let newX = player.x;
    let newY = player.y;
    if (keys[UP_ARROW]) newY -= 3;
    if (keys[DOWN_ARROW]) newY += 3;
    if (keys[LEFT_ARROW]) newX -= 3;
    if (keys[RIGHT_ARROW]) newX += 3;
    
    if (!isCollidingWithObstacle(newX, newY) && newX >= 10 && newX <= width - 10 && newY >= 10 && newY <= height - 10) {
        player.x = constrain(newX, 10, width - 10);
        player.y = constrain(newY, 10, height - 10);
    }
}



function isCollidingWithObstacle(x, y) {
    for (let obs of obstacles) {
        if (x > obs.x && x < obs.x + obs.w && y > obs.y && y < obs.y + obs.h) {
            return true;
        }
    }
    return false;
}


//function checkCollisions() {
 //   for (let i = bullets.length - 1; i >= 0; i--) {
 //       for (let j = enemies.length - 1; j >= 0; j--) {
  //          let d = dist(bullets[i].x, bullets[i].y, enemies[j].x, enemies[j].y);
  //          if (d < 10) {
  //              enemies[j].health -= 20;
  //              bullets.splice(i, 1);
  //              if (enemies[j].health <= 0) {
 //                   enemies.splice(j, 1);
 //               }
 //               break;
 //           }
 //       }
 //   }
  //  for (let enemy of enemies) {
 //       if (dist(player.x, player.y, enemy.x, enemy.y) < 15) {
 //           player.health -= 10;
 //           if (player.health <= 0) {
  //              alert('游戏失败！');
 //               noLoop();
 //           }
 //       }
 //   }
//}

function checkCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let d = dist(bullets[i].x, bullets[i].y, boss.x, boss.y);
        if (bossAlive && d < 25) {
            boss.health -= bullets[i].damage;
            bullets.splice(i, 1);
            if (boss.health <= 0) {
                bossAlive = false;
                alert('你击败了Boss！');
            }
        }
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            let d = dist(bullets[i].x, bullets[i].y, enemies[j].x, enemies[j].y);
            if (d < 15) {
                enemies[j].health -= bullets[i].damage;
                bullets.splice(i, 1);
                if (enemies[j].health <= 0) {
                    enemies.splice(j, 1);
                }
                break;
            }
        }
    }
}

function checkWinCondition() {
    if (!bossAlive && enemies.length === 0) {
        alert('游戏通关！');
        noLoop();
    }
}



//function displayHealth() {
    //fill(255);
   // textSize(16);
  //  text(`HP: ${player.health}`, 10, 20);
//}

function displayHealth() {
    fill(255);
    textSize(16);
    text(`HP: ${player.health}`, 10, 20);
    if (bossAlive) {
        text(`Boss HP: ${boss.health}`, 10, 40);
    }
}