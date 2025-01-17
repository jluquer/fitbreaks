import GObject from "gi://GObject";
import { QuickMenuToggle } from "resource:///org/gnome/shell/ui/quickSettings.js";
import {
  Extension,
  gettext as _,
} from "resource:///org/gnome/shell/extensions/extension.js";

import { getIcon } from "./utils.js";
import { FitIcon } from "./constants.js";

export const FitBreaksToggle = GObject.registerClass(
  class FitBreaksToggle extends QuickMenuToggle {
    constructor(path: String) {
      super({
        title: _("Fit Breaks"),
        toggleMode: true,
        checked: true,
      });

      this.gicon = getIcon(path, FitIcon);

      this.menu.addAction("Configure", () =>
        Extension.lookupByURL(import.meta.url)?.openPreferences(),
      );
    }
  },
);

export type FitBreaksToggle = InstanceType<typeof FitBreaksToggle>;
