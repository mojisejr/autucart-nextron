import { BrowserWindow, ipcMain } from "electron";
import { IO, GLOBAL } from "../enums/ipc.enums";
import { getDispensingDataFromHN } from "../db/slot";
import { portUnlockSlot } from "../commands";
import { SerialPort } from "serialport";

export function onDispense(port: SerialPort, mainWindow: BrowserWindow) {
  ipcMain.handle(IO.Dispense, async (event, hn) => {
    const data = await getDispensingDataFromHN(hn);
    if (data != null) {
      portUnlockSlot(port, data.id);
      mainWindow.webContents.send(IO.Dispensing, data.id, data.hn);
    } else {
      mainWindow.webContents.send(
        GLOBAL.Error,
        `Dispensing for HN: ${hn} failed, please try again`
      );
    }
  });
}
