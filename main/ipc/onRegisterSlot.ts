import { BrowserWindow, ipcMain } from "electron";
import { registerSlot } from "../db/slot";
import { DB, GLOBAL } from "../enums/ipc.enums";
import { onGetSlotsState } from "./onGetSlotsState";

export async function onRegisterSlot(mainWindow: BrowserWindow) {
  ipcMain.handle(DB.RegisterSlot, async (event, id, hn) => {
    const result = await registerSlot({ id, hn });
    await onGetSlotsState(mainWindow);
    if (!result) {
      mainWindow.webContents.send(
        GLOBAL.Error,
        "Error on registering process please try again"
      );
      //TODO: reset the registering slot state to initial state
    }
    mainWindow.webContents.send(DB.SlotRegistered, id, hn);
    mainWindow.webContents.send(DB.GetAllSlots);
  });
}
