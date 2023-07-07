import { createContext, useContext, useEffect, useState } from "react";
import { ISlot } from "../interfaces/slot";
import { appProviderProps } from "../interfaces/appProviderProps";

//@Dev: Define Context Type
type appContextType = {
  user?: {
    stuffId: string;
    role: string;
  };
  setUser?: (user: { stuffId: string; role: string }) => void;
};

//@Dev define context default values
const appContextDefaultValue: appContextType = {
  user: null,
};

//@Dev create context with context type
const AppContext = createContext<appContextType>(appContextDefaultValue);

//@Dev create provider

export function AppProvider({ children }: appProviderProps) {
  const [user, setActiveUser] = useState<{ stuffId: string; role: string }>();
  useEffect(() => {
    if (user !== null || user !== undefined) {
      console.log("login: ", user);
    }
  }, [user]);

  const setUser = (user: { stuffId: string; role: string }) => {
    setActiveUser(user);
  };

  const value = {
    user,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
