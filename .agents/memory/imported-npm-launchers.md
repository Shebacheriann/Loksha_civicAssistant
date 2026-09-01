---
name: Imported npm launcher permissions
description: A Replit import can contain npm-installed files without executable permissions.
---

When an imported Node project reports `Permission denied` for a `node_modules/.bin` command even after dependency installation, verify the launcher modes before changing application code. Launching the package entry file through `node` is a low-impact workaround when the package itself is intact.

**Why:** The imported Loksha project had a complete Vite dependency tree, but the `.bin` launchers and Vite entry file were mode 644, so npm scripts could not start even though the source and packages were valid.

**How to apply:** Prefer the existing package scripts when launcher permissions are correct. Otherwise, configure the Replit workflow to invoke the framework entrypoint through its runtime, and document the reason rather than restructuring the project.