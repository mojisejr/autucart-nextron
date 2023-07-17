import { BrowserWindow, ipcMain } from "electron";
import { IO, GLOBAL } from "../enums/ipc.enums";
import { getDispensingDataFromHN, setOpenSlot } from "../db/slot";
import { portUnlockSlot } from "../commands";
import { SerialPort } from "serialport";

export function onDispense(port: SerialPort, mainWindow: BrowserWindow) {
  ipcMain.handle(IO.Dispense, async (event, hn) => {
    const data = await getDispensingDataFromHN(hn);
    if (data != null) {
      portUnlockSlot(port, data.id);
      const isOpened = await setOpenSlot({ id: data.id, hn: data.hn });
      if (isOpened) {
        mainWindow.webContents.send(IO.Dispensing, data.id, data.hn);
      } else {
        mainWindow.webContents.send(
          GLOBAL.Error,
          `Dispensing for HN: ${hn} failed, cannot set opening state of ${data.id}`
        );
      }
    } else {
      mainWindow.webContents.send(
        GLOBAL.Error,
        `Dispensing for HN: ${hn} failed, please try again`
      );
    }
  });

  ipcMain.removeAllListeners(IO.Dispense);
}
