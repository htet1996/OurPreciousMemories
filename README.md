# 🌸 Our Memory Garden

A soft, romantic birthday memory web app — a digital gift where you and your friend can store **photos**, **messages**, and a **timeline** of memories, and always come back to add more.

Built with **React + Vite + TypeScript + Tailwind + Framer Motion**, data stored in **Supabase** (free), deployed on **Vercel** (free).

<p align="center">
  <em>Landing → confetti 🎉 → password gate 🔒 → Gallery · Messages · Timeline → ➕ add memory → 🎵 music</em>
</p>

---

## ✨ Features

- 🎉 **Landing page** with a confetti burst + gently pulsing "Enter" button
- 🔒 **Password gate** (configurable, with a cute shake on wrong password)
- 🖼️ **Photo gallery** — masonry grid, hover zoom/glow, fullscreen lightbox with arrow/swipe navigation
- 💌 **Messages** — heartfelt letter cards with author + date
- 🕰️ **Timeline** — everything in chronological order along a soft line
- ➕ **Add Memory** — upload photos or write messages, appears instantly
- 🎵 **Background music** — floating toggle, starts muted, drifting music notes
- 🌸 Falling hearts, petals & sparkles; glassmorphism cards; fully mobile-first & responsive

---

## 🚀 Quick Start (local)

```bash
npm install
cp .env.local.example .env.local   # then edit .env.local with your keys
npm run dev                        # open http://localhost:5173
```

The app runs **without Supabase** too — it just shows a friendly "connect Supabase" notice and empty states until you add your keys.

### Build for production

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build locally
```

---

## 🔑 Environment Variables

Copy `.env.local.example` → `.env.local` and fill in:

| Variable | What it is |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` public key |
| `VITE_APP_PASSWORD` | The password people type to enter |
| `VITE_PASSWORD_ENABLED` | `true` or `false` — turn the password screen on/off |
| `VITE_BIRTHDAY_NAME` | Her name (shown as "For …") |
| `VITE_BIRTHDAY_AGE` | Age number (e.g. `28`) |
| `VITE_GREETING` | Big headline, e.g. `Happy 28th Birthday!` |
| `VITE_SUBTITLE` | Small line under the headline |

> ⚠️ All variables **must** start with `VITE_`, or Vite ignores them.
> Note: because this is a frontend app, the password is not military-grade security — it's a sweet gate to keep the gift semi-private. Don't store real secrets in it.

---

## 🗄️ Supabase Setup (one time)

1. Create a free project at **https://supabase.com**.
2. Open **SQL Editor → New query**, paste the contents of [`supabase/setup.sql`](supabase/setup.sql), and click **Run**.
   - This creates the `memories` table, the public `photos` storage bucket, and the security policies.
3. Go to **Project Settings → API** and copy the **Project URL** and **anon public** key into your `.env.local` (and later into Vercel).

That's it — the app will now save and load real memories.

### Table: `memories`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | primary key (auto) |
| `type` | text | `"photo"` or `"message"` |
| `image_url` | text | photo URL (null for messages) |
| `caption` | text | photo caption **or** message text |
| `author` | text | who added it |
| `created_at` | timestamptz | auto |

### Storage bucket: `photos`

Public bucket, accepts jpg/png/webp/gif, up to 5MB per file (enforced in the UI).

---

## 🎵 Adding Background Music

Drop an mp3 into `public/music/` named **`song.mp3`**.
To use a different name or an external URL, edit `SONG_URL` in `src/components/MusicPlayer.tsx`.

Music starts **off** (browsers block autoplay) — tap the floating note button, bottom-left.

---

## ▲ Deploy to Vercel

1. Push this folder to a **GitHub** repo.
2. Go to **https://vercel.com → New Project → Import** your repo.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output `dist`.
4. Add your environment variables (same as `.env.local`) under **Settings → Environment Variables**.
5. **Deploy** → you get a public link like `https://our-memory-garden.vercel.app`.

`vercel.json` is included so client-side routing/refreshes always resolve.

---

## 🎨 Customizing

| Want to change… | Edit… |
|---|---|
| Name / greeting / subtitle / age | `.env.local` (and Vercel env vars) |
| Password (or turn it off) | `VITE_APP_PASSWORD` / `VITE_PASSWORD_ENABLED` |
| Colors | `tailwind.config.ts` → `theme.extend.colors` |
| Fonts | `index.html` (Google Fonts link) + `tailwind.config.ts` |
| Music file | `public/music/song.mp3` or `SONG_URL` in `MusicPlayer.tsx` |
| Falling emojis | `EMOJIS` array in `src/components/FloatingElements.tsx` |

---

## 📁 Project Structure

```
Our Memory Garden/
├── public/
│   ├── favicon.svg
│   └── music/            (put song.mp3 here)
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx      PasswordGate.tsx
│   │   ├── PhotoGallery.tsx     PhotoUpload.tsx
│   │   ├── MessageBoard.tsx     AddMessage.tsx
│   │   ├── Timeline.tsx         AddMemoryModal.tsx
│   │   ├── MusicPlayer.tsx      FloatingElements.tsx
│   │   ├── Lightbox.tsx         Confetti.tsx
│   ├── lib/     (supabase.ts, config.ts, format.ts)
│   ├── types/   (index.ts)
│   ├── App.tsx  main.tsx  index.css
├── supabase/setup.sql
├── .env.local.example
├── tailwind.config.ts  vite.config.ts  vercel.json
└── package.json
```

---

Made with 💗 as a birthday gift. Enjoy your garden of memories.
