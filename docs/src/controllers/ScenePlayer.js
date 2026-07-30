class ScenePlayer {
  #data;
  #images;
  #sounds;
  #currentScene;
  #currentIndex = 0;
  #currentBGM = null;
  #noiseIntensity = 0.1;
  #loadingSounds = new Set();

  constructor(data, images, sounds) {
    this.#data = data;
    this.#images = images;
    this.#sounds = sounds;
    this.#currentScene = data.start;
  }

  draw() {
    if (this.isSceneComplete()) return;
    const line = this.#currentScene[this.#currentIndex];
    
    if (this.#images[line.image]) {  
      push();

      image(this.#images[line.image], 0, 0, widthInPixel, heightInPixel);
      this.#applyNoiseEffect();

      pop();
    }
  }

  #applyNoiseEffect() {
    loadPixels();
    for (let i = 0; i < pixels.length; i += 4) {
      const noiseVal = random(-255 * this.#noiseIntensity, 255 * this.#noiseIntensity);
      
      pixels[i]   = constrain(pixels[i] + noiseVal, 0, 255);   // R
      pixels[i+1] = constrain(pixels[i+1] + noiseVal, 0, 255); // G
      pixels[i+2] = constrain(pixels[i+2] + noiseVal, 0, 255); // B
    }
    updatePixels();
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
    if (!line.sound?.name) return;
    const soundName = line.sound.name;
    const sound = this.#sounds[soundName];
    if (sound) return this.#startSound(line, sound);
    if (this.#loadingSounds.has(soundName)) return;

    const folder = line.sound.type === 'bgm' ? 'assets/music/bgm' : 'assets/music/se';
    const soundPath = `${folder}/${soundName}.mp3`;
    this.#loadingSounds.add(soundName);
    loadSound(
      soundPath,
      loadedSound => {
        this.#loadingSounds.delete(soundName);
        this.#sounds[soundName] = loadedSound;
        if (this.#currentScene[this.#currentIndex] === line) {
          this.#startSound(line, loadedSound);
        }
      },
      error => {
        this.#loadingSounds.delete(soundName);
        console.warn(`Unable to load scene audio: ${soundPath}`, error);
      }
    );
  }

  #startSound(line, sound) {
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
    }
    this.#currentBGM = null;
  }

  setScene(sceneName) {
    this.stopBGM();
    this.#currentScene = this.#data[sceneName];
    this.#currentIndex = 0;
    this.#playSound();
  }
}