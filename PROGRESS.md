# LUMINA — Session Progress & Handoff
**Current phase:** Phase 9 — Full free stack migration ✅ COMPLETE
**Next phase:** Phase 10 — Mood quiz persistence, real audio, final polish

---

## Stack (fully free, no paid services)
| Service | Purpose | Cost |
|---------|---------|------|
| MongoDB Atlas | Database | Free (512MB) |
| NextAuth.js | Auth (email+password) | Free |
| Groq API | AI companion + reflection | Free |
| Vercel | Hosting | Free |

---

## What Changed in Phase 9

### Removed completely
- `@supabase/supabase-js`, `@supabase/ssr`, `@prisma/client`, `prisma`
- `src/lib/supabase/` folder
- `src/app/auth/callback/` route (Supabase magic link callback)
- `supabase_setup.sql`

### Added
- `mongoose` + `bcryptjs` + `next-auth` + `groq-sdk`
- `src/lib/mongodb/client.ts` — DB connection singleton
- `src/lib/models/User.ts` — User schema
- `src/lib/models/JournalEntry.ts` — Journal schema
- `src/lib/models/MoodEntry.ts` — Mood schema
- `src/lib/models/LetterRead.ts` — Letter reads schema
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth handler
- `src/app/api/auth/signup/route.ts` — User registration
- `src/app/api/journal/route.ts` — List + create journal entries
- `src/app/api/journal/[id]/route.ts` — Get/update/delete single entry
- `src/app/api/mood/route.ts` — Log + fetch mood entries
- `src/app/api/letters/route.ts` — Track letter reads
- `src/components/ui/Providers.tsx` — NextAuth SessionProvider wrapper

### Updated
- `src/lib/auth.ts` — Uses NextAuth signIn/signOut (no Supabase)
- `src/lib/journal/journalService.ts` — Calls `/api/journal` routes
- `src/hooks/useMoodHistory.ts` — Calls `/api/mood` (no Supabase)
- `src/middleware.ts` — Uses NextAuth `withAuth` (no Supabase)
- `src/app/layout.tsx` — Wraps app in `<Providers>` (SessionProvider)
- `src/app/api/companion/route.ts` — Groq API (llama-3.3-70b)
- `src/app/api/reflect/route.ts` — Groq API (llama-3.3-70b)
- `src/app/profile/page.tsx` — Uses `useSession()` hook
- `src/app/letters/page.tsx` — Uses `useSession()` hook
- `src/app/letters/[trigger]/page.tsx` — Uses `useSession()` hook
- `.env.example` — Only 3 vars: MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL, GROQ_API_KEY

---

## Environment Variables Required
```
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=...   (run: openssl rand -base64 32)
NEXTAUTH_URL=https://your-app.vercel.app
GROQ_API_KEY=gsk_...
```

---

## What's Left for Phase 10
- Quiz page: call `logMood(userId, moodId)` after quiz completion (import from `useMoodHistory`)
- Onboarding: save display name to MongoDB user profile
- Real ambient audio files in `public/sounds/`
- Rate limiting on `/api/companion` (e.g. 20 requests/day)
- PWA icons generation
- Accessibility: skip-to-main link, aria-labels audit

---

## How to Continue
1. Upload PROGRESS.md + zip
2. Say: "Continue Lumina from Phase 10."

## Local setup
```bash
cd lumina
npm install
cp .env.example .env.local
# fill in the 4 env vars
npm run dev
```
See DEPLOY.md for full deployment guide.
