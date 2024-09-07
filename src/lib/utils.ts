import Gio from "gi://Gio";

export function getIcon(path: String, icon: String) {
  return Gio.icon_new_for_string(`${path}/icons/${icon}.svg`);
}
