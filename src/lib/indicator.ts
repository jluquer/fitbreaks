import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";

import { SystemIndicator } from "resource:///org/gnome/shell/ui/quickSettings.js";
import { gettext as _ } from "resource:///org/gnome/shell/extensions/extension.js";

import { FitBreaksToggle } from "./toggle.js";
import { getIcon } from "./utils.js";
import { FitIcon } from "./constants.js";

export const FitBreaksIndicator = GObject.registerClass(
  class FitBreaksIndicator extends SystemIndicator {
    icon!: St.Icon;
    label!: St.Label;

    constructor(path: String) {
      super();
      this.icon = this._addIndicator();
      this.icon.gicon = getIcon(path, FitIcon);
      this.addLabel();
    }

    private addLabel() {
      this.label = new St.Label({
        y_expand: true,
        y_align: Clutter.ActorAlign.CENTER,
      });
      this.add_child(this.label);
    }

    handleVisibility(toggle: FitBreaksToggle) {
      [this.label, this.icon].forEach((element) => {
        if (!element) return;
        toggle.bind_property(
          "checked",
          element,
          "visible",
          GObject.BindingFlags.SYNC_CREATE,
        );
      });
    }
  },
);

export type FitBreaksIndicator = InstanceType<typeof FitBreaksIndicator>;
