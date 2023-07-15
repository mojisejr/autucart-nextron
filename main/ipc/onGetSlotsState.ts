import { ipcMain } from "electron";
import { DB } from "../enums/ipc.enums";
import { getSlotsState } from "../db/slot";

export function onGetSlotsState() {
  ipcMain.handle(DB.GetAllSlots, async (event) => {
    return await getSlotsState();
  });
}
