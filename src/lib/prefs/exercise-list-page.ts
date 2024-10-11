import GObject from "gi://GObject";
import Adw from "gi://Adw";
import Gio from "gi://Gio";

import { gettext as _ } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";
import { schemas } from "../constants.js";

interface Props {
  settings: Gio.Settings;
}

export const ExerciseListPage = GObject.registerClass(
  class ExerciseListPage extends Adw.PreferencesPage {
    exercisesGroup: Adw.PreferencesGroup;
    settings: Gio.Settings;

    constructor(props: Props) {
      super({
        title: _("Exercise List"),
        iconName: "view-list-compact-symbolic",
      });
      this.settings = props.settings;
      this.exercisesGroup = new Adw.PreferencesGroup({
        title: _("Exercise List"),
      });
      this.refreshExerciseList();
      this.add(this.exercisesGroup);
      this.settings.connect("changed::exercises", () =>
        this.refreshExerciseList(),
      );
    }

    private getExercises() {
      return this.settings.get_strv(schemas.exercises);
    }

    // private setExercises(exercises: string[]) {
    //   this.settings.set_strv("exercises", exercises);
    // }

    private refreshExerciseList() {
      this.cleanExerciseGroup();
      console.log("refreshing exercises");
      this.getExercises()?.forEach((exercise) => {
        this.exercisesGroup.add(
          new Adw.ActionRow({
            name: exercise,
            title: exercise,
            iconName: "org.gnome.Settings-trash-file-history-symbolic",
          }),
        );
      });
    }

    private cleanExerciseGroup() {
      let child = this.exercisesGroup.get_first_child();
      while (child) {
        this.exercisesGroup.remove(child);
        child = child.get_next_sibling();
      }
    }
  },
);

export type ExerciseListPage = InstanceType<typeof ExerciseListPage>;
