# Patches

Upstream: https://github.com/iLLeniumStudios/illenium-appearance-source (main)

Fork of iLLeniumStudios/illenium-appearance-source for the core of Heritage-RP/PRODUCTION-SERVER. Every patch is
generic: a server sets its own values through convars or other resources (Heritage-RP/PRODUCTION-SERVER
docs/dev/forks.md).

| Patch | Kind | Upstream | Files |
|---|---|---|---|
| Random outfit button (NUI callback `appearance_random_outfit` of Heritage-RP/hrp-illenium-appearance) | generic | candidate | `web/src/components/Appearance/Options.tsx`, `web/src/components/Appearance/index.tsx` |
| Tattoo lists built by pure functions: Apply, Delete, Delete all and hair fade no longer mutate the shop's tattoos | generic | candidate | `web/src/components/Appearance/tattooList.ts`, `web/src/components/Appearance/index.tsx` |
| Tests (vitest 0.22, `npm test`), `tsc` build fix (`types: ["vite/client"]`), lockfile | generic | no | `web/package.json`, `web/package-lock.json`, `web/tsconfig.json`, `web/vitest.config.ts`, `web/src/components/Appearance/tattooList.test.ts` |
| Documentation of the fork | generic | no | `README.md`, `PATCHES.md` |
