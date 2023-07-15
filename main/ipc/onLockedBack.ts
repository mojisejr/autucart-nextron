import { BrowserWindow } from "electron";
import { SerialPort } from "serialport";
import {
  completeRegisterSlot,
  getCurrentOpeningState,
  updateSlotState,
} from "../db/slot";
import { DB, GLOBAL, IO } from "../enums/ipc.enums";
import { onOpening } from "./onOpening";
import { onClosed } from "./onClosed";

export function onLockedBack(
  port: SerialPort,
  mainWindow: BrowserWindow,
  timer: NodeJS.Timer
) {
  port.on("readable", async () => {
    const readed = port.read(8);
    const current = await getCurrentOpeningState();
    console.log("current slot no: ", current[0].id);
    if (readed != null || readed != undefined) {
      if (readed.length > 0 && readed[0] == 2) {
        const state = parseInt(readed[3], 16);
        switch (state) {
          case 0x07: {
            if (current[0].registered && current[0].opening) {
              onClosed(mainWindow, { id: current[0].id, hn: current[0].hn });
              const result = await completeRegisterSlot({
                id: current[0].id,
                hn: current[0].hn,
              });
              if (result) {
                clearInterval(timer);
                mainWindow.webContents.send(DB.GetAllSlots);
              } else {
                mainWindow.webContents.send(
                  GLOBAL.Error,
                  `Cannot Complete registeration for slot ${current[0].id}, please try again`
                );
              }
              break;
            }
          }
          case 0x06: {
            onOpening(mainWindow, { id: current[0].id, hn: current[0].hn });
            break;
          }
          case 0x05: {
            onOpening(mainWindow, { id: current[0].id, hn: current[0].hn });
            break;
          }
          case 0x03: {
            onOpening(mainWindow, { id: current[0].id, hn: current[0].hn });
            break;
          }
          default:
            return;
            break;
        }
      }
    }
  });
}
