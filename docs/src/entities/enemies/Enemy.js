const enemySize = 20;
const chaserSize = 30;
const shootSize = 25;

class Enemy {
  constructor(xPosition, yPosition, hp, speed, attack) {
    this.xPos = xPosition;
    this.yPos = yPosition;
    this.hp = hp;
    this.speed = speed;
    this.atk = attack;
  };

  display() {
    fill('green');
    ellipse(this.xPos, this.yPos, enemySize);
  };
}

class ChasingShooter extends Enemy {

}

class AtkType {
  
}

class ChasingType {

}
