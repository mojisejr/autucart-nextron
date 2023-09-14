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
    mainWindow.webContents.openDevTools();
  }

  const mqtt = connect(url);
  mqtt.publish("init", JSON.stringify({ slot: 1 }));
  mqtt.subscribe("ku_states");

  mqtt.on("connect", () => {
    mqtt.on("message", (topic, payload) => {
      console.log(topic);
      if (topic == "ku_states") {
        console.log("payload: ", JSON.parse(payload.toString()));
        mainWindow.webContents.send("ku_states", payload);
      }
    });
  });

  // mqtt.publish(
  //   "insert",
  //   JSON.stringify({ slot: 1, hn: 506623, timestamp: new Date().getTime() })
  // );

  // mqtt.publish("dispense", JSON.stringify({slot: 1}));
  // mqtt.publish("reset", JSON.stringify({ slot: 1 }));

  //@DEV: IPC MAIN
  /////////////////
})();

app.on("window-all-closed", () => {
  app.quit();
});
