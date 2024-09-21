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
import { gettext as _ } from "resource:///org/gnome/shell/extensions/extension.js";

import { FitBreaksIndicator } from "./lib/indicator.js";
import { FitBreaksToggle } from "./lib/toggle.js";
import { Timer } from "./lib/timer.js";
import { formatTime } from "./lib/utils.js";
import { notifyExercise } from "./lib/notification.js";

export default class FitBreaksExtension extends Extension {
  private indicator!: FitBreaksIndicator;
  private toggle!: FitBreaksToggle;
  private timer = new Timer();
  private listeners?: number[];

  override enable() {
    console.log("enabling");
    this.toggle = new FitBreaksToggle(this.path);
    this.indicator = new FitBreaksIndicator(this.path);
    this.indicator.handleVisibility(this.toggle);
    this.indicator.quickSettingsItems.push(this.toggle);
    this.toggle.connect("clicked", this.toggleTimer.bind(this));
    Main.panel.statusArea.quickSettings.addExternalIndicator(this.indicator);
  }

  override disable() {
    if (!this.indicator) return;
    this.indicator.quickSettingsItems.forEach((item: QuickSettingsItem) =>
      item.destroy(),
    );
    this.indicator.destroy();
    this.toggle.destroy();
  }

  private toggleTimer() {
    this.toggle.checked ? this.activateTimer() : this.disableTimer();
  }

  private activateTimer() {
    this.listeners = [
      this.timer.connect("tic", (_, seconds) => {
        this.indicator.label.text = formatTime(seconds);
      }),
      this.timer.connect("stop", () =>
        notifyExercise("Stretch neck").finally(
          () => this.toggle.checked && this.timer.start(),
        ),
      ),
    ];
    this.timer.start();
  }

  private disableTimer() {
    this.listeners?.forEach((listener) => this.timer.disconnect(listener));
    this.timer.removeTimer();
  }
}
