# 🌸 လမ်းညွှန် (မြန်မာဘာသာ) — Our Memory Garden

ဒီ app ကို အဆင့်ဆင့် တည်ဆောက်၊ တင်၊ မျှဝေနည်း အသေးစိတ်။ (coding အခြေခံရှိပြီး Supabase/Vercel မသုံးဖူးသူများအတွက် ရေးထားပါတယ်။)

---

## အပိုင်း ၁ — Supabase Setup (Database + ဓာတ်ပုံသိမ်းရန်)

Supabase ဆိုတာ ဒေတာ (မက်ဆေ့ချ်၊ ဓာတ်ပုံ) တွေ သိမ်းဆည်းပေးတဲ့ အခမဲ့ online database ဖြစ်ပါတယ်။

### ၁.၁ — Account ဖွင့်ခြင်း
1. Browser မှာ **https://supabase.com** သွားပါ။
2. ညာဘက်အပေါ်က **"Start your project"** (သို့) **"Sign in"** ကိုနှိပ်ပါ။
3. **GitHub account** နဲ့ ဝင်တာ အလွယ်ဆုံးပါ (GitHub မရှိသေးရင် အရင်ဆောက်ပါ — အခမဲ့)။

### ၁.၂ — Project အသစ်ဆောက်ခြင်း
1. Dashboard ထဲရောက်ရင် **"New Project"** ကိုနှိပ်ပါ။
2. အချက်အလက်ဖြည့်ပါ —
   - **Name**: `memory-garden` (ကြိုက်တာပေးလို့ရ)
   - **Database Password**: ခိုင်ခံ့တဲ့ password တစ်ခုထည့်ပြီး **သေချာမှတ်ထားပါ** (နောက်ပိုင်း database အတွက်လိုနိုင်)။
   - **Region**: မိမိနဲ့အနီးဆုံး (ဥပမာ — Singapore) ရွေးပါ။
3. **"Create new project"** နှိပ်ပြီး ၁–၂ မိနစ်လောက် စောင့်ပါ (database ပြင်ဆင်နေတာ)။

### ၁.၃ — Table နဲ့ Storage ဆောက်ခြင်း (အရေးကြီး)
1. ဘယ်ဘက် menu ထဲက **SQL Editor** (စာရွက်ပုံ icon) ကိုနှိပ်ပါ။
2. **"+ New query"** နှိပ်ပါ။
3. project folder ထဲက **`supabase/setup.sql`** ဖိုင်ကိုဖွင့်ပြီး **အကုန်လုံး copy** ကူးပါ။
4. SQL Editor ထဲ paste လုပ်ပြီး ညာဘက်အောက်က **"Run"** (သို့ Ctrl+Enter) နှိပ်ပါ။
5. အောက်မှာ **"Success"** ပြရင် ✅ ပြီးပါပြီ — `memories` table နဲ့ `photos` bucket အလိုအလျောက်ဆောက်ပြီးသွားပါပြီ။

### ၁.၄ — Keys (သော့) ၂ ခု ယူခြင်း
1. ဘယ်ဘက်အောက်ဆုံးက **Project Settings** (ဂီယာ icon ⚙️) → **API** ကိုနှိပ်ပါ။
2. အောက်ပါ ၂ ခုကို copy ကူးထားပါ —
   - **Project URL** — ဥပမာ `https://abcdxyz.supabase.co`
   - **anon public** key — (`Project API keys` အောက်မှာ၊ အရှည်ကြီး စာတန်း)
   - ⚠️ **`service_role` key ကိုတော့ လုံးဝမသုံးပါနဲ့** — အဲဒါ လျှို့ဝှက်သော့ဖြစ်ပြီး browser မှာ မထည့်ရပါ။

---

## အပိုင်း ၂ — `.env.local` ဖိုင် ပြင်ဆင်ခြင်း

ဒီဖိုင်က မိမိရဲ့ keys၊ password၊ စာသားတွေ သိမ်းထားရာ နေရာဖြစ်ပါတယ်။

1. Project folder ထဲက **`.env.local`** ဖိုင်ကို text editor (VS Code) နဲ့ဖွင့်ပါ။
   (မရှိရင် `.env.local.example` ကို copy ကူးပြီး `.env.local` လို့ အမည်ပြောင်းပါ။)
2. အောက်ပါအတိုင်း မိမိ value တွေ ဖြည့်ပါ —

