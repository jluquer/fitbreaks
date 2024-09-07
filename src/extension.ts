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
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { QuickSettingsItem } from "resource:///org/gnome/shell/ui/quickSettings.js";
import { FitBreaksIndicator } from "./lib/indicator.js";

export default class FitBreaksExtension extends Extension {
  private indicator?: FitBreaksIndicator;

  override enable() {
    this.indicator = new FitBreaksIndicator(this.path);
    Main.panel.statusArea.quickSettings.addExternalIndicator(this.indicator);
  }

  override disable() {
    if (!this.indicator) return;
    this.indicator.quickSettingsItems.forEach((item: QuickSettingsItem) =>
      item.destroy(),
    );
    this.indicator.destroy();
    // this.indicator = undefined;
  }
}
