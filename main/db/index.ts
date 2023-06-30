import Store from "electron-store";
import { AppData } from "../interfaces/appData";
import { SlotState } from "../interfaces/slotState";

const store = new Store<AppData>({
  defaults: {
    slots: [
      {
        slotNo: 1,
        locked: false,
      },
      {
        slotNo: 2,
        locked: false,
      },
      {
        slotNo: 3,
        locked: false,
      },
      {
        slotNo: 4,
        locked: false,
      },
      {
        slotNo: 5,
        locked: false,
      },
    ],
  },
});

export function getSlotsState(): SlotState[] {
  const slots = store.get("slots") as SlotState[];
  return slots;
}

export function getSlotState(slotNo: number): SlotState | undefined {
  const slots = store.get("slots") as SlotState[];
  return slots.find((slot) => slot.slotNo === slotNo);
}

export function updateSlotState(
  slotNo: number,
  hn: string,
  locked: boolean
): void {
  const slots = store.get("slots") as SlotState[];
  const updatedSlots = slots.map((slot) => {
    if (slot.slotNo === slotNo) {
      return {
        slotNo: slotNo,
        hn: hn,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        locked: locked,
      };
    }
    return slot;
  });
  store.set("slots", updatedSlots);
}

export function isLocked(slotNo: number): boolean {
  const state = getSlotState(slotNo);
  return state.locked ? true : false;
}

export function lockSlot(slotNo: number, hn: string): void {
  updateSlotState(slotNo, hn, true);
}
export function unlockSlot(slotNo: number): void {
  updateSlotState(slotNo, undefined, false);
}
