class FadeManager {
   constructor(fadeSpeed) {
      this.alpha = 0;          // 当前遮罩透明度（0～1）
      this.speed = fadeSpeed;  // 每帧变化量
      this.state = 'idle';     // 'idle' | 'fadingOut' | 'fadingIn'
      this._onMid = null;      // 完全淡出后调用的回调
   }

   /**
   * 外部调用，开始一次淡出→回调→淡入
   * @param {Function} callback - 完全淡出时执行的切房间回调
   */
   start(callback) {
      if (this.state !== 'idle') return;
      this._onMid = callback;
      this.state = 'fadingOut';
   }

   /** 每帧更新状态和 alpha */
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

   /** draw() 里调用，绘制全屏黑色遮罩 */
   draw() {
      if (this.state === 'idle') return;
      push();
      noStroke();
      fill(0, this.alpha * 255);
      rect(0, 0, widthInPixel, heightInPixel);
      pop();
   }

   /** 是否在做过渡 */
   isActive() {
      return this.state !== 'idle';
   }
}

window.FadeManager = FadeManager;
