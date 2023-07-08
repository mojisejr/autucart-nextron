import { BrowserWindow, app } from "electron";
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

import { SerialPort } from "serialport";

import setting from "./setting.json";
import commands from "./commands.json";

const isProd: boolean = process.env.NODE_ENV === "production";
let port: SerialPort;
let mainWindow: BrowserWindow;

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

  initSerialPort(mainWindow);
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
      portUnlockSlot(port, slotNo);
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

  port.on("open", () => {
    portCheckState(port, 1);
  });

  port.on("readable", () => {
    const readed = port.read(8);
    if (readed.length > 0) {
      console.log(readed);
      console.log(parseInt(readed[3], 16));
    }
  });
})();

function initSerialPort(win: BrowserWindow) {
  port = new SerialPort({
    path: setting.path,
    baudRate: setting.baudRate,
    dataBits: setting.dataBits as 8 | 5 | 6 | 7,
    stopBits: setting.stopBits as 1 | 1.5 | 2,
    parity: setting.parity as "none" | "even" | "odd" | "mark" | "space",
    autoOpen: setting.autoOpen,
  });
}

function portCheckState(port: SerialPort, id: number) {
  const command = getReadStateCommand(id);
  port.write(command);
}

function portUnlockSlot(port: SerialPort, id: number) {
  const command = getUnlockCommand(id);
  port.write(command);
}

function getReadStateCommand(id: number) {
  const command = commands[id - 1].checkState;
  const commandBytes = convertStringToByteArray(command);
  console.log(commandBytes);
  return commandBytes;
}

function getUnlockCommand(id: number) {
  const command = commands[id - 1].unlock;
  const commandBytes = convertStringToByteArray(command);
  console.log(commandBytes);
  return commandBytes;
}

function convertStringToByteArray(inputString: string): number[] {
  const byteArray: number[] = [];

  for (let i = 0; i < inputString.length; i += 2) {
    const byteString = inputString.substr(i, 2).toString();
    const byteValue = parseInt(byteString, 16);
    byteArray.push(byteValue);
  }

  return byteArray;
}

app.on("window-all-closed", () => {
  port.close();

  if (port.closed) {
    console.log("port closed.");
  }

  app.quit();
});

// ipcMain.on("update:slot", async (event, args: number) => {
//   await prisma.slot.update({ where: { id: args } });
// });
