import { ipcMain, BrowserWindow } from "electron";
import { GLOBAL, IO } from "../enums/ipc.enums";
import { resetDispensedSlot } from "../db/slot";

export function onDispeningClear(mainWindow: BrowserWindow) {
  ipcMain.handle(IO.DispensingClear, async (event, id) => {
    const isReset = await resetDispensedSlot(id);
    console.log(`Clearing ${id} and result: ${isReset}`);
    if (isReset) {
      mainWindow.webContents.send(IO.DispensingFinished);
    } else {
      mainWindow.webContents.send(
        GLOBAL.Error,
        `slot: ${id} reseting failed, try again`
      );
    }
  });
  ipcMain.removeAllListeners(IO.DispensingClear);
}
