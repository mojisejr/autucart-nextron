import { BrowserWindow, app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { url } from "./mqtt";
import { connect } from "mqtt";
import { pubInit } from "./mqtt/pub/init";
import { handleKuStates } from "./mqtt/message/kuStates";
import { subKuState } from "./mqtt/sub/kuStates";
import { pubUnlock } from "./mqtt/pub/unlock";
import { subUnlocking } from "./mqtt/sub/unlocking";
import { subDispensing } from "./mqtt/sub/dispensing";
import { handleDispensing } from "./mqtt/message/dispensing";
import { handleUnlocking } from "./mqtt/message/unlocking";
import { pubDispense } from "./mqtt/pub/dispense";
import { pubDispensingReset } from "./mqtt/pub/dispensingReset";
import { subDispensingReset } from "./mqtt/sub/dispensingReset";
import { pubInitOnIpc } from "./mqtt/pub/initOnIpc";
import { handleDispensingReset } from "./mqtt/message/dispensingReset";
import { handleResetFinished } from "./mqtt/message/resetFinished";

const isProd: boolean = process.env.NODE_ENV === "production";
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

  const mqtt = connect(url);

  //Publisher
  pubInit(mqtt);
  pubInitOnIpc(mqtt);
  pubUnlock(mqtt);
  pubDispense(mqtt);
  pubDispensingReset(mqtt);

  //Subscriber
  subKuState(mqtt);
  subUnlocking(mqtt);
  subDispensing(mqtt);
  subDispensingReset(mqtt);

  //Event Listener
  mqtt.on("connect", () => {
    mqtt.on("message", (topic, payload) => {
      const parsedPayload = JSON.parse(payload.toString());
      switch (topic) {
        case "ku_states": {
          handleKuStates(mainWindow, parsedPayload);
          break;
        }
        case "dispensing": {
          handleDispensing(mainWindow, parsedPayload);
          break;
        }
        case "unlocking": {
          handleUnlocking(mainWindow, parsedPayload);
          break;
        }
        case "dispensing-reset": {
          handleDispensingReset(mainWindow, parsedPayload);
          break;
        }
        case "reset-finished": {
          handleResetFinished(mainWindow, parsedPayload);
          break;
        }
      }
    });
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

  //@DEV: Initialize and open serial port
})();

app.on("window-all-closed", () => {
  clearInterval(timer);

  app.quit();
});
