import GObject from "gi://GObject";
import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

import { gettext as _ } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

interface Props {
  settings: Gio.Settings;
}

export const MainPage = GObject.registerClass(
  class MainPage extends Adw.PreferencesPage {
    settings: Gio.Settings;

    constructor(props: Props) {
      super({
        title: _("General"),
        iconName: "org.gnome.Settings-symbolic",
      });
      this.settings = props.settings;

      this.addExercisesGroup();
      this.addTimerPrefs();
    }
    private addExercisesGroup() {
      const exercisesGroup = new Adw.PreferencesGroup({
        title: _("Exercises Config"),
      });
      this.add(exercisesGroup);

      const exercisesRandomEnabled = new Adw.SwitchRow({
        title: _("Randomize exercises"),
        subtitle: _("Wether to use exercises randomly or in order"),
      });
      exercisesGroup.add(exercisesRandomEnabled);

      this.settings!.bind(
        "exercises-random",
        exercisesRandomEnabled,
        "active",
        Gio.SettingsBindFlags.DEFAULT,
      );
    }

    private addTimerPrefs() {
      const timerGroup = new Adw.PreferencesGroup({
        title: _("Timer Config"),
      });
      this.add(timerGroup);

      const timerDuration = new Adw.SpinRow({
        title: _("Timer duration"),
        subtitle: _("Time beetween each freak in minutes"),
        adjustment: new Gtk.Adjustment({
          lower: 1,
          upper: 180,
          stepIncrement: 1,
        }),
      });
      timerGroup.add(timerDuration);

      this.settings!.bind(
        "timer-duration",
        timerDuration,
        "value",
        Gio.SettingsBindFlags.DEFAULT,
      );
    }
  },
);

export type MainPage = InstanceType<typeof MainPage>;
