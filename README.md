# Luckshift

A one-sitting arcade dodge. Drift a die down a dark shaft while the face in play rewrites the rules.

| Face | What it does |
| --- | --- |
| Swift | Quicker hands |
| Heavy | Smash the round chips |
| Magnet | Gems lean toward you |
| Ward | The next hit is free |
| Blaze | Double score, faster shaft |
| Echo | A ghost gathers gems |

Coral bars end the run. Teal gems build a combo. Skim a gate for a close call.

Drag to drift, or use **A** and **D**. **P** pauses. Your best score stays in this browser.

## Run it

```bash
npm install
npm run dev
```

`npm run dev`, `npm run typecheck`, and `npm run build` join `engine-src/p0.ts.txt` through `p7.ts.txt` into `src/game/engine.ts` before Vite or TypeScript run.

## GitHub Actions

- `ci` typechecks and builds on every push and pull request.
- `pages` publishes the build to GitHub Pages from `main`.

After the Pages workflow succeeds, the game is at <https://nciolasruizr8-ui.github.io/luckshift/>. The first deploy needs GitHub Pages set to **GitHub Actions** under Settings → Pages.
