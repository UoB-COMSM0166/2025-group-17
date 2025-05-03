class ShooterBullet {
      constructor(x, y, direction, dmg = 1, speed = 5, bulletImg) {
            this.position = createVector(x, y);
            this.direction = direction.copy().normalize();
            this.damage = dmg;
            this.speed = speed;
            this.image = bulletImg;
            const bulletWidth = 30;
            // const bulletHeight = bulletWidth * (bulletImg.height / bulletImg.width);
            const bulletHeight = bulletWidth;
            this.size = createVector(bulletWidth, bulletHeight);
            this.angle = 0;
      }

      update() {
            this.position.add(p5.Vector.mult(this.direction, this.speed));
            this.angle += 0.1;
      }

      display() {
            push();
            translate(this.position.x, this.position.y);
            rotate(this.angle);
            image(this.image, 0, 0, this.size.x, this.size.y);
            pop();
      }
}
