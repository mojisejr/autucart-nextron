export enum IO {
  WaitForLockBack = "serial:waitforlockback",
  Unlock = "serial:unlock",
  Unlocked = "serial:unlocked",
  Closed = "serial:closed",
  Opening = "serial:opening",
  Dispense = "serial:dispense",
  Dispensing = "serial:dispensing",
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
