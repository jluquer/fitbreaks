import * as MessageTray from "resource:///org/gnome/shell/ui/messageTray.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";

export function notify(exercise: String) {
  const source = new MessageTray.Source({
    title: "Break",
    iconName: "face-laugh-symbolic",
  });
  Main.messageTray.add(source);

  const notification = new MessageTray.Notification({
    source,
    title: "Fit Break",
    body: `You have to do: ${exercise}`,
    urgency: MessageTray.Urgency.CRITICAL,
  });

  return new Promise((resolve) => {
    notification.addAction("Done!", () => {
      resolve(true);
    });
    notification.addAction("Not now", () => {
      resolve(false);
    });
    source.addNotification(notification);
  });
}
