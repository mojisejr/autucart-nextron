import { BrowserWindow } from "electron";
import { IO } from "../enums/ipc.enums";
import { SlotOpeningDTO } from "../interfaces/dtos/slotOpeningDTO";

export function onDispensing(mainWindow: BrowserWindow, input: SlotOpeningDTO) {
  mainWindow.webContents.send(IO.Dispensing, input.id, input.hn);
}
