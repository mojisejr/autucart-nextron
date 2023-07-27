import { IO, DB } from "../enums/ipc-enums";
import { ipcRenderer } from "electron";

export function logEvents() {
  console.log(
    `${DB.SlotRegistered}`,
    ipcRenderer.listenerCount(DB.SlotRegistered)
  );
  console.log(`${DB.GetAllSlots}`, ipcRenderer.listenerCount(DB.GetAllSlots));
  console.log(`${IO.Opening}`, ipcRenderer.listenerCount(IO.Opening));
  console.log(`${IO.Closed}`, ipcRenderer.listenerCount(IO.Closed));
  console.log(`${IO.Unlock}`, ipcRenderer.listenerCount(IO.Unlock));
  console.log(`${IO.Unlocked}`, ipcRenderer.listenerCount(IO.Unlocked));
  console.log(
    `${IO.WaitForLockBack}`,
    ipcRenderer.listenerCount(IO.WaitForLockBack)
  );
  console.log(`${IO.Dispense}`, ipcRenderer.listenerCount(IO.Dispense));
  console.log(`${IO.Dispensing}`, ipcRenderer.listenerCount(IO.Dispensing));
  console.log(
    `${IO.WaitForDispensingLockBack}`,
    ipcRenderer.listenerCount(IO.WaitForDispensingLockBack)
  );
  console.log(
    `${IO.DispensingClosed}`,
    ipcRenderer.listenerCount(IO.DispensingClosed)
  );
  console.log(
    `${IO.DispensingClear}`,
    ipcRenderer.listenerCount(IO.DispensingClear)
  );
  console.log(
    `${IO.DispensingFinished}`,
    ipcRenderer.listenerCount(IO.DispensingFinished)
  );
}
