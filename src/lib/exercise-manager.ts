import Gio from "gi://Gio";
import { schemas } from "./constants.js";
export class ExerciseManager {
  private exercises: string[];
  private exercisesIndexUsed: number[] = [];
  private random: boolean;
  private order = 0;

  constructor(settings: Gio.Settings) {
    this.exercises = settings.get_strv(schemas.exercises) ?? [
      "Could not get any exercise from settings",
    ];
    this.random = settings.get_boolean(schemas.exerciseRandom) ?? true;
  }

  getExercise(): string {
    return (
      (this.random ? this.getRandomExercise() : this.getOrderedExercise()) ??
      "Could not get any exercise"
    );
  }

  private getRandomExercise() {
    let index: number;
    do {
      index = Math.floor(Math.random() * this.exercises.length);
    } while (this.exercisesIndexUsed.some((i) => index == i));

    this.exercises.length == this.exercisesIndexUsed.length + 1
      ? (this.exercisesIndexUsed = [])
      : this.exercisesIndexUsed.push(index);

    return this.exercises.at(index);
  }

  private getOrderedExercise() {
    if (this.order >= this.exercises.length) this.order = 0;
    return this.exercises.at(this.order++);
  }
}
