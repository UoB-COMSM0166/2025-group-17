class Pig {
    constructor(x, y) {
        this.hp = 200;
        this.speed = 1.2;
        this.alive = true;

        //追踪与射击控制
        this.minDistance = 150; // 距离小于这个值就停止靠近
        this.shootCoolDown = 90; // 射击冷却帧数（约1.5秒）
        this.shootTimer = 0;

        //精灵图设置：
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
    }

    update() {
        if (!this.alive) return;
    }
}