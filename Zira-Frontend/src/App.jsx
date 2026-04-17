import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./Route/AppRoutes";
import { useEffect, useRef } from "react";

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    // ✅ create audio only once
    if (!audioRef.current) {
      const audio = new Audio("/music/music.mp3");
      audio.loop = true;
      audio.volume = 0.4;
      audio.preload = "auto";
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    const playOnce = async () => {
      if (hasPlayedRef.current) return;

      try {
        await audio.play();
        hasPlayedRef.current = true;

        // remove listeners after first success
        removeListeners();
      } catch (e) {
        console.log("❌ Play blocked:", e);
      }
    };

    const removeListeners = () => {
      document.removeEventListener("mousedown", playOnce);
      document.removeEventListener("keydown", playOnce);
      document.removeEventListener("touchstart", playOnce);
    };

    // attach listeners
    document.addEventListener("mousedown", playOnce);
    document.addEventListener("keydown", playOnce);
    document.addEventListener("touchstart", playOnce);

    return () => {
      removeListeners();
      // ❗ DO NOT pause → keeps music persistent across routes
    };
  }, []);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <BackgroundMusic />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
