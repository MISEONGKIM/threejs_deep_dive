import * as THREE from "three";

export class Timer extends THREE.Clock {
  constructor({ startAt, timeEl }) {
    super();
    this.startAt = startAt;
    this.timeEl = timeEl;
  }

  update() {
    if (!this.timeEl) return;
    this.currentTime = Math.max(
      0,
      this.startAt - Math.floor(this.getElapsedTime())
    );

    this.timeEl.textContent = this.currentTime;
  }
}
