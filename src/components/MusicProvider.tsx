import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, VolumeX, SkipForward, SkipBack, Play, Pause } from "lucide-react";

/**
 * Background playlist. Drop up to 3 files in /public/music named
 * song1.mp3, song2.mp3, song3.mp3 (missing ones are skipped automatically).
 * To use your own names or external URLs, edit this array.
 */
export const SONGS = [
  { src: "/music/song1.mp3", title: "Song 1" },
  { src: "/music/song2.mp3", title: "Song 2" },
  { src: "/music/song3.mp3", title: "Song 3" },
];

interface MusicCtx {
  playing: boolean;
  failed: boolean;
  index: number;
  count: number;
  title: string;
  toggle: () => void;
  next: () => void;
  prev: () => void;
}

const Ctx = createContext<MusicCtx | null>(null);

export function useMusic(): MusicCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMusic must be used inside <MusicProvider>");
  return c;
}

export function MusicProvider({
  children,
  autoStart = false,
}: {
  children: React.ReactNode;
  autoStart?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef(0);
  const activeRef = useRef(false); // user has intended to play (gates error-skip)
  const errorsRef = useRef(0);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  // Play a given track index (wraps around the list).
  const playIndex = useCallback((i: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const idx = ((i % SONGS.length) + SONGS.length) % SONGS.length;
    indexRef.current = idx;
    setIndex(idx);
    activeRef.current = true;
    audio.src = SONGS[idx].src;
    audio
      .play()
      .then(() => {
        setPlaying(true);
        setFailed(false);
        errorsRef.current = 0;
      })
      .catch(() => setPlaying(false));
  }, []);

  // One audio element for the whole app; auto-advance on end, skip on error.
  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.4;
    audio.preload = "auto";
    audioRef.current = audio;

    const onEnded = () => playIndex(indexRef.current + 1);
    const onError = () => {
      if (!activeRef.current) return; // ignore load errors before user starts
      errorsRef.current += 1;
      if (errorsRef.current >= SONGS.length) {
        setFailed(true);
        setPlaying(false);
        return;
      }
      playIndex(indexRef.current + 1);
    };
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [playIndex]);

  // Kick off on the Enter/Unlock gesture.
  useEffect(() => {
    if (autoStart) playIndex(indexRef.current);
  }, [autoStart, playIndex]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      if (!audio.src) {
        playIndex(indexRef.current);
        return;
      }
      activeRef.current = true;
      audio
        .play()
        .then(() => {
          setPlaying(true);
          setFailed(false);
        })
        .catch(() => setFailed(true));
    }
  }, [playing, playIndex]);

  const next = useCallback(() => playIndex(indexRef.current + 1), [playIndex]);
  const prev = useCallback(() => playIndex(indexRef.current - 1), [playIndex]);

  const value: MusicCtx = {
    playing,
    failed,
    index,
    count: SONGS.length,
    title: SONGS[index]?.title ?? "",
    toggle,
    next,
    prev,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Compact play/pause button (with drifting notes) for the top bar. */
export function MusicButton() {
  const { playing, toggle, failed } = useMusic();
  return (
    <div className="relative">
      <AnimatePresence>
        {playing &&
          [0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 0, x: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: 34, x: (i - 1) * 12, scale: 1 }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
              className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 text-pinkHot"
            >
              ♪
            </motion.span>
          ))}
      </AnimatePresence>

      <button
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        title={failed ? "Add songs at /public/music/song1.mp3 …" : "Toggle music"}
        className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/60 shadow-soft backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 ${
          playing
            ? "bg-gradient-to-br from-pinkHot to-plum text-white shadow-glow"
            : "bg-white/60 text-roseGold"
        }`}
      >
        {playing ? <Music size={19} /> : <VolumeX size={19} />}
      </button>
    </div>
  );
}

/** Full playlist controls (prev / play / next + track label) for the menu. */
export function MusicPanel() {
  const { playing, toggle, next, prev, index, count, title, failed } = useMusic();
  return (
    <div className="glass mt-4 flex flex-col gap-2 border-white/50 p-3">
      <div className="flex items-center justify-between">
        <p className="font-body text-sm font-medium text-darkRose">
          🎵 {title}
        </p>
        <span className="font-body text-xs text-roseGold">
          {index + 1} / {count}
        </span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={prev}
          aria-label="Previous song"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-darkRose transition hover:bg-white active:scale-95"
        >
          <SkipBack size={16} />
        </button>
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pinkHot to-plum text-white shadow-soft transition hover:scale-105 active:scale-95"
        >
          {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button
          onClick={next}
          aria-label="Next song"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-darkRose transition hover:bg-white active:scale-95"
        >
          <SkipForward size={16} />
        </button>
      </div>
      {failed && (
        <p className="text-center font-body text-[10px] leading-tight text-darkRose/60">
          Add songs at <code>/public/music/song1.mp3</code> (…2, …3)
        </p>
      )}
    </div>
  );
}
