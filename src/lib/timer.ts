import Gio from "gi://Gio";
import GLib from "gi://GLib";
import GObject from "gi://GObject";
import { schemas } from "./constants.js";

export const Timer = GObject.registerClass(
  {
    Signals: {
      tic: { param_types: [GObject.TYPE_UINT] },
      stop: {},
    },
  },
  class Timer extends GObject.Object {
    private interval?: GLib.Source;
    private settings!: Gio.Settings;

    constructor(settings: Gio.Settings) {
      super();
      this.settings = settings;
    }

    private getTimerDuration() {
      const timerDuration = this.settings.get_uint(schemas.timerDuration);
      return timerDuration ? timerDuration * 60 : 5;
    }

    start() {
      let secondsLeft = this.getTimerDuration();
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
