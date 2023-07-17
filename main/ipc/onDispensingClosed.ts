import { BrowserWindow } from "electron";
import { IO } from "../enums/ipc.enums";
import { SlotClosedDTO } from "../interfaces/dtos/slotClosedDTO";
export function onDispensingClosed(
  mainWindow: BrowserWindow,
  input: SlotClosedDTO
) {
  mainWindow.webContents.send(IO.DispensingClosed, input.id, input.hn);
}
