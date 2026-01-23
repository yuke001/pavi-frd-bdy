import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./MusicPlayer.css";

const MusicPlayer = forwardRef((props, ref) => {
  const audioRef = useRef(null);

  // 🎶 Playlist
  const playlist = [
    "/blood.mp3",
    "/tere.mp3",
    "/smile.mp3",
    // "/music4.mp3",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.log("Autoplay blocked:", err);
        setIsPlaying(false);
      });
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  };

  const toggleMusic = () => {
    isPlaying ? pauseAudio() : playAudio();
  };

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  // Auto-play next track
  const handleEnded = () => {
    nextTrack();
  };

  // Load track when index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = playlist[currentIndex];
    audio.volume = 0.5;

    if (isPlaying) {
      playAudio();
    }
  }, [currentIndex]);

  // Try autoplay on mount
  useEffect(() => {
    playAudio();
  }, []);

  useImperativeHandle(ref, () => ({
    play: playAudio,
    pause: pauseAudio,
    toggle: toggleMusic,
  }));

  return (
    <>
      <audio ref={audioRef} preload="auto" onEnded={handleEnded} />

      <div className="music-controls">
        <button
          className="music-toggle"
          onClick={toggleMusic}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? "⏸ Pause Music" : "🎵 Play Music"}
        </button>

        <button
          className="music-next"
          onClick={nextTrack}
          aria-label="Next track"
        >
          ⏭
        </button>
      </div>
    </>
  );
});

MusicPlayer.displayName = "MusicPlayer";
export default MusicPlayer;
