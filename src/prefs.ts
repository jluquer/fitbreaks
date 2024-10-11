import Adw from "gi://Adw";
import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";
import { settingsKey } from "./lib/constants.js";
import { ExerciseListPage } from "./lib/prefs/exercise-list-page.js";
import { MainPage } from "./lib/prefs/main-page.js";

export default class FitBreaksPreferences extends ExtensionPreferences {
  override fillPreferencesWindow(window: Adw.PreferencesWindow) {
    const settings = this.getSettings(settingsKey);

    const mainPage = new MainPage({
      settings: settings,
    });
    const exerciseListPage = new ExerciseListPage({
      settings: settings,
    });

    window.add(mainPage);
    window.add(exerciseListPage);
  }
}
