
"use client";
import React from "react";

import { SessionProvider } from "next-auth/react";
import { AppContextProvider } from "./AppContext";

function AppProvider({ children, session }: { children: React.ReactNode, session: any }) {
  return (
    <SessionProvider session={session}>
      <AppContextProvider>{children}</AppContextProvider>
    </SessionProvider>
  );
}

export default AppProvider;