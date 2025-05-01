class Item {
  static #ITEM_IMAGES = {
    health: healthItemImg,
    powerup: powerUpItemImg,
    photo: photoItemImg,
  };

  static #EFFECT_MAP = {
    health: playerObj => playerObj.updateHp(1),
    powerup: playerObj => playerObj.powerUp(),
    photo: () => {},
  };

  #pos;
  #vel;
  #type;
  #gravity;
  #bounce;
  #image;
  #size;
  #groundY;

  constructor(x, y, bossBtm, type) {
    this.#pos = createVector(x, y);
    this.#vel = createVector(0, 3);
    this.#type = type;
    this.#gravity = 0.2;
    this.#bounce = 0.6;
    this.#image = Item.#ITEM_IMAGES[this.#type];
    this.#size = createVector(15, 15 * (this.#image.height / this.#image.width));
    this.#groundY = bossBtm - this.#size.y;
  }

  update() {
    this.#applyGravity();
    this.#handleGroundCollision();
    this.#pos.add(this.#vel);
  }

  #applyGravity() {
    this.#vel.y += this.#gravity;
  }

  #handleGroundCollision() {
    if (this.#pos.y > this.#groundY) {
      this.#pos.y = this.#groundY;
      this.#vel.y *= -this.#bounce;
      
      if (Math.abs(this.#vel.y) < 0.5) this.#vel.y = 0;
    }
  }

  display() {
    image(this.#image, 
          this.#pos.x, this.#pos.y, 
          this.#size.x, this.#size.y);
  }

  applyEffect(playerObj) {
    Item.#EFFECT_MAP[this.#type]?.(playerObj);
  }

  get left() { return this.#pos.x; }
  get right() { return this.#pos.x + this.#size.x; }
  get top() { return this.#pos.y; }
  get bottom() { return this.#pos.y + this.#size.y; }
}