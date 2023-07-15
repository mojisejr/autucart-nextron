import { BrowserWindow } from "electron";
import { IO } from "../enums/ipc.enums";
import { SlotClosedDTO } from "../interfaces/dtos/slotClosedDTO";
export function onClosed(mainWindow: BrowserWindow, input: SlotClosedDTO) {
  mainWindow.webContents.send(IO.Closed, input.id, input.hn);
}
