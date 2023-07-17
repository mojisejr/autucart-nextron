import { BrowserWindow, ipcMain } from "electron";
import { GLOBAL, IO } from "../enums/ipc.enums";
import { portUnlockSlot } from "../commands";
import { SerialPort } from "serialport";
import { setOpenSlot } from "../db/slot";

export function onUnlock(port: SerialPort, mainWindow: BrowserWindow) {
  ipcMain.handle(IO.Unlock, async (event, id: number, hn: string) => {
    portUnlockSlot(port, id);
    const result = await setOpenSlot({ id, hn });
    if (result) {
      mainWindow.webContents.send(IO.Unlocked, id, hn);
    } else {
      mainWindow.webContents.send(
        GLOBAL.Error,
        `Error on opening slot ${hn}, please try again`
      );
    }
  });
  ipcMain.removeAllListeners(IO.Unlock);
}
