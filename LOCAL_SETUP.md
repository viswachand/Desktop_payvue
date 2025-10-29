## Local Offline Setup

To run the full PayVue stack (Electron + API + MongoDB) without any remote services:

1. **MongoDB**
   - Install MongoDB locally and ensure the daemon is running.
   - The app expects a database named `payvue` on `mongodb://127.0.0.1:27017`. Update `backend/.env` if you need different credentials.

2. **Backend build**
   - The packaging script now reinstalls backend dependencies, builds, then prunes dev-only packages automatically. If you want to prepare manually, run `npm install` inside `backend`, `npm run build`, then `npm prune --omit=dev` so `backend/node_modules` only contains runtime deps.
   - This populates `backend/dist`, which the Electron app copies into the bundle.

3. **Frontend build**
   - Run `pnpm --filter frontend build` (or `npm install && npm run build` inside `frontend`).

4. **Electron package**
   - Inside `app` execute `npm install` once, then use `npm run package:all` (or simply `npm run dist`; it now runs the frontend/backend builds for you).
   - On launch, the Electron process spawns the bundled backend automatically and serves the locally built frontend.
   - Make sure MongoDB is running locally before launching the packaged app; otherwise the backend shuts down and the UI will show connection-refused errors.

During development you can run `pnpm --filter backend dev` in one terminal (or `npm run dev` inside `backend`) while the Electron dev script is running, or build the backend once so Electron can execute `backend/dist/index.js` directly.
