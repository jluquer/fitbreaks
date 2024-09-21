import Gio from "gi://Gio";

export function getIcon(path: String, icon: String) {
  return Gio.icon_new_for_string(`${path}/icons/${icon}.svg`);
}

export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const min = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  if (hours !== "00") {
    return hours + ":" + min + ":" + sec;
  } else {
    return min + ":" + sec;
  }
}
