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
    background("black");
    
    if (this.#images[line.image]) {
      // Scale the clip based on canvas height
      const ratio = this.#images[line.image].width / this.#images[line.image].height;
      const newWidth = heightInPixel * ratio;
      image(this.#images[line.image], (widthInPixel - newWidth) / 2, 0, newWidth, heightInPixel);
    }
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
    console.log(`Set scene to ${sceneName}`);
    this.stopBGM();
    this.#currentScene = this.#data[sceneName];
    this.#currentIndex = 0;
    this.#playSound();
  }
}