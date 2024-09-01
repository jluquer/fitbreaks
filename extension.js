/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import GObject from "gi://GObject";
import Gio from "gi://Gio";
import * as Main from "resource:///org/gnome/shell/ui/main.js";

import {
  Extension,
  gettext as _,
} from "resource:///org/gnome/shell/extensions/extension.js";
import {
  QuickToggle,
  SystemIndicator,
} from "resource:///org/gnome/shell/ui/quickSettings.js";

const FitIcon = "fit";

function getIcon(path, icon) {
  return Gio.icon_new_for_string(`${path}/icons/${icon}.svg`);
}

const FitBreaksToggle = GObject.registerClass(
  class FitBreaksToggle extends QuickToggle {
    constructor(path) {
      super({
        title: _("Fit Breaks"),
        toggleMode: true,
      });
      this.gicon = getIcon(path, FitIcon);
      this.connect("destroy", () => {
        this.gicon = null;
      });
    }
  },
);

const FitBreaksIndicator = GObject.registerClass(
  class FitBreaksIndicator extends SystemIndicator {
    constructor(path) {
      super();

      this._indicator = this._addIndicator();
      this._indicator.gicon = getIcon(path, FitIcon);
      const toggle = new FitBreaksToggle(path);
      toggle.bind_property(
        "checked",
        this._indicator,
        "visible",
        GObject.BindingFlags.SYNC_CREATE,
      );
      this.quickSettingsItems.push(toggle);
      this._indicator.connect("destroy", () => {
        this._indicator = null;
      });
    }
  },
);

export default class FitBreaksExtension extends Extension {
  enable() {
    this._indicator = new FitBreaksIndicator(this.path);
    Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
  }

  disable() {
    if (!this._indicator) return;
    this._indicator.quickSettingsItems.forEach((item) => item.destroy());
    this._indicator.destroy();
  }
}
