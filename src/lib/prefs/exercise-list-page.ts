import GObject from "gi://GObject";
import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

import { gettext as _ } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";
import { schemas } from "../constants.js";

interface Props {
  settings: Gio.Settings;
}

export const ExerciseListPage = GObject.registerClass(
  class ExerciseListPage extends Adw.PreferencesPage {
    exercisesGroup: Adw.PreferencesGroup;
    settings: Gio.Settings;
    exercises: string[];
    exercisesRows: Adw.ActionRow[] = [];

    constructor(props: Props) {
      super({
        title: _("Exercise List"),
        iconName: "view-list-compact-symbolic",
      });
      this.settings = props.settings;
      this.exercisesGroup = new Adw.PreferencesGroup({
        title: _("Exercise List"),
      });
      this.exercises = this.getExercisesFromSettings();
      this.refreshExerciseList();
      this.displayAddExercise();
      this.add(this.exercisesGroup);
      this.settings.connect("changed::exercises", () => {
        console.log("exercises settings changed");
        this.refreshExerciseList();
      });
    }

    private displayAddExercise() {
      const addExerciseGroup = new Adw.PreferencesGroup();
      const box = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        cssClasses: ["linked", "round"],
        hexpand: true,
        vexpand: true,
      });

      const textInput = new Gtk.Entry({
        placeholderText: _("New exercise"),
      });
      textInput.connect("activate", () => this.addNewExercise(textInput));

      const addButton = new Gtk.Button({
        child: new Adw.ButtonContent({
          iconName: "list-add-symbolic",
        }),
      });
      addButton.connect("clicked", () => this.addNewExercise(textInput));

      box.append(textInput);
      box.append(addButton);

      addExerciseGroup.add(box);
      this.add(addExerciseGroup);
    }
    private addNewExercise(entry: Gtk.Entry) {
      console.log(`adding new exercise`);
      console.log(`adding exercise: ${entry.text}`);
      const newExercise = entry.text.trim();
      if (newExercise.length > 0) {
        const exercises = this.exercises ?? [];
        exercises.push(newExercise);
        this.setExercises(exercises);
        entry.set_text("");
      }
    }
    // private removeExercise(exercise: string) {
    //   const exercises = this.exercises.filter((e) => e !== exercise);
    //   this.setExercises(exercises);
    // }
    private getExercisesFromSettings() {
      return this.settings.get_strv(schemas.exercises);
    }

    private setExercises(exercises: string[]) {
      this.exercises = exercises;
      this.settings.set_strv("exercises", exercises);
    }

    private refreshExerciseList() {
      this.cleanExerciseGroup();
      this.exercises.forEach(this.addExerciseRow.bind(this));
    }

    private addExerciseRow(exercise: string) {
      const actionRow = new Adw.ActionRow({
        name: exercise,
        title: exercise,
        iconName: "org.gnome.Settings-trash-file-history-symbolic",
      });
      this.exercisesRows.push(actionRow);
      this.exercisesGroup.add(actionRow);
    }

    private cleanExerciseGroup() {
      this.exercisesRows.forEach((row) => this.exercisesGroup.remove(row));
      this.exercisesRows = [];
    }
  },
);

export type ExerciseListPage = InstanceType<typeof ExerciseListPage>;
