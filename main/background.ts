import { BrowserWindow, app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { ipcMain } from "electron";
import { getDispensingDataFromHN } from "./db/slot";
import { SerialPort } from "serialport";
import { onRegisterSlot } from "./ipc/onRegisterSlot";
import { onGetSlotsState } from "./ipc/onGetSlotsState";
import { initSerialPort, portUnlockSlot } from "./commands";
import { onWaitForLockBack } from "./ipc/onWaitForLockBack";
import { onUnlock } from "./ipc/onUnlock";
import { onLogin } from "./ipc/onLogin";
import { GLOBAL, IO } from "./enums/ipc.enums";
import { onDispense } from "./ipc/onDispense";

const isProd: boolean = process.env.NODE_ENV === "production";
let port: SerialPort;
let mainWindow: BrowserWindow;
let timer;

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 1024,
    height: 600,
    resizable: false,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    // mainWindow.webContents.openDevTools();
  }

  //@DEV: Initialize and open serial port
  port = initSerialPort();
  onLogin();
  //@Dev: get slot states
  onGetSlotsState();
  //@Dev: register hn to slot
  onRegisterSlot(mainWindow);
  //@Dev: unlock slot
  onUnlock(port, mainWindow);
  //@Dev: waiting for lockback
  onWaitForLockBack(port, mainWindow);

  //@Dev: despensing start
  onDispense(port, mainWindow);
})();

app.on("window-all-closed", () => {
  port.close();
  clearInterval(timer);

  if (port.closed) {
    console.log("port closed.");
  }

  app.quit();
});
