import { SlotState } from "../interfaces/slotState";
import { prisma } from "./prisma";

export async function getSlotsState(): Promise<SlotState[]> {
  const slots = await prisma.slot.findMany({ take: 15 });
  return slots;
}

export async function getSlotState(
  slotNo: number
): Promise<SlotState | undefined> {
  const slot = await prisma.slot.findUnique({ where: { id: slotNo } });
  return slot;
}

export async function updateSlotState(
  slotNo: number,
  hn: string,
  locked: boolean
): Promise<SlotState> {
  const updated = await prisma.slot.update({
    data: { hn, locked },
    where: { id: slotNo },
  });

  return updated;
  // const slots = store.get("slots") as SlotState[];
  // const updatedSlots = slots.map((slot) => {
  //   if (slot.slotNo === slotNo) {
  //     return {
  //       slotNo: slotNo,
  //       hn: hn,
  //       date: new Date().toLocaleDateString(),
  //       time: new Date().toLocaleTimeString(),
  //       locked: locked,
  //     };
  //   }
  //   return slot;
  // });
  // store.set("slots", updatedSlots);
}

export async function isLocked(slotNo: number): Promise<boolean> {
  const state = await getSlotState(slotNo);
  return state.locked ? true : false;
}

export async function lockSlot(slotNo: number, hn: string): Promise<void> {
  await updateSlotState(slotNo, hn, true);
}
export async function unlockSlot(hn: string): Promise<void> {
  // await updateSlotState(slotNo, undefined, false);
}