```env
VITE_SUPABASE_URL=https://abcdxyz.supabase.co        ← အပိုင်း ၁.၄ က Project URL
VITE_SUPABASE_ANON_KEY=eyJhbGci...အရှည်ကြီး...        ← anon public key

VITE_APP_PASSWORD=loveyou28                          ← သူငယ်ချင်းထည့်ရမယ့် password
VITE_PASSWORD_ENABLED=true                           ← password မလိုချင်ရင် false

VITE_BIRTHDAY_NAME=Su Su                             ← သူ့နာမည်
VITE_BIRTHDAY_AGE=28
VITE_GREETING=Happy 28th Birthday!                   ← ခေါင်းစဉ်ကြီး
VITE_SUBTITLE=ငါတို့ရဲ့ အမှတ်တရလေးတွေ 🌸             ← အောက်က စာကြောင်းလေး
```

3. သိမ်းပါ (Ctrl+S)။
4. ⚠️ အမှတ်ရရန် — variable တိုင်း **`VITE_`** နဲ့ စရပါမယ်။ မဟုတ်ရင် app က မသိပါ။
5. local မှာ စမ်းချင်ရင် — terminal ဖွင့်ပြီး `npm run dev` ရိုက်ပါ → `http://localhost:5173` ကိုဖွင့်ကြည့်ပါ။

---

## အပိုင်း ၃ — Vercel မှာ Deploy (Online တင်ခြင်း)

Vercel က မိမိ website ကို အခမဲ့ online လင့်ခ် ထုတ်ပေးပါတယ်။

### ၃.၁ — GitHub ကို Code တင်ခြင်း
1. **https://github.com** မှာ repository အသစ် (ဥပမာ `memory-garden`) ဆောက်ပါ — **Private** ထားနိုင်ပါတယ်။
2. Project folder ထဲမှာ terminal ဖွင့်ပြီး —

```bash
git init
git add .
git commit -m "Birthday memory garden"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/memory-garden.git
git push -u origin main
```

> 💡 `.env.local` က `.gitignore` ထဲမှာ ပါပြီးသားမို့ GitHub ကို **မတက်ပါ** — password/key တွေ လုံခြုံပါတယ်။ ဒါကြောင့် Vercel မှာ ပြန်ထည့်ပေးရပါမယ် (အောက်မှာ)။

### ၃.၂ — Vercel မှာ Import
1. **https://vercel.com** သွားပြီး **GitHub နဲ့ Sign up/Sign in** ဝင်ပါ။
2. **"Add New…" → "Project"** နှိပ်ပါ။
3. မိမိ `memory-garden` repo ဘေးက **"Import"** နှိပ်ပါ။
4. **Framework Preset** မှာ **Vite** အလိုအလျောက်ပြပါလိမ့်မယ် (မပြရင် Vite ရွေးပါ)။
   - Build Command: `npm run build` · Output Directory: `dist` (default အတိုင်းထားပါ)။

### ၃.၃ — Environment Variables ထည့်ခြင်း (မမေ့ပါနဲ့!)
Deploy မလုပ်ခင် **"Environment Variables"** အပိုင်းမှာ `.env.local` ထဲက အကုန်လုံး တစ်ခုချင်း ထည့်ပါ —

| Name (Key) | Value |
|---|---|
| `VITE_SUPABASE_URL` | မိမိ Project URL |
| `VITE_SUPABASE_ANON_KEY` | မိမိ anon key |
| `VITE_APP_PASSWORD` | `loveyou28` (ကြိုက်တာ) |
| `VITE_PASSWORD_ENABLED` | `true` |
| `VITE_BIRTHDAY_NAME` | `Su Su` |
| `VITE_BIRTHDAY_AGE` | `28` |
| `VITE_GREETING` | `Happy 28th Birthday!` |
| `VITE_SUBTITLE` | မိမိစာသား |

တစ်ခုစီ Name + Value ဖြည့်ပြီး **"Add"** နှိပ်ပါ။

### ၃.၄ — Deploy
1. **"Deploy"** ခလုတ်ကြီး နှိပ်ပါ။
2. ၁–၂ မိနစ်စောင့်ပြီး 🎉 ပေါ်လာရင် ပြီးပါပြီ။
3. **"Visit"** နှိပ်ရင် မိမိ website လင့်ခ် ရပါပြီ — ဥပမာ `https://memory-garden.vercel.app`

> 🔁 နောက်ပိုင်း env value တစ်ခုခု ပြောင်းရင် — Vercel → **Settings → Environment Variables** မှာ ပြင်ပြီး **Deployments → ⋯ → Redeploy** လုပ်ပါ။

---

## အပိုင်း ၄ — ဓာတ်ပုံတင်ခြင်း / မက်ဆေ့ချ်ရေးခြင်း

App ထဲရောက်ရင် (password ဖြည့်ပြီးရင်) —

