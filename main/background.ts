import { app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { ipcMain } from "electron";
import {
  getSlotState,
  getSlotsState,
  lockSlot,
  unlockSlot,
  isLocked,
} from "./db";

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

  //@DEV: IPC MAIN
  /////////////////

  ipcMain.handle("getSlotsState", (event) => {
    console.log("getSlotsState");
    return getSlotsState();
  });

  ipcMain.handle("lockSlot", (event, slotNo: number, hn: string) => {
    console.log("lockSlot");
    lockSlot(slotNo, hn);
    getSlotsState();
    mainWindow.webContents.send("locked", slotNo);
  });

  ipcMain.handle("unlockSlot", (event, slotNo: number) => {
    console.log("unlockSlot");
    unlockSlot(slotNo);
    getSlotsState();
    mainWindow.webContents.send("unlocked", slotNo);
  });

  ipcMain.handle("isLocked", (event, slotNo: number) => {
    console.log("isLocked");
    return isLocked(slotNo);
  });
})();

app.on("window-all-closed", () => {
  app.quit();
});

// ipcMain.on("update:slot", async (event, args: number) => {
//   await prisma.slot.update({ where: { id: args } });
// });
