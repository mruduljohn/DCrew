"use client";

import { useRouter } from "next/navigation"; // Import useRouter for navigation

function App() {
  const router = useRouter(); // Initialize the router
  const backgroundImage = "/bg/image.jpg";

  const handleStartGame = () => {
    router.push("/home"); // Navigate to the specified route
  };

  return (
    <div
  className="h-screen w-screen flex flex-col justify-center items-center animate-backgroundMove"
  style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
<h1
  className="nes-text is-success text-4xl font-bold text-black mb-6"
  style={{
    textShadow: "2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000",
  }}
>
  CRYPTOHUNT
</h1>

  <button
    className="nes-btn is-warning bg-pink-300 text-black px-6 py-3 rounded-lg shadow-md text-lg"
    onClick={handleStartGame}
  >
    START GAME
  </button>
</div>

  );
}

export default App;
