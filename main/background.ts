import { BrowserWindow, app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { SerialPort } from "serialport";
import { onRegisterSlot } from "./ipc/onRegisterSlot";
import { onGetSlotsState } from "./ipc/onGetSlotsState";
import { getPortList, initSerialPort, portUnlockSlot } from "./commands";
import { onWaitForLockBack } from "./ipc/onWaitForLockBack";
import { onUnlock } from "./ipc/onUnlock";
import { onLogin } from "./ipc/onLogin";
import { onDispense } from "./ipc/onDispense";
import { onWaitForDispensingLockBack } from "./ipc/onWaitForDispeningLocked";
import { onDispeningClear } from "./ipc/onDispensingClear";
import { onDispeningContinue } from "./ipc/onDispensingContinue";
import { onGetPortList } from "./ipc/onGetPortList";

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
    mainWindow.webContents.openDevTools();
  }

  //@DEV: Initialize and open serial port
  port = initSerialPort();

  onLogin();
  await onGetPortList(mainWindow);
  //@Dev: get slot states
  await onGetSlotsState(mainWindow);
  //@Dev: register hn to slot
  await onRegisterSlot(mainWindow);
  //@Dev: unlock slot
  await onUnlock(port, mainWindow);
  //@Dev: waiting for lockback
  await onWaitForLockBack(port, mainWindow);
  //@Dev: despensing start
  await onDispense(port, mainWindow);
  //@Dev: waiting for dispensing lockback
  await onWaitForDispensingLockBack(port, mainWindow);
  //@Dev: clear
  await onDispeningClear(mainWindow);
  //@Dev: continue
  await onDispeningContinue(mainWindow);
})();

app.on("window-all-closed", () => {
  port.close();
  clearInterval(timer);

  if (port.closed) {
    console.log("port closed.");
  }

  app.quit();
});
