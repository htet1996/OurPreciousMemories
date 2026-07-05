import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Lock, Heart } from "lucide-react";
import { config } from "../lib/config";

interface Props {
  onUnlock: () => void;
}

export default function PasswordGate({ onUnlock }: Props) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value === config.password) {
      onUnlock();
    } else {
      setWrong(true);
      setValue("");
      // clear the shake so it can retrigger next time
      window.setTimeout(() => setWrong(false), 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[100dvh] items-center justify-center px-6"
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 24, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className={`glass w-full max-w-sm p-8 text-center ${
          wrong ? "animate-shake" : ""
        }`}
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pinkHot to-plum text-white shadow-glow">
          <Lock size={28} />
        </div>

        <h1 className="heading-script text-3xl">A little secret</h1>
        <p className="mt-1 font-body text-sm text-darkRose/70">
          Enter the password to open your gift 💝
        </p>

        <input
          type="password"
          inputMode="text"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Password"
          aria-label="Password"
          className="mt-6 w-full rounded-full border border-pinkSoft/70 bg-white/80 px-5 py-3 text-center font-body text-darkRose outline-none transition focus:border-pinkHot focus:shadow-glow"
        />

        {wrong && (
          <p className="mt-3 font-body text-sm text-pinkHot">
            Oops, that's not it — try again 🙈
          </p>
        )}

        <button type="submit" className="btn-primary mt-6 w-full">
          <Heart size={18} /> Unlock
        </button>
      </motion.form>
    </motion.div>
  );
}
