"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js

// Define a new BottomNav component
const BottomNav = () => {
  const router = useRouter(); // Initialize router

  const handleMapClick = () => {
    router.push("/map"); // Navigate to map page
  };

  const handleARClick = () => {
    router.push("/arhome"); // Navigate to AR home page
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-blue-300 flex justify-evenly items-center py-4 rounded-t-lg shadow-lg">
      <button
        className="nes-btn is-primary px-4 py-2"
        onClick={handleARClick} // Route to AR home page
      >
        AR
      </button>
      <button
        className="nes-btn is-success px-4 py-2"
        onClick={() => console.log('Wallet clicked')} // Add your wallet functionality here
      >
        WALLET
      </button>
      <button
        className="nes-btn is-warning px-4 py-2"
        onClick={handleMapClick} // Route to Map page
      >
        MAP
      </button>
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
