class FadeManager {
   constructor(fadeSpeed) {
      this.alpha = 0;          // Current mask transparency（0～1）
      this.speed = fadeSpeed;  // The variation per frame
      this.state = 'idle';     // 'idle' | 'fadingOut' | 'fadingIn'
      this._onMid = null;      // The callback called after completely fading out
   }

   /**
   * External call, start a fade out → callback → fade in
   * @param {Function} callback - The room-cutting callback performed when completely fading out
   */
   start(callback) {
      if (this.state !== 'idle') return;
      this._onMid = callback;
      this.state = 'fadingOut';
   }

   /** Update the status and alpha per frame */
   update() {
      if (this.state === 'fadingOut') {
         this.alpha = min(1, this.alpha + this.speed);
         if (this.alpha >= 1) {
            this.state = 'fadingIn';
            if (this._onMid) {
               this._onMid();
               this._onMid = null;
            }
         }
      } else if (this.state === 'fadingIn') {
         this.alpha = max(0, this.alpha - this.speed);
         if (this.alpha <= 0) {
            this.state = 'idle';
         }
      }
   }

   /** It is called in draw() to draw a full-screen black mask */
   draw() {
      if (this.state === 'idle') return;
      push();
      noStroke();
      fill(0, this.alpha * 255);
      rect(0, 0, widthInPixel, heightInPixel);
      pop();
   }

   /** transition */
   isActive() {
      return this.state !== 'idle';
   }
}

window.FadeManager = FadeManager;
