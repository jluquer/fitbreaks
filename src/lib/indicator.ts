import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";

import { SystemIndicator } from "resource:///org/gnome/shell/ui/quickSettings.js";
import { gettext as _ } from "resource:///org/gnome/shell/extensions/extension.js";

import { formatTime, getIcon } from "./utils.js";
import { FitIcon } from "./constants.js";
import { FitBreaksToggle } from "./toggle.js";
import { Timer } from "./timer.js";
import { notifyExercise } from "./notification.js";

export const FitBreaksIndicator = GObject.registerClass(
  class FitBreaksIndicator extends SystemIndicator {
    indicator!: St.Icon;
    timerLabel!: St.Label;
    private toggle: FitBreaksToggle;
    private timerEnabled = false;
    private timer = new Timer();
    private listeners?: number[];

    constructor(path: String) {
      super();
      this.toggle = new FitBreaksToggle(path);
      this.indicator = this._addIndicator();
      this.addIcon(path);
      this.addLabel();
      this.handleVisibility([this.timerLabel, this.indicator]);
      this.quickSettingsItems.push(this.toggle);
      this.toggle.connect("clicked", this.onClickQuickToggle.bind(this));
    }

    private addIcon(path: String) {
      this.indicator.gicon = getIcon(path, FitIcon);
    }

    private addLabel() {
      this.timerLabel = new St.Label({
        y_expand: true,
        y_align: Clutter.ActorAlign.CENTER,
      });
      this.add_child(this.timerLabel);
    }

    private handleVisibility(elements: any[]) {
      elements.forEach((element) => {
        if (!element) return;
        this.toggle.bind_property(
          "checked",
          element,
          "visible",
          GObject.BindingFlags.SYNC_CREATE,
        );
      });
    }

    private onClickQuickToggle() {
      this.timerEnabled = !this.timerEnabled;
      this.timerEnabled ? this.activateTimer() : this.disableTimer();
    }

    private activateTimer() {
      this.listeners = [
        this.timer.connect("tic", (_, seconds) => {
          console.log("seconds", seconds);
          this.timerLabel.text = formatTime(seconds);
        }),
        this.timer.connect("stop", () =>
          notifyExercise("Stretch neck").finally(
            () => this.timerEnabled && this.timer.start(),
          ),
        ),
      ];
      this.timer.start();
    }

    private disableTimer() {
      this.listeners?.forEach((listener) => this.timer.disconnect(listener));
      this.timer.removeTimer();
    }
  },
);

export type FitBreaksIndicator = InstanceType<typeof FitBreaksIndicator>;