1. ညာဘက်အောက်ခြေက **➕ (အဝါရောင် ခလုတ်လုံး)** ကိုနှိပ်ပါ။
2. အပေါ်မှာ **Photo** နဲ့ **Message** ဆိုပြီး ၂ ခန်း ရွေးလို့ရပါတယ်။

**ဓာတ်ပုံတင်ရန်:**
- **Photo** ကိုရွေး → အလယ်က နေရာနှိပ်ပြီး ဖုန်း/ကွန်ပျူတာက ဓာတ်ပုံရွေး → caption (စာတန်းလေး) နဲ့ နာမည် ထည့် (မထည့်လည်းရ) → **"Add Photo"** နှိပ်ပါ။
- (ဓာတ်ပုံ 5MB အောက်ဖြစ်ရပါမယ်။)

**မက်ဆေ့ချ်ရေးရန်:**
- **Message** ကိုရွေး → စာသားရေး → မိမိနာမည်ထည့် → **"Save Message"** နှိပ်ပါ။

တင်ပြီးတာနဲ့ Gallery / Messages / Timeline မှာ **ချက်ချင်း ပေါ်လာ** ပါလိမ့်မယ်။ ဘယ်သူမဆို (လင့်ခ် + password ရှိရင်) အချိန်မရွေး လာထည့်လို့ရပါတယ်။

---

## အပိုင်း ၅ — သူငယ်ချင်းကို လင့်ခ်မျှဝေခြင်း

1. Vercel က ရလာတဲ့ လင့်ခ် (ဥပမာ `https://memory-garden.vercel.app`) ကို copy ကူးပါ။
2. Password ကိုပါ တစ်ခါတည်း အတူ ပို့ပေးပါ (ဥပမာ — "password က `loveyou28` နော် 💗")။
3. Messenger / Viber / SMS နဲ့ ပို့လိုက်ရုံပါပဲ — ဖုန်းမှာ တန်းဖွင့်ကြည့်လို့ရပါတယ် (mobile အတွက် အထူးအဆင်ပြေအောင် ဒီဇိုင်းဆွဲထားပါတယ်)။

> 💡 QR code လုပ်ချင်ရင် — google မှာ "QR code generator" ရှာ → လင့်ခ်ထည့် → ထွက်လာတဲ့ QR ကို ကတ်ပြားပေါ်ထည့်ပြီး လက်ဆောင်ပေးလို့ ပိုချစ်စရာ ✨

---

## အပိုင်း ၆ — နာမည်၊ Password၊ Greeting ပြောင်းခြင်း

အကုန်လုံး **`.env.local`** (local) နဲ့ **Vercel → Settings → Environment Variables** (online) မှာ ပြောင်းရုံပါပဲ —

| ပြောင်းချင်တာ | Variable | ဥပမာ |
|---|---|---|
| သူ့နာမည် | `VITE_BIRTHDAY_NAME` | `Su Su` |
| အသက် | `VITE_BIRTHDAY_AGE` | `28` |
| ခေါင်းစဉ်ကြီး | `VITE_GREETING` | `Happy 28th Birthday!` |
| အောက်စာကြောင်း | `VITE_SUBTITLE` | `ငါတို့ရဲ့ အမှတ်တရလေးတွေ 🌸` |
| Password | `VITE_APP_PASSWORD` | `loveyou28` |
| Password ဖွင့်/ပိတ် | `VITE_PASSWORD_ENABLED` | `true` / `false` |

**ပြောင်းနည်း အဆင့်ဆင့်:**
- **Local မှာ**: `.env.local` ပြင် → သိမ်း → `npm run dev` ပြန်စ။
- **Online (Vercel) မှာ**: Settings → Environment Variables မှာ value ပြင် → **Save** → **Deployments** tab → နောက်ဆုံးတစ်ခုရဲ့ **⋯ → Redeploy** နှိပ်ပါ (မပြင်ရင် အဟောင်းပဲ ဆက်ပြနေမှာမို့ Redeploy က မဖြစ်မနေလိုအပ်ပါတယ်)။

**အရောင်/စာလုံးပုံစံ** ပြောင်းချင်ရင် — `tailwind.config.ts` ထဲက `colors` နဲ့ `index.html` ထဲက Google Fonts လင့်ခ်ကို ပြင်ပါ။
**သီချင်း** ပြောင်းချင်ရင် — `public/music/` ထဲ `song.mp3` ထည့်ပါ။

---

## 🎁 ဒါဆိုပြီးပါပြီ!

Supabase (database) → `.env.local` (keys/စာသား) → Vercel (online) → ➕ (ဓာတ်ပုံ/မက်ဆေ့ချ်) → လင့်ခ်မျှဝေ။
မွေးနေ့ လက်ဆောင်လေး ချစ်စရာဖြစ်ပါစေ 💗🌸
