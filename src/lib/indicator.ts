import GObject from "gi://GObject";
import St from "gi://St";
import { SystemIndicator } from "resource:///org/gnome/shell/ui/quickSettings.js";
import { gettext as _ } from "resource:///org/gnome/shell/extensions/extension.js";
import { getIcon } from "./utils.js";
import { FitIcon } from "./constants.js";
import { FitBreaksToggle } from "./toggle.js";

export const FitBreaksIndicator = GObject.registerClass(
  class FitBreaksIndicator extends SystemIndicator {
    indicator?: St.Icon;

    constructor(path: String) {
      super();

      this.indicator = this._addIndicator();
      this.indicator.gicon = getIcon(path, FitIcon);
      const toggle = new FitBreaksToggle(path);
      toggle.bind_property(
        "checked",
        this.indicator,
        "visible",
        GObject.BindingFlags.SYNC_CREATE,
      );
      this.quickSettingsItems.push(toggle);
      this.connect("destroy", () => (this.indicator = undefined));
    }
  },
);

export type FitBreaksIndicator = InstanceType<typeof FitBreaksIndicator>;
