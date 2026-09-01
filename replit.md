# Loksha

## Run on Replit

The project is a Vite + React single-page civic grievance app. The Replit workflow `Start application` serves the existing app on port 5000 with:

```text
node node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5000
```

The direct Node entry is intentional for this imported project because the installed `node_modules/.bin` launchers do not have executable permissions in the import.

## Current structure

- `src/App.jsx` owns the top-level screen state and shared in-memory complaints data.
- `src/components/DesktopLayout.jsx` renders the full-width desktop experience.
- Mobile screens are rendered inside the device frame from the same top-level app state.
- Navigation is state-based; there is no URL router or backend.
- `src/components/FileComplaintScreen.jsx` contains the multi-step complaint flow, including voice, text, photo, location, draft/review, submit, and status states.
- `src/components/Modals/` contains chat, complaint detail, tracking, notifications, and profile overlays.

## Verification

- `node node_modules/vite/bin/vite.js build` succeeds.
- The preview is available through the `Start application` workflow.