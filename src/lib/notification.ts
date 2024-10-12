import * as MessageTray from "resource:///org/gnome/shell/ui/messageTray.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";

export function notifyExercise(exercise: String) {
  const source = new MessageTray.Source({
    title: "Fit Break",
    iconName: "face-laugh-symbolic",
  });
  Main.messageTray.add(source);

  const notification = new MessageTray.Notification({
    source,
    title: "Time to move the skeleton!",
    body: `You have to do: ${exercise}`,
    urgency: MessageTray.Urgency.CRITICAL,
  });

  return new Promise((resolve) => {
    notification.addAction("Not now", () => {
      resolve(false);
    });
    notification.addAction("Done ✅", () => {
      resolve(true);
    });
    source.addNotification(notification);
  });
}
