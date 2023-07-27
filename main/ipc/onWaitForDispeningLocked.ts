import { BrowserWindow, ipcMain } from "electron";
import { IO, DB } from "../enums/ipc.enums";
import { portCheckState } from "../commands";
import { SerialPort } from "serialport";
import { onLockedBack } from "./onLockedBack";

export async function onWaitForDispensingLockBack(
  port: SerialPort,
  mainWindow: BrowserWindow
) {
  ipcMain.handle(IO.WaitForDispensingLockBack, async (event) => {
    let timer = setInterval(() => portCheckState(port), 1000);
    await onLockedBack(port, mainWindow, timer, IO.WaitForDispensingLockBack);
  });
}
