import { BrowserWindow } from "electron";
import { IO } from "../enums/ipc.enums";
import { SlotOpeningDTO } from "../interfaces/dtos/slotOpeningDTO";

export function onOpening(mainWindow: BrowserWindow, input: SlotOpeningDTO) {
  mainWindow.webContents.send(IO.Opening, input.id, input.hn);
}
