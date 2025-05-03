class Item {
  #ITEM_IMAGES = {
    "health": healthItemImg,
    "powerup": powerUpItemImg,
    "photo": photoItemImg,
  };

  #EFFECT_MAP = {
    "health": playerObj => playerObj.updateHp(1),
    "powerup": playerObj => playerObj.powerUp(),
    "photo": () => {},
  };

  position;
  #vel;
  #type;
  #gravity;
  #bounce;
  #image;
  size;
  #groundY;

  constructor(x, y, bossBtm, type) {
    this.position = createVector(x, y);
    this.#vel = createVector(0, 3);
    this.#type = type;
    this.#gravity = 0.2;
    this.#bounce = 0.4;
    this.#image = this.#ITEM_IMAGES[this.#type];
    console.log(this.#image);
    const itemHeight = heightInPixel / 24;
    const itemWidth = itemHeight * (this.#image.width / this.#image.height);
    this.size = createVector(itemWidth, itemHeight);
    this.#groundY = bossBtm - this.size.y;
  }

  update() {
    this.#applyGravity();
    this.#handleGroundCollision();
    this.position.add(this.#vel);
  }

  #applyGravity() {
    this.#vel.y += this.#gravity;
  }

  #handleGroundCollision() {
    if (this.position.y > this.#groundY) {
      this.position.y = this.#groundY;
      this.#vel.y *= -this.#bounce;
      
      if (Math.abs(this.#vel.y) < 0.5) this.#vel.y = 0;
    }
  }

  display() {
    image(this.#image, 
          this.position.x, this.position.y, 
          this.size.x, this.size.y);
  }

  applyEffect(playerObj) {
    this.#EFFECT_MAP[this.#type]?.(playerObj);
  }
  
  getType() {
    return this.#type;
  }
}