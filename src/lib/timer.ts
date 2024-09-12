import GLib from "gi://GLib";
import { FitBreaksIndicator } from "./indicator.js";
import { notify } from "./notification.js";

export class Timer {
  private indicator: FitBreaksIndicator;
  private timerDuration = 1800; // 30 min
  private interval?: GLib.Source;
  private exercises = ["Stretch neck"];

  constructor(indicator: FitBreaksIndicator) {
    this.indicator = indicator;
  }

  startTimer() {
    let secondsLeft = this.timerDuration;
    this.printTimer(secondsLeft);
    this.interval = setInterval(() => {
      secondsLeft -= 1;
      this.printTimer(secondsLeft);
      if (secondsLeft <= 0) this.restart();
    }, 1000);
  }

  private formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const min = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    if (hours !== "00") {
      return hours + ":" + min + ":" + sec;
    } else {
      return min + ":" + sec;
    }
  }

  private printTimer(seconds: number) {
    if (!this.indicator.timerLabel) return;
    this.indicator.timerLabel.text = this.formatTime(seconds);
  }

  private restart() {
    this.removeTimer();
    this.exercises[0] &&
      notify(this.exercises[0]).finally(() => this.startTimer());
  }

  removeTimer() {
    if (this.interval) clearInterval(this.interval);
  }
}
