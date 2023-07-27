export enum IO {
  GetPortList = "serial-getportlist",
  UpdatePortList = "serial-updateportlist",
  WaitForLockBack = "serial-waitforlockback",
  Unlock = "serial-unlock",
  Unlocked = "serial-unlocked",
  Closed = "serial-closed",
  Opening = "serial-opening",
  Dispense = "serial-dispense",
  Dispensed = "serial-dispensed",
  Dispensing = "serial-dispensing",
  WaitForDispensingLockBack = "serial-dispensinglockback",
  DispensingClosed = "serial-dispensingclose",
  DispensingClear = "serial-clear",
  DispensingContinue = "serial-continue",
  DispensingFinished = "serial-finished",
}
export enum DB {
  RegisterSlot = "db:registerslot",
  SlotRegistered = "db:slotregistered",
  GetAllSlots = "db:getslots",
}

export enum AUTHENTICATION {
  Login = "auth:login",
}

export enum GLOBAL {
  Error = "global:error",
}
export enum INTERIAL {}
