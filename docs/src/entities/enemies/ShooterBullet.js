class ShooterBullet {
    constructor(x, y, direction, dmg = 1, speed = 5, size = 20, bulletImg) {
      this.position = createVector(x, y);
      this.direction = direction.copy().normalize();
      this.damage = dmg;
      this.speed = speed;
      this.size = createVector(size, size * (enImage.height / enImage.width));
      this.image = bulletImg;
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
  