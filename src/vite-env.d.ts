/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_PASSWORD: string;
  readonly VITE_BIRTHDAY_NAME: string;
  readonly VITE_BIRTHDAY_AGE: string;
  readonly VITE_GREETING: string;
  readonly VITE_SUBTITLE: string;
  readonly VITE_INTRO: string;
  readonly VITE_PASSWORD_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
