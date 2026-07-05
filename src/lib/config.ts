// Central place for all customizable text + settings.
// Everything here is driven by .env.local (and Vercel env vars),
// with friendly fallbacks so the app always renders.

const env = import.meta.env;

export const config = {
  name: env.VITE_BIRTHDAY_NAME?.trim() || "Beautiful",
  age: env.VITE_BIRTHDAY_AGE?.trim() || "28",
  greeting: env.VITE_GREETING?.trim() || "Happy 28th Birthday!",
  subtitle:
    env.VITE_SUBTITLE?.trim() ||
    "A little garden of our memories, always growing 🌸",
  // Shown on the landing page BEFORE the gift box appears.
  intro: env.VITE_INTRO?.trim() || "Someone loves you very much 💗",
  password: env.VITE_APP_PASSWORD ?? "loveyou28",
  passwordEnabled: (env.VITE_PASSWORD_ENABLED ?? "true").toLowerCase() !== "false",
};

// True only when Supabase env vars are set to real-looking values.
// Lets the app render a friendly notice instead of crashing when unconfigured.
export const isSupabaseConfigured =
  !!env.VITE_SUPABASE_URL &&
  !!env.VITE_SUPABASE_ANON_KEY &&
  !env.VITE_SUPABASE_URL.includes("YOUR-PROJECT") &&
  !env.VITE_SUPABASE_ANON_KEY.includes("your-anon");
