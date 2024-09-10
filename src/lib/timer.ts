import GLib from "gi://GLib";
import { FitBreaksIndicator } from "./indicator.js";

export class Timer {
  private indicator: FitBreaksIndicator;
  private timerDuration = 1800; // 30 min
  private timeouts: number[] = [];

  constructor(indicator: FitBreaksIndicator) {
    this.indicator = indicator;
  }

  startTimer() {
    this.removeTimer();

    let timerDelay = this.timerDuration;

    let secondsLeft = timerDelay;
    this.printTimer(secondsLeft);
    this.timeouts = [
      GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
        secondsLeft -= 1;
        this.printTimer(secondsLeft);
        return GLib.SOURCE_CONTINUE;
      }),
      GLib.timeout_add(GLib.PRIORITY_DEFAULT, timerDelay * 1000, () => {
        this.removeTimer();
        return GLib.SOURCE_REMOVE;
      }),
    ];
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

  removeTimer() {
    this.timeouts.forEach((t) => GLib.Source.remove(t));
    this.timeouts = [];
  }
}
