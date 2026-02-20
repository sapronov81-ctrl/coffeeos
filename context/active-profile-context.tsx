"use client";

import { createContext, useContext } from "react";
import { ActiveProfile } from "@/lib/profiles/get-active-profile";

interface ActiveProfileContextType {
  profile: ActiveProfile | null;
}

const ActiveProfileContext = createContext<ActiveProfileContextType>({
  profile: null,
});

export function ActiveProfileProvider({
  profile,
  children,
}: {
  profile: ActiveProfile | null;
  children: React.ReactNode;
}) {
  return (
    <ActiveProfileContext.Provider value={{ profile }}>
      {children}
    </ActiveProfileContext.Provider>
  );
}

export function useActiveProfile() {
  return useContext(ActiveProfileContext);
}