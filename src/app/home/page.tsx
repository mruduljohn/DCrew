"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

// Define a new BottomNav component
const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-blue-300 flex justify-evenly items-center py-4 rounded-t-lg shadow-lg">
      <button className="nes-btn is-primary px-4 py-2">AR</button>
      <button className="nes-btn is-success px-4 py-2">WALLET</button>
      <button className="nes-btn is-warning px-4 py-2">MAP</button>
    </div>
  );
};

function App() {
  const { connected } = useWallet();
  const backgroundImage = "/bg/image.jpg";

  return (
    <div
      className="h-screen w-screen flex flex-col justify-center items-center animate-backgroundMove"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center justify-center h-screen pb-20">
        {connected ? (
          <div className="flex flex-col items-center justify-center flex-grow">
            <h1 className="text-2xl font-bold">Connected to Wallet</h1>
            {/* Example NES-styled button */}
            <button className="nes-btn is-success mt-4 px-6 py-2">
              View Wallet
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow">
          <h1 className="text-lg font-bold text-center text-white">
            To get started, connect a wallet.
          </h1>
          <button className="nes-btn is-primary mt-4 px-6 py-2">
            Connect Wallet
          </button>
        </div>

        )}
      </div>
      <BottomNav />
    </div>
  );
}

export default App;
