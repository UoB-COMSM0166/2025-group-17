class PolicyDisplayer {
  static config = {
    title: "In-Game Data Usage Policy",
    content: [
      "By interacting with any save point, you consent to the collection of anonymous gameplay data, specifically: \n- Your current progress (current level and room); \n- Your current HP. \nData is only collected to restore your in-game progress. It will be stored locally on your device, never uploaded to the cloud, and never shared with third parties. \nYou can choose not to use save points if you prefer not to have this data collected."
    ],
    styles: {
      background: [0, 0, 0],
      titleSize: 32,
      bodySize: 18,
      titleColor: [255],
      bodyColor: [200]
    }
  };

  static display() {
    push();
    background(...this.config.styles.background);
    textWrap(WORD);

    // Draw the title
    fill(...this.config.styles.titleColor);
    textFont('monospace', this.config.styles.titleSize);
    textStyle(BOLD);
    text(this.config.title, widthInPixel/8, heightInPixel/6, 3*widthInPixel/4);

    // Disclaim
    textLeading(30);
    fill(...this.config.styles.bodyColor);
    textFont('monospace', this.config.styles.bodySize);
    textStyle(NORMAL);
    text(this.config.content, widthInPixel/8, heightInPixel/3, 3*widthInPixel/4);
    pop();
  }
}