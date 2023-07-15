import { CompleteRegisterSlotDTO } from "../interfaces/dtos/completeRegisterDTO";
import { RegisterDataDTO } from "../interfaces/dtos/registerDTO";
import { SetOpenSlotDTO } from "../interfaces/dtos/setOpenSlotDTO";
import { SlotState } from "../interfaces/slotState";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getSlotsState(): Promise<SlotState[]> {
  const slots = await prisma.slot.findMany({ take: 3 });
  return slots;
}

async function getSlotState(slotNo: number): Promise<SlotState | undefined> {
  const slot = await prisma.slot.findUnique({ where: { id: slotNo } });
  return slot;
}

async function getCurrentOpeningState() {
  const found = await prisma.slot.findMany({ where: { opening: true } });
  if (found.length == 1) {
    return found;
  } else if (found.length > 1) {
    return null;
  } else {
    return null;
  }
}

async function updateSlotState(
  slotNo: number,
  hn: string,
  locked: boolean,
  registered: boolean,
  opening?: boolean
): Promise<SlotState> {
  const updated = await prisma.slot.update({
    data: { hn, locked, registered, opening },
    where: { id: slotNo },
  });

  return updated;
}

async function registerSlot(input: RegisterDataDTO) {
  //@Dev
  //1. Make sure slot is available for registering
  //2. Update the register data in to the database
  //3. return true
  const registered = await isRegistered(input.id);
  if (!registered) {
    await prisma.slot.update({
      data: { hn: input.hn, registered: true },
      where: {
        id: input.id,
      },
    });
    return true;
  } else {
    return false;
  }
}

async function setOpenSlot(input: SetOpenSlotDTO) {
  const opening = await isOpening(input.id);

  if (!opening) {
    await prisma.slot.update({
      where: { id: input.id },
      data: {
        id: input.id,
        hn: input.hn,
        opening: true,
        locked: false,
      },
    });
    return true;
  } else {
    return false;
  }
}

async function completeRegisterSlot(input: CompleteRegisterSlotDTO) {
  const registered = await isRegistered(input.id);
  const opening = await isOpening(input.id);

  if (registered && opening) {
    await prisma.slot.update({
      data: {
        locked: true,
        registered: true,
        opening: false,
      },
      where: {
        id: input.id,
      },
    });
    return true;
  } else {
    return false;
  }
}

async function getDispensingDataFromHN(hn: string) {
  const data = await prisma.slot.findFirst({ where: { hn } });
  if (data != null || data != undefined) {
    return data;
  } else {
    return null;
  }
}

async function isRegistered(id: number) {
  const slot = await prisma.slot.findFirst({ where: { id } });
  return slot.registered;
}

async function isOpening(id: number) {
  const slot = await prisma.slot.findFirst({ where: { id } });
  return slot.opening;
}

async function isLocked(slotNo: number): Promise<boolean> {
  const state = await getSlotState(slotNo);
  return state.locked;
}

export {
  getCurrentOpeningState,
  getSlotState,
  getSlotsState,
  getDispensingDataFromHN,
  registerSlot,
  setOpenSlot,
  completeRegisterSlot,
  isLocked,
  isRegistered,
  isOpening,
};
