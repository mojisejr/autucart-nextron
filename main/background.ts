import { app, ipcMain, webContents } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { connect } from "mqtt";
import { mqttConfig, url } from "./mqtt/mqtt.config";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
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

  const mqtt = connect(url);

  mqtt.subscribe("ku_states");

  mqtt.on("connect", () => {
    mqtt.on("message", (topic, payload) => {
      if (topic == "ku_states") {
        if (payload.toString() == "0") {
          mainWindow.webContents.send("closed");
        } else {
          console.log("opening code is : ", payload.toString());
        }
      }
    });
  });

  mqtt.publish("init", JSON.stringify({ slot: 1 }));
  // mqtt.publish(
  //   "unlock",
  //   JSON.stringify({ slot: 1, hn: 506623, timestamp: new Date().getTime() })
  // );

  //@DEV: IPC MAIN
  /////////////////
})();

app.on("window-all-closed", () => {
  app.quit();
});
