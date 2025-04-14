class ScenePlayer {
  #data;
  #images;
  #sounds;
  #currentScene;
  #currentIndex = 0;
  #currentBGM = null;

  constructor(data, images, sounds) {
    this.#data = data;
    this.#images = images;
    this.#sounds = sounds;
    this.#currentScene = data.start;
  }

  draw() {
    if (this.isSceneComplete()) return;
    const line = this.#currentScene[this.#currentIndex];
    if (this.#images[line.image]) image(this.#images[line.image], 0, 0, widthInPixel, heightInPixel);
  }

  isSceneComplete() {
    return this.#currentIndex >= this.#currentScene.length;
  }

  next() {
    if (this.#currentIndex < this.#currentScene.length) {
      this.#currentIndex++;
      this.#playSound();
    }
  }

  #playSound() {
    if (this.#currentIndex >= this.#currentScene.length) return this.stopBGM();

    const line = this.#currentScene[this.#currentIndex];
    const sound = this.#sounds[line.sound.name];
    console.log(`Current scene line: ${line.label}, sound: ${line.sound.name}`);
    if (!sound) return;

    if (line.sound.type === "bgm") {
      if (this.#currentBGM === sound) return;
      this.stopBGM();
      this.#currentBGM = sound;
      this.#currentBGM.loop();
    } else if (line.sound.type === "se") {
      this.stopBGM();
      sound.play();
    }
  }

  stopBGM() {
    if (this.#currentBGM?.isPlaying()) {
      this.#currentBGM.stop();
      this.#currentBGM = null;
    }
  }

  setScene(sceneName) {
    this.stopBGM();
    this.#currentScene = this.#data[sceneName];
    this.#currentIndex = 0;
    this.#playSound();
  }
}