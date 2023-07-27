import { BrowserWindow, ipcMain } from "electron";
import { IO, DB } from "../enums/ipc.enums";
import { portCheckState } from "../commands";
import { SerialPort } from "serialport";
import { onLockedBack } from "./onLockedBack";

export async function onWaitForLockBack(
  port: SerialPort,
  mainWindow: BrowserWindow
) {
  ipcMain.handle(IO.WaitForLockBack, async (event) => {
    let timer = setInterval(() => portCheckState(port), 1000);
    await onLockedBack(port, mainWindow, timer, IO.WaitForLockBack);
  });
}
