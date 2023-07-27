import { BrowserWindow, ipcMain } from "electron";
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
import { onGetSlotsState } from "./onGetSlotsState";

export async function onLockedBack(
  port: SerialPort,
  mainWindow: BrowserWindow,
  timer: NodeJS.Timer,
  inputEvent: string
) {
  let event = inputEvent;
  port.on("readable", async () => {
    console.log("readable-event-count: ", {
      count: port.listenerCount("readable"),
      event,
    });
    const readed = port.read(8);
    const current = await getCurrentOpeningState();
    if (readed != null || readed != undefined) {
      if (readed.length > 0 && readed[0] == 2) {
        const state = parseInt(readed[3], 16);
        switch (state) {
          case 0x07: {
            //@dev: get slot state
            if (current[0].registered && current[0].opening) {
              if (event == IO.WaitForLockBack) {
                console.log("WaitForLockBack-closing");
                onClosed(mainWindow, { id: current[0].id, hn: current[0].hn });
                const result = await completeRegisterSlot({
                  id: current[0].id,
                  hn: current[0].hn,
                });
                if (result) {
                  clearInterval(timer);
                  await onGetSlotsState(mainWindow);
                  port.removeAllListeners("readable");
                  break;
                } else {
                  mainWindow.webContents.send(
                    GLOBAL.Error,
                    `Cannot Complete registeration for slot ${current[0].id}, please try again`
                  );
                  break;
                }
              } else if (event == IO.WaitForDispensingLockBack) {
                console.log("WaitForDispensingLockBack-closing");
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
                  await onGetSlotsState(mainWindow);
                  // mainWindow.webContents.send(DB.GetAllSlots);
                  port.removeAllListeners("readable");
                  break;
                } else {
                  mainWindow.webContents.send(
                    GLOBAL.Error,
                    `Cannot Complete registeration for slot ${current[0].id}, please try again`
                  );
                  break;
                }
              }
            }
          }
          case 0x06: {
            //@dev: get slot state
            await onGetSlotsState(mainWindow);
            if (event == IO.WaitForLockBack) {
              console.log("opening-slot-1");
              onOpening(mainWindow, { id: current[0].id, hn: current[0].hn });
              mainWindow.removeAllListeners(IO.Dispensing);
              break;
            } else if (event == IO.WaitForDispensingLockBack) {
              console.log("dispensing-slot-1");
              onDispensing(mainWindow, {
                id: current[0].id,
                hn: current[0].hn,
              });
              mainWindow.removeAllListeners(IO.Dispensing);
              break;
            }
          }
          case 0x05: {
            //@dev: get slot state
            await onGetSlotsState(mainWindow);
            if (event == IO.WaitForLockBack) {
              console.log("opening-slot-2");
              onOpening(mainWindow, { id: current[0].id, hn: current[0].hn });
              break;
            } else if (event == IO.WaitForDispensingLockBack) {
              console.log("dispensing-slot-2");
              onDispensing(mainWindow, {
                id: current[0].id,
                hn: current[0].hn,
              });
              break;
            }
          }
          case 0x03: {
            //@dev: get slot state
            await onGetSlotsState(mainWindow);
            if (event == IO.WaitForLockBack) {
              console.log("opening-slot-3");
              onOpening(mainWindow, { id: current[0].id, hn: current[0].hn });
              break;
            } else if (event == IO.WaitForDispensingLockBack) {
              console.log("dispensing-slot-3");
              onDispensing(mainWindow, {
                id: current[0].id,
                hn: current[0].hn,
              });
              break;
            }
          }
          default:
            return;
            break;
        }
      }
    }
  });
}
