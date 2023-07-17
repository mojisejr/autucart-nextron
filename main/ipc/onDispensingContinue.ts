import { ipcMain, BrowserWindow } from "electron";
import { GLOBAL, IO } from "../enums/ipc.enums";
import { completeDispensingSlot } from "../db/slot";

export function onDispeningContinue(mainWindow: BrowserWindow) {
  ipcMain.handle(IO.DispensingContinue, async (event, id) => {
    const isContinue = await completeDispensingSlot(id);
    if (isContinue) {
      mainWindow.webContents.send(IO.DispensingFinished);
    } else {
      mainWindow.webContents.send(
        GLOBAL.Error,
        `slot: ${id} reseting failed, try again`
      );
    }
  });
  ipcMain.removeAllListeners(IO.DispensingContinue);
}
