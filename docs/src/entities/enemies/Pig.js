class Pig {
    #isDead;

    constructor(x, y, pigImg) {
        this.image = pigImg;

        this.position = createVector(x, y);
        this.size = createVector(heightInPixel / 4, heightInPixel / 4);
        this.hp = 400;
        this.isHurt = false;
        this.hitFrame = 0;
        //this.speed = 1.2;
        // ❕速度需要以 velocity命名，否则碰撞检测isHitBoundary找不到变量
        this.velocity = createVector(random([-1.2, 1.2]), random([-1.2, 1.2]));

        this.minDistance = 150; // 距离小于这个值就停止靠近
        this.shootCoolDown = 90; // 射击冷却帧数（约1.5秒）
        this.shootTimer = 0;
        this.bullets = [];
        this.#isDead = false;

        /*
        //精灵图设置：(创新)
        this.sprite = new Sprite(x, y, 50, 50); //物理碰撞盒子
        this.sprite.rotationLock = true; //锁定旋转
        this.sprite.scale = 1;
        this.sprite.spriteSheet = pigImage; //精灵图加载
        this.sprite.anis.frameSize = [96, 160]; //精灵图每帧大小
        this.sprite.anis.frameDelay = 6;
        this.sprite.addAnis({
            idle: { row: 0, frames: [0] }, //行数，帧数
            walk: { row: 0, frames: 4 } //行数，帧数
        });
        this.sprite.changeAni("idle"); //设置动画
        */
    }

    update() {
        if (this.hp <= 0) return;

        const pigCenter = this.sprite.position.copy();
        const playCenter = p5.Vector.add(player.position, player.size.copy().mult(0.5));
        const direction = p5.Vector.sub(playCenter, pigCenter);
        const distanceToPlayer = direction.mag(); // 计算与玩家的距离

        //判断距离，决定是否接近
        if (distanceToPlayer > this.minDistance) {
            direction.normalize(); // 归一化方向向量
            this.sprite.vel.x = direction.x * this.speed; //设置速度
            this.sprite.vel.y = direction.y * this.speed;
            this.sprite.changeAni("walk"); //切换动画
        } else {
            this.sprite.vel.set(0, 0); //停止移动
            this.sprite.changeAni("idle");
        }

        //射击逻辑
        if (this.shootTimer <= 0) {
            this.shootAt(playCenter); //射击
            this.shootTimer = this.shootCoolDown; //重置冷却时间
        } else {
            this.shootTimer--; //减少冷却时间
        }

        // 子弹更新 + 撞墙清除
        this.bullets.forEach(b => b.update());
        this.detectPlayerCollision();
        this.bullets = this.bullets.filter(b => !this.isBulletOutOfBounds(b));
        this.checkPlayerCollisionDirect();
        // 碰撞检测,障碍物
        this.detectObstacleCollision();

    }

    shootAt(targetPos) {
        const origin = this.sprite.position.copy();
        const dir = p5.Vector.sub(targetPos, origin).normalize();

        //更换子弹贴图
        const bullet = new ShooterBullet(
            origin.x, origin.y,
            dir.copy(),
            1, // 伤害
            3, // 尺寸
            BossBulletImgL3
        );
        this.bullets.push(bullet);
    }

    detectBulletCollision(bulletArr) {
        bulletArr.forEach((bulletObj, bulletIndex) => {
            if (this.checkBulletCollision(bulletObj)) {
                this.takeDamage(bulletObj.damage);
                this.isHurt = true;
                bulletArr[bulletIndex].markAsHit(!this.#isDead);
            }
        });
    }

    checkBulletCollision(bullet) {
        return (
            bullet.position.x < this.position.x + this.size.x &&
            bullet.position.x + bullet.size.x > this.position.x &&
            bullet.position.y < this.position.y + this.size.y &&
            bullet.position.y + bullet.size.y > this.position.y
        );
    }

    detectPlayerCollision() {
        this.bullets = this.bullets.filter(b => {
            const collided = (
                b.position.x < player.position.x + player.size.x &&
                b.position.x + b.size.x > player.position.x &&
                b.position.y < player.position.y + player.size.y &&
                b.position.y + b.size.y > player.position.y
            );
            if (collided) {
                player.updateHp(-b.damage, 90);
                return false;
            }
            return true;
        });
    }

    detectObstacleCollision() {
        this.bullets = this.bullets.filter(b => {
            for (const obs of this.obstacles) {
                if (
                    b.position.x < obs.position.x + obs.size.x &&
                    b.position.x + b.size.x > obs.position.x &&
                    b.position.y < obs.position.y + obs.size.y &&
                    b.position.y + b.size.y > obs.position.y
                ) return false;
            }
            return true;
        });
    }

    checkPlayerCollision(bullet) {
        return (
            bullet.position.x < player.position.x + player.size.x &&
            bullet.position.x + bullet.size.x > player.position.x &&
            bullet.position.y < player.position.y + player.size.y &&
            bullet.position.y + bullet.size.y > player.position.y
        );
    }

    checkPlayerCollisionDirect() {
        const p = player;
        const s = this;

        const collided =
            p.position.x < s.position.x + s.size.x &&
            p.position.x + p.size.x > s.position.x &&
            p.position.y < s.position.y + s.size.y &&
            p.position.y + p.size.y > s.position.y;

        if (collided) {
            const pushDir = p5.Vector.sub(p.position.copy().add(p.size.x / 2, p.size.y / 2),
                s.position.copy().add(s.size.x / 2, s.size.y / 2))
                .normalize().mult(5);

            p.position.add(pushDir);
            p.position.x = constrain(p.position.x, leftBoundary, rightBoundary - p.size.x);
            p.position.y = constrain(p.position.y, topBoundary, bottomBoundary - p.size.y);

            player.updateHp(-1, 90);
        }
    }

    isBulletOutOfBounds(b) {
        return (
            b.position.x < leftBoundary || b.position.x > rightBoundary ||
            b.position.y < topBoundary || b.position.y > bottomBoundary
        );
    }

    takeDamage(damage) {
        this.hp = max(0, this.hp - damage);
        if (this.hp <= 0) this.#markAsDead();
    }
    #markAsDead() {
        if (this.#isDead) return;
        this.#isDead = true;
    }
    shouldBeRemoved() {
        if (this.#isDead) return true;
        return false;
    }

    display() {
        // ❕模仿Enemy里的显示逻辑，先显示静态图，可能不对
        image(this.image, this.position.x, this.position.y, this.size.x, this.size.y);


        if (!this.alive) return;
        this.bullets.forEach(b => b.display());

        // 显示狙击线（冷却剩余 < 20 帧时才显示）
        if (this.shootTimer < 20) this.displayAimLine();

        // 敌人自身已由 p5play 自动渲染
    }

    displayAimLine() {
        const targetCenter = p5.Vector.add(player.position, player.size.copy().mult(0.5));
        const dir = p5.Vector.sub(targetCenter, this.sprite.position).normalize();
        const offset = dir.copy().mult(25); // 起点前移一点点
        const start = this.sprite.position.copy().add(offset);

        push();
        strokeWeight(2);
        stroke(255, 0, 0, map(this.shootTimer, 0, 20, 255, 0)); // 越接近射击越暗
        line(start.x, start.y, end.x, end.y);
        pop();
    }
}
