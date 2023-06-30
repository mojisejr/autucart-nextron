import { createContext, useContext, useEffect, useState } from "react";
import { ISlot } from "../interfaces/slot";
import { appProviderProps } from "../interfaces/appProviderProps";
import { ipcRenderer } from "electron";

//@Dev: Define Context Type
type appContextType = {
  slots: ISlot[];
  getSlots: () => ISlot[];
  getSlot: (slotNo: number) => ISlot;
  setSlot: (slotNo: number, data: Partial<ISlot>) => void;
};

//@Dev define context default values
const appContextDefaultValue: appContextType = {
  slots: [],
  getSlots: () => [],
  getSlot: () => undefined,
  setSlot: () => {},
};

//@Dev create context with context type
const AppContext = createContext<appContextType>(appContextDefaultValue);

//@Dev create provider

export function AppProvider({ children }: appProviderProps) {
  const [slots, setSlotData] = useState<ISlot[]>([]);

  useEffect(() => {
    ipcRenderer.on("slots", (event, args) => {
      setSlotData(args);
    });
  }, []);

  function getSlot(slotNo: number): ISlot {
    return slots.find((m) => m.slotNo == slotNo);
  }

  function getSlots(): ISlot[] {
    return slots;
  }

  function setSlot(slotNo: number, slotData: Partial<ISlot>) {}

  const value = {
    slots,
    getSlots,
    getSlot,
    setSlot,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
