import { BrowserWindow } from "electron";
import { SerialPort } from "serialport";
import {
  completeDispensingSlot,
  completeRegisterSlot,
  getCurrentOpeningState,
} from "../db/slot";
import { DB, GLOBAL, IO } from "../enums/ipc.enums";
import { onOpening } from "./onOpening";
import { onClosed } from "./onClosed";
import { onDispensingClosed } from "./onDispensingClosed";
import { onDispensing } from "./onDispensing";

export function onDispensingLockedBack(
  port: SerialPort,
  mainWindow: BrowserWindow,
  timer: NodeJS.Timer,
  event: string
) {
  port.on("readable", async () => {
    console.log("DISPENSING..");
    const readed = port.read(8);
    const current = await getCurrentOpeningState();
    console.log("current slot no: ", current);
    if (readed != null || readed != undefined) {
      if (readed.length > 0 && readed[0] == 2) {
        const state = parseInt(readed[3], 16);
        switch (state) {
          case 0x07: {
            if (
              current[0].registered &&
              current[0].opening &&
              event == IO.WaitForDispensingLockBack
            ) {
              onDispensingClosed(mainWindow, {
                id: current[0].id,
                hn: current[0].hn,
              });
              const result = await completeDispensingSlot({
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
            onDispensing(mainWindow, { id: current[0].id, hn: current[0].hn });
            break;
          }
          case 0x05: {
            onDispensing(mainWindow, { id: current[0].id, hn: current[0].hn });
            break;
          }
          case 0x03: {
            onDispensing(mainWindow, { id: current[0].id, hn: current[0].hn });
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
