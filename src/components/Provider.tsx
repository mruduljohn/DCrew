"use client";
import React from "react";

import { SessionProvider } from "next-auth/react";
import { AppContextProvider } from "./AppContext";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

const wallets = [new PetraWallet()];

function AppProvider({ children, session }: { children: React.ReactNode, session: any }) {
  return (
    <SessionProvider session={session}>
      <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
        <AppContextProvider>{children}</AppContextProvider>
      </AptosWalletAdapterProvider>
    </SessionProvider>
  );
}

export default AppProvider;
