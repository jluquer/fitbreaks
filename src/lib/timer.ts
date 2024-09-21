import GLib from "gi://GLib";
import GObject from "gi://GObject";

export const Timer = GObject.registerClass(
  {
    Signals: {
      tic: { param_types: [GObject.TYPE_UINT] },
      stop: {},
    },
  },
  class Timer extends GObject.Object {
    private timerDuration = 5; // 1800; // 30 min
    private interval?: GLib.Source;

    start() {
      let secondsLeft = this.timerDuration;
      this.emit("tic", secondsLeft);
      this.interval = setInterval(() => {
        secondsLeft -= 1;
        this.emit("tic", secondsLeft);
        if (secondsLeft <= 0) this.stop();
      }, 1000);
    }

    stop() {
      this.removeTimer();
      this.emit("stop");
    }

    removeTimer() {
      if (this.interval) clearInterval(this.interval);
    }
  },
);

export type Timer = InstanceType<typeof Timer>;
