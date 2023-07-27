import { BrowserWindow } from "electron";
import { IO } from "../enums/ipc.enums";
import { getPortList } from "../commands";
import { ipcMain } from "electron";

export async function onGetPortList(mainWindow: BrowserWindow) {
  ipcMain.handle(IO.GetPortList, async () => {
    const portList = await getPortList();
    mainWindow.webContents.send(IO.UpdatePortList, portList);
  });
}
