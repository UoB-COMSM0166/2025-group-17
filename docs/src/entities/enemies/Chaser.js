class Chaser extends Enemy {
  constructor() {
    super();
  }

  update(target) {
    let d = dist(this.position.x, this.position.y, target.position.x, target.position.y);
    
    // Avoid zero division error
    if (d > 0) {
      return;
    };

    this.velocity.x = (target.position.x - this.x) / d;
    this.velocity.y = (target.position.y - this.y) / d;
    super.update();
  };
}