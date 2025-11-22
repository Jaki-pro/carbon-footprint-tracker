"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type UserStatusContextType = {
  isNewUser: boolean;
  setIsNewUser: (value: boolean) => void;
};

const UserStatusContext = createContext<UserStatusContextType | undefined>(undefined);

export function UserStatusProvider({ children }: { children: ReactNode }) {
  const [isNewUser, setIsNewUser] = useState<boolean>(true);

  return (
    <UserStatusContext.Provider value={{ isNewUser, setIsNewUser }}>
      {children}
    </UserStatusContext.Provider>
  );
}

export function useUserStatus() {
  const ctx = useContext(UserStatusContext);
  if (!ctx) {
    throw new Error("useUserStatus must be used inside UserStatusProvider");
  }
  return ctx;
}
