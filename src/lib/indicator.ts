import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";

import { SystemIndicator } from "resource:///org/gnome/shell/ui/quickSettings.js";
import { gettext as _ } from "resource:///org/gnome/shell/extensions/extension.js";

import { getIcon } from "./utils.js";
import { FitIcon } from "./constants.js";
import { FitBreaksToggle } from "./toggle.js";
import { Timer } from "./timer.js";

export const FitBreaksIndicator = GObject.registerClass(
  class FitBreaksIndicator extends SystemIndicator {
    indicator!: St.Icon;
    timerLabel!: St.Label;
    private toggle: FitBreaksToggle;
    private timerEnabled = false;

    constructor(path: String) {
      super();
      this.toggle = new FitBreaksToggle(path);
      this.addIcon(path);
      this.addLabel();
      this.quickSettingsItems.push(this.toggle);
      this.toggle.connect("clicked", this.onClick.bind(this));
    }

    private addIcon(path: String) {
      this.indicator = this._addIndicator();
      this.indicator.gicon = getIcon(path, FitIcon);
      this.makeVisibleOnChecked(this.indicator);
    }

    private addLabel() {
      this.timerLabel = new St.Label({
        y_expand: true,
        y_align: Clutter.ActorAlign.CENTER,
      });
      this.add_child(this.timerLabel);
      this.makeVisibleOnChecked(this.timerLabel);
    }

    private makeVisibleOnChecked(element: any) {
      if (element)
        this.toggle.bind_property(
          "checked",
          element,
          "visible",
          GObject.BindingFlags.SYNC_CREATE,
        );
    }

    private onClick() {
      console.log("timer enabled: " + this.timerEnabled);
      this.timerEnabled = !this.timerEnabled;
      const timer = new Timer(this);
      this.timerEnabled ? timer.startTimer() : timer.removeTimer();
    }
  },
);

export type FitBreaksIndicator = InstanceType<typeof FitBreaksIndicator>;
