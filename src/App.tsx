import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Loader2, AlertTriangle } from "lucide-react";

import { config, isSupabaseConfigured } from "./lib/config";
import { fetchMemories } from "./lib/supabase";
import type { Memory } from "./types";

import FloatingElements from "./components/FloatingElements";
import LandingPage from "./components/LandingPage";
import PasswordGate from "./components/PasswordGate";
import PhotoGallery from "./components/PhotoGallery";
import MessageBoard from "./components/MessageBoard";
import Timeline from "./components/Timeline";
import AddMemoryModal from "./components/AddMemoryModal";
import TopBar from "./components/TopBar";
import BottomNav, { type TabKey } from "./components/BottomNav";
import MenuDrawer from "./components/MenuDrawer";
import HomeDashboard from "./components/HomeDashboard";
import { MusicProvider } from "./components/MusicProvider";

type Stage = "landing" | "password" | "app";

// Short script title shown above content on the non-home tabs.
const TAB_TITLES: Partial<Record<TabKey, string>> = {
  gallery: "Memories",
  messages: "Messages",
  timeline: "Timeline",
};

export default function App() {
  const [stage, setStage] = useState<Stage>("landing");
  const [tab, setTab] = useState<TabKey>("home");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Becomes true the moment the user clicks Enter — used to auto-start music
  // on that gesture (browsers require a click before playing sound).
  const [musicAutoStart, setMusicAutoStart] = useState(false);

  // Load memories once we enter the app.
  useEffect(() => {
    if (stage !== "app") return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const data = await fetchMemories();
        if (!cancelled) setMemories(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [stage]);

  const photos = useMemo(
    () => memories.filter((m) => m.type === "photo"),
    [memories]
  );
  const messages = useMemo(
    () => memories.filter((m) => m.type === "message"),
    [memories]
  );

  const handleEnter = () => {
    if (config.passwordEnabled) {
      setStage("password");
    } else {
      // No password screen — the Enter click itself is the audio gesture.
      setMusicAutoStart(true);
      setStage("app");
    }
  };

  // Called from the password gate's Unlock click (a fresh user gesture),
  // so audio can start with sound right as the app appears.
  const handleUnlock = () => {
    setMusicAutoStart(true);
    setStage("app");
  };

  const handleCreated = (m: Memory) => {
    // Prepend so it appears immediately (newest first).
    setMemories((prev) => [m, ...prev]);
  };

  const handleDeleted = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="relative min-h-[100dvh]">
      <FloatingElements />

      <AnimatePresence mode="wait">
        {stage === "landing" && (
          <LandingPage key="landing" onEnter={handleEnter} />
        )}

        {stage === "password" && (
          <PasswordGate key="password" onUnlock={handleUnlock} />
        )}

        {stage === "app" && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
           <MusicProvider autoStart={musicAutoStart}>
            <TopBar onOpenMenu={() => setMenuOpen(true)} />

            <main className="mx-auto w-full max-w-3xl px-4 pb-32 pt-2 sm:px-6">
              {/* Supabase not connected notice */}
              {!isSupabaseConfigured && (
                <div className="glass mb-6 flex items-start gap-3 border-pinkHot/40 p-4 text-left">
                  <AlertTriangle className="mt-0.5 shrink-0 text-pinkHot" size={20} />
                  <p className="font-body text-sm text-darkRose/80">
                    <strong>Supabase isn't connected yet.</strong> Add your{" "}
                    <code>VITE_SUPABASE_URL</code> and{" "}
                    <code>VITE_SUPABASE_ANON_KEY</code> in{" "}
                    <code>.env.local</code> to save & load real memories.
                  </p>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center gap-3 py-24 text-roseGold">
                  <Loader2 className="animate-spin" size={32} />
                  <p className="font-body text-sm">Gathering your memories…</p>
                </div>
              ) : loadError ? (
                <div className="glass mx-auto max-w-md p-8 text-center">
                  <AlertTriangle className="mx-auto mb-3 text-pinkHot" size={32} />
                  <p className="font-body text-darkRose/80">
                    Couldn't load memories. Double-check your Supabase table and
                    keys, then refresh.
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Section title for non-home tabs */}
                    {tab !== "home" && (
                      <h1 className="text-rosegold mb-5 text-center font-script text-4xl">
                        {TAB_TITLES[tab]}
                      </h1>
                    )}

                    {tab === "home" && (
                      <HomeDashboard
                        photos={photos}
                        messages={messages}
                        onViewMemories={() => setTab("gallery")}
                        onViewMessages={() => setTab("messages")}
                      />
                    )}
                    {tab === "gallery" && (
                      <PhotoGallery photos={photos} onDeleted={handleDeleted} />
                    )}
                    {tab === "messages" && (
                      <MessageBoard messages={messages} onDeleted={handleDeleted} />
                    )}
                    {tab === "timeline" && (
                      <Timeline memories={memories} onDeleted={handleDeleted} />
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </main>

            {/* Floating add button — sits above the bottom nav */}
            <motion.button
              onClick={() => setAddOpen(true)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Add a memory"
              className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pinkHot to-plum text-white shadow-glow"
            >
              <Plus size={26} />
            </motion.button>

            <BottomNav active={tab} onChange={setTab} />

            <MenuDrawer
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              active={tab}
              onNavigate={setTab}
              onAdd={() => setAddOpen(true)}
            />

            <AddMemoryModal
              open={addOpen}
              onClose={() => setAddOpen(false)}
              onCreated={handleCreated}
            />
           </MusicProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
