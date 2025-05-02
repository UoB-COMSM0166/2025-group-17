class InstructionDisplayer {
  static #fadeDuration = 500;
  static #displayDuration = 1000;
  static #boxSize = 60;
  static #fontSize = 20;
  static #fontFamily = "monospace";

  static display(textContent, displayStartTime) {
    const alpha = this.#calculateAlpha(displayStartTime);
    if (alpha === null) return;

    console.log("Displaying instruction...");
    push();
    rectMode(CENTER);
    this.#drawDialogBox(alpha);
    this.#drawHighlightEdges(alpha);
    this.#drawInstructionText(textContent, alpha);
    pop();
  }

  static #calculateAlpha(displayStartTime) {
    const elapsedTime = millis() - displayStartTime;
    const fadeInEnd = this.#fadeDuration;
    const fadeOutStart = this.#fadeDuration + this.#displayDuration;
    const animationEnd = 2 * this.#fadeDuration + this.#displayDuration;

    if (elapsedTime < fadeInEnd) {
      return map(elapsedTime, 0, fadeInEnd, 0, 255);
    } 
    else if (elapsedTime < fadeOutStart) {
      return 255;
    } 
    else if (elapsedTime < animationEnd) {
      return map(elapsedTime, fadeOutStart, animationEnd, 255, 0);
    }
    return null;
  }

  static #drawDialogBox(alpha) {
    fill(0, alpha / 2);
    noStroke();
    rect(
      widthInPixel / 2, 
      heightInPixel / 3 + this.#boxSize / 2, 
      widthInPixel, 
      this.#boxSize
    );
  }

  static #drawHighlightEdges(alpha) {
    fill(255, 255, 255, alpha / 2);
    rect(widthInPixel / 2, heightInPixel / 3, widthInPixel, 1);
    rect(widthInPixel / 2, heightInPixel / 3 + this.#boxSize, widthInPixel, 1);
  }

  static #drawInstructionText(textContent, alpha) {
    fill(255, alpha);
    textAlign(CENTER, CENTER);
    textFont(this.#fontFamily, this.#fontSize);
    text(
      textContent, 
      widthInPixel / 2, 
      heightInPixel / 3 + this.#boxSize / 2
    );
  }
}