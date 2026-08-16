# Update: Login Authentication + UI Refresh

This document explains what changed in this build and how to work with it.

## 1. What was added

### Login screen (`/login` and `/admin/login`)
A single `LoginComponent` now handles both roles. It shows two tabs — **Staff Login** and
**Admin Login** — so people can switch which type of account they're signing in as without
leaving the page. The URL updates to match the selected tab (`/login` for staff, `/admin/login`
for admin), so a direct link or bookmark to either one lands on the right tab.

### Route protection
- `/` (the staff leave form) now requires a **user** session. Visiting it while logged out
  redirects to `/login`.
- `/admin` (the approval dashboard) now requires an **admin** session. Visiting it while logged
  out redirects to `/admin/login` — this preserves the existing behavior of reaching the admin
  area by typing `/admin` in the URL, it's just gated behind login now.
- This is implemented with two small functional route guards:
  `src/app/guards/auth.guard.ts` (`userGuard`, `adminGuard`).

### Switch tabs on both dashboards
Top-right of the staff form there's now a **"Switch to Admin ⇄"** button that jumps to the admin
login screen. Top-right of the admin dashboard there's a **"Switch to User ⇄"** button that jumps
to the staff login screen. Both headers also show a **Logout** button and a "Hi, {username}"
greeting.

### Testable login (no backend yet)
Since there's no database connected yet, `AuthService` ships with two hard-coded test accounts:

| Role  | Username | Password  |
|-------|----------|-----------|
| User  | `user`   | `user123` |
| Admin | `admin`  | `admin123`|

The login page also has an **"Autofill test login"** link that fills in whichever account
matches the active tab, so you don't have to remember the credentials while testing.

### Modernized look
- Added the Inter font (via Google Fonts link in `index.html`).
- Introduced a shared set of design tokens (colors, radii, shadows) in `src/styles.scss` as CSS
  custom properties, used across the login, staff, and admin screens for a consistent look.
- Buttons are now pill-shaped with hover lift, inputs have a cleaner bordered style with a focus
  ring, cards have softer shadows and slightly larger corner radii, and both headers use a subtle
  gradient instead of a flat fill.
- No functional markup was renamed or removed — this is a visual refresh layered onto the
  existing structure, so nothing else about how the form or dashboard work has changed.

## 2. New/changed files

```
src/app/models/auth.model.ts                     (new)  role & credential types
src/app/services/auth.service.ts                  (new)  login/logout/session logic
src/app/guards/auth.guard.ts                      (new)  userGuard, adminGuard
src/app/components/login/                         (new)  login.component.ts / .html / .scss
src/app/app.routes.ts                          (updated)  added /login, /admin/login, guards
src/app/components/staff-form/*                (updated)  header switch-tab + logout
src/app/components/admin-approval/*             (updated)  header switch-tab + logout
src/styles.scss                                (updated)  design tokens, base styles
src/index.html                                 (updated)  Inter font link, page title
```

## 3. How sessions work right now

`AuthService` keeps the logged-in user in an Angular `signal` and mirrors it to
`sessionStorage` (cleared when the browser tab closes — deliberately not `localStorage`, so test
sessions don't linger indefinitely). It's guarded with `isPlatformBrowser` so it plays nicely with
this project's server-side rendering (SSR) setup and won't throw during prerendering/build.

## 4. Connecting a real database later

`AuthService.login()` is the only place that needs to change. Right now it checks the
`TEST_ACCOUNTS` table synchronously; swap that block for a real API call, for example:

```ts
// Suggested contract:
// POST /api/auth/login  { username, password, role }  ->  { token, user }
```

Everything else — the guards, the login component, the header switch-tabs, the logout button —
calls `AuthService.currentUser`, `login()`, `logout()`, and `hasRole()`, so they won't need to
change when the backend is wired up.

## 5. Running it

```bash
npm install   # only needed if you moved this to a machine without node_modules already set up
ng serve
```

Then visit `http://localhost:4200`. You'll land on the staff login screen; use the tab or the
autofill link to try the admin account instead.

## 6. Deploying it live (Vercel / Netlify)

This app is 100% client-side (no real backend yet), so it deploys as a static site. Two ready-made
configs are included at the project root:

- **`vercel.json`** — push this repo to GitHub, import it on vercel.com, it reads this file
  automatically. No manual settings needed.
- **`netlify.toml`** — same idea on netlify.com (or `netlify deploy` via their CLI).

Both configs run `ng build --configuration production` and publish
`dist/leave-management-app/browser`, with a catch-all rewrite to `index.html` so deep links like
`/admin` or `/login` work on refresh (Angular's router then takes over client-side).

Font inlining was turned off in `angular.json`'s production config (`"fonts": false`) — Angular's
default production build tries to fetch and inline Google Fonts at build time, which can make
builds flaky on some CI environments; the font still loads fine at runtime via the `<link>` tag in
`index.html`, it's just not inlined into the CSS bundle.

Once you connect a real backend/database, you'll want the SSR (server) build instead of the static
one — see the `server.ts` / `outputMode: "server"` already configured in `angular.json`, and deploy
to a Node-friendly host (Render, Railway, Fly.io) instead of a static host.

## 7. Known limitations (by design, for this stage)

- Credentials are hard-coded client-side — fine for demoing/testing, **not** secure for
  production. This is intentional until the database/backend is connected.
- There's no password hashing, rate limiting, or "remember me" — those should come with the real
  auth backend.
- Leave application data still persists in `localStorage` via the existing
  `LeaveStorageService`, unchanged from before this update.
