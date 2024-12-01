'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef } from "react";

function App() {
  const backgroundImage = "/bg/image.jpg";

  const { data: session } = useSession();

  const handleLogin = () => {
    if (session) {
      signOut();
    } else {
      signIn('google', { callbackUrl: '/wallet' });
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className="h-screen w-screen flex flex-col justify-center items-center animate-backgroundMove relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Music Icon */}
      <button
        className="absolute top-4 left-4"
        onClick={toggleMusic}
        aria-label="Toggle Music"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <img
          src={isPlaying ? "icons/music_on.svg" : "icons/music_off.svg"}
          alt={isPlaying ? "Music On" : "Music Off"}
          className="w-10 h-10"
        />
      </button>
      <audio ref={audioRef} src="/music/retromusic.mp3" loop />

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
        onClick={handleLogin}
      >
        Google {session ? "Log Out" : "Log In"}
      </button>
    </div>
  );
}

export default App;
