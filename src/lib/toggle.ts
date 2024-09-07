import GObject from "gi://GObject";
import { QuickToggle } from "resource:///org/gnome/shell/ui/quickSettings.js";
import { gettext as _ } from "resource:///org/gnome/shell/extensions/extension.js";
import { getIcon } from "./utils.js";
import { FitIcon } from "./constants.js";

export const FitBreaksToggle = GObject.registerClass(
  class FitBreaksToggle extends QuickToggle {
    constructor(path: String) {
      super({
        title: _("Fit Breaks"),
        toggleMode: true,
      });

      this.gicon = getIcon(path, FitIcon);
    }
  },
);

export type FitBreaksToggle = InstanceType<typeof FitBreaksToggle>;
