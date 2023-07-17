import { ipcMain } from "electron";
import { AUTHENTICATION } from "../enums/ipc.enums";
import { getUser } from "../db/auth";

export function onLogin() {
  ipcMain.handle(AUTHENTICATION.Login, async (event, stuffId: string) => {
    const user = await getUser(stuffId);
    return user;
  });
  ipcMain.removeAllListeners(AUTHENTICATION.Login);
}
