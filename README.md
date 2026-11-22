# Partner-Finder 2.0 (MERN + Google Sign-In)

Full-stack sports matchmaking app: React (Vite) frontend, Express + MongoDB backend.

Features: email and Google login, create/join/leave/cancel matches, clickable match details with
description and player list, per-match group chat, match reminders (in-app + browser notifications),
assistant chatbot, animated wallpaper, light/dark theme.

```
partner-finder/
  server/   Express API (auth, matches, chat)
  client/   React app (Vite)
```

## STEP-BY-STEP SETUP

### Step 1. Install the tools
- Node.js 18 or newer: https://nodejs.org
- A code editor (VS Code) and Git

### Step 2. Get a free MongoDB database
1. Go to https://www.mongodb.com/cloud/atlas and create a free account and a free (M0) cluster.
2. Database Access: create a database user (username + password).
3. Network Access: Add IP Address > "Allow access from anywhere" (0.0.0.0/0).
4. Connect > Drivers: copy the connection string. Replace <password> and add the database name:
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/partnerfinder

### Step 3. Create the Google Client ID
1. Open https://console.cloud.google.com and create a project (name it Partner-Finder).
2. APIs & Services > OAuth consent screen: choose External, enter app name and your email, save.
   While the app is in Testing mode, add your Gmail under Test users (or click Publish app).
3. APIs & Services > Credentials > Create credentials > OAuth client ID > Web application.
4. Under Authorized JavaScript origins add (no trailing slash):
   - http://localhost:5173
   - https://YOUR-VERCEL-DOMAIN.vercel.app (add this after Step 7)
5. Create, then copy the Client ID (ends with .apps.googleusercontent.com). The secret is not needed.

### Step 4. Configure the backend
    cd server
    cp .env.example .env        (Windows: copy .env.example .env)
Open .env and fill in MONGO_URI, JWT_SECRET (any long random text) and GOOGLE_CLIENT_ID.
    npm install
    npm run dev
You should see: Partner-Finder API running. Test: http://localhost:5000/api/health

### Step 5. Configure the frontend
Open a second terminal:
    cd client
    cp .env.example .env
Put the same Client ID in VITE_GOOGLE_CLIENT_ID. Leave VITE_API_URL empty for local use.
    npm install
    npm run dev
Open http://localhost:5173. Register, or click Continue with Google.

### Step 6. Put it on GitHub (replaces the old repo content)
    cd partner-finder
    git init
    git add .
    git commit -m "Partner-Finder 2.0"
    git branch -M main
    git remote add origin https://github.com/atharva31-alt/partner-finder.git
    git push -u origin main --force
(--force overwrites the old version. Skip it if you want to keep the old history and use a new repo.)

### Step 7. Deploy the backend (Render)
1. https://render.com > New > Web Service > connect your GitHub repo.
2. Root Directory: server. Build Command: npm install. Start Command: npm start.
3. Environment variables: MONGO_URI, JWT_SECRET, GOOGLE_CLIENT_ID, and
   CLIENT_URL = your Vercel URL (set it after Step 8, then redeploy).
4. Copy the service URL, for example https://partner-finder-api.onrender.com

### Step 8. Deploy the frontend (Vercel)
1. https://vercel.com > Add New > Project > import the same repo.
2. Root Directory: client. Framework: Vite.
3. Environment variables:
   VITE_GOOGLE_CLIENT_ID = your Client ID
   VITE_API_URL = https://partner-finder-api.onrender.com/api
4. Deploy. Copy the live URL.

### Step 9. Final wiring
1. Google Cloud > Credentials > your OAuth client > add the Vercel URL to Authorized JavaScript origins.
2. Render > Environment: set CLIENT_URL to the Vercel URL, then redeploy.
3. Open the Vercel site and test Google login.

## Troubleshooting
- Google button shows an error or "origin_mismatch": the exact site URL is missing from Authorized JavaScript origins.
- "Access blocked" for other people: publish the OAuth consent screen (Testing mode only allows test users).
- Network or CORS errors: CLIENT_URL on the server must exactly match the frontend URL (no trailing slash).
- Render free tier sleeps when idle, so the first request can take about 30 seconds.
- Never commit .env files.

## Usernames (v3)
- Register with a unique username (3-20 characters: letters, numbers, underscore; must start with a letter).
- Log in with email OR username plus password, or with Google.
- Google sign-ups and older accounts get a username automatically (from the email). Click the @username chip
  in the top bar to change it.
- Demo data: run `npm run seed` in /server. Demo logins: usernames riya, kabir, mehul with password demo1234.
- No database migration is needed. Existing users receive a username the next time they log in.

## Version 3.0 progress

### Stage 1 (this update): design system, navigation, profiles, compatibility, swipe matching
- **Athletic Energy design**: orange #FF8B32, carbon #171B1F, graphite cards #242B30, condensed athletic headings.
- **Navigation**: sidebar on desktop, bottom tab bar on phones (Dashboard, Discover, Matches, Messages, My Profile).
  Pages for the later stages are added to the menu only when they exist, so there are no dead links.
- **Profiles**: age, bio, city, skill, sports, playing times, free days, optional approximate location, block list.
- **Compatibility score** (`server/services/compat.js`): sports 30 + skill 20 + proximity 20 + playing times 15 +
  days 15 = 100. A plain, transparent weighted formula (not AI). It returns the full breakdown, which is shown
  on every card. It is a pure function, so an AI recommender can replace it later without touching the routes.
- **Swipe matching** (`/api/users/discover`, `/swipe`, `/connections`, `/block/:id`): swipe or buttons or arrow keys;
  one decision per pair (unique index); a mutual like creates exactly one Connection (unique pair key);
  self-likes and blocked users are rejected on the server; swipes are rate limited.
- **Privacy**: coordinates are rounded to about 1 km, never sent to other players, and can be removed any time.
  Only a rounded distance is shown. Location is requested only when you press the button.

### Not built yet (coming in the next stages)
Real-time chat (Socket.IO), XP/badges/leaderboards, social feed with image upload, venue map, tournaments,
AI Coach upgrade, player statistics and the full dashboard redesign.

### Upgrading from the previous version
1. `cd server && npm install` (new package: express-rate-limit)
2. Delete `client/src/Profile.jsx` and `client/src/MyMatches.jsx` (replaced by ProfilePage.jsx and MatchesList.jsx).
3. Restart both apps. Existing accounts keep working. Optional demo data: `npm run seed` (6 demo players, password demo1234).
