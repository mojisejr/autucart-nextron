import { ipcMain, BrowserWindow } from "electron";
import { GLOBAL, IO } from "../enums/ipc.enums";
import { resetDispensedSlot } from "../db/slot";
import { onGetSlotsState } from "./onGetSlotsState";

export async function onDispeningClear(mainWindow: BrowserWindow) {
  ipcMain.handle(IO.DispensingClear, async (event, id) => {
    const isReset = await resetDispensedSlot(id);
    await onGetSlotsState(mainWindow);
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
}
