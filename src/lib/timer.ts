import GLib from "gi://GLib";
import GObject from "gi://GObject";

export const Timer = GObject.registerClass(
  {
    Signals: {
      tic: {},
      finish: {},
    },
  },
  class Timer extends GObject.Object {
    private timerDuration = 1800; // 30 min
    private interval?: GLib.Source;

    startTimer() {
      let secondsLeft = this.timerDuration;
      this.emit("tic", secondsLeft);
      this.interval = setInterval(() => {
        secondsLeft -= 1;
        this.emit("tic", secondsLeft);
        if (secondsLeft <= 0) this.restart();
      }, 1000);
    }

    private restart() {
      this.removeTimer();
      this.emit("finish");
    }

    removeTimer() {
      if (this.interval) clearInterval(this.interval);
    }
  },
);

export type Timer = InstanceType<typeof Timer>;
