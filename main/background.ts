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
import { getUser } from "./db/auth";

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

  ipcMain.handle("getSlotsState", async (event) => {
    return await getSlotsState();
  });

  ipcMain.handle(
    "lockSlot",
    async (event, slotNo: number, hn: string, registered: boolean) => {
      await lockSlot(slotNo, hn, registered);
      await getSlotsState();
      mainWindow.webContents.send("locked", slotNo);
    }
  );

  ipcMain.handle("unlockSlot", async (event, hn: string) => {
    await unlockSlot(hn);
    await getSlotsState();
    mainWindow.webContents.send("unlocked", hn);
  });

  ipcMain.handle("isLocked", async (event, slotNo: number) => {
    return await isLocked(slotNo);
  });

  ipcMain.handle("Login", async (event, stuffId: string) => {
    const user = await getUser(stuffId);
    return user;
  });
})();

app.on("window-all-closed", () => {
  app.quit();
});

// ipcMain.on("update:slot", async (event, args: number) => {
//   await prisma.slot.update({ where: { id: args } });
// });
