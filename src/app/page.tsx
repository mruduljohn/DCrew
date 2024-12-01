"use client";

import { useSession, signIn, signOut } from "next-auth/react";

function App() {

  const backgroundImage = "/bg/image.jpg";

  const { data: session } = useSession();

  const handleLogin = () => {
    session ? signOut() : signIn();
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

      {/* <div
        className="nes-btn is-warning bg-pink-300 text-black px-6 py-3 rounded-lg shadow-md text-lg"
      > */}
      <button
        className="nes-btn is-warning bg-pink-300 text-black px-6 py-3 rounded-lg shadow-md text-lg"
        onClick={handleLogin}
      >
        Google {session ? "Log Out" : "Log In"}
      </button>
      {/* </div> */}
    </div>

  );
}

export default App;
