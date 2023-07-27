import { BrowserWindow, ipcMain } from "electron";
import { DB } from "../enums/ipc.enums";
import { getSlotsState } from "../db/slot";

export async function onGetSlotsState(mainWindow: BrowserWindow) {
  const slots = await getSlotsState();
  console.log("get states on backend");
  mainWindow.webContents.send(DB.GetAllSlots, slots);
  // ipcMain.handle(DB.GetAllSlots, async (event) => {

  //   return await getSlotsState();
  // });
}
