# gta6-trophy-guide
[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/harrierme/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/harrierme/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**Leonida Trophy Atlas** — an offline guide and tracker for all 55 Grand Theft Auto VI trophies on PlayStation 5. Every trophy is shown with its official name, description and grade as PlayStation publishes them, plus a full guide in this atlas's own words: what to do, where and how, and when it can be missed — with the source of each fact listed beside the guide. No network needed, no Rockstar artwork, nothing to install.

## What is inside

- **All 55 trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden on PlayStation until earned; 0 online. Every trophy has a guide, numbered steps, a kind (story / missable / collectibles / activities / online), a missable flag, a roadmap stage and cited sources.
- **A checklist tracker** — tick trophies off as they pop; progress is saved in your browser (localStorage) and can be exported to a file and imported back. Filter by kind, grade, earned state, or search by name, mission or keyword.
- **A spoiler setting** — turn spoiler-safe on and story trophy names and descriptions stay hidden until you earn them, so the list cannot spoil the campaign.
- **A roadmap to the platinum** — four stages, in order: play the story (Chapters 1–5, 60–80 hours), clear the stranger strands and character finales, grind the activities, robberies and collectibles, then finish 100% completion. About 200 hours in total, difficulty 4/10 (PowerPyx).
- **A missables page** — there is exactly **one possibly missable trophy: Positive Mental Attitude**. In Chapter 1, after the mission Down to Earth, find Lucia in the kitchen at Jason's house in the morning, follow her to the balcony and choose Accept. It is not yet confirmed whether the trophy needs that meditation — do it anyway, because Chapter 1 never comes back. Everything else can be earned in free-roam after the story.

## Roadmap summary

1. **Stage 1 — Story (Chapters 1–5).** Play the campaign; keep a manual save at the start and end of each chapter (there is no mission replay). Do the Chapter 1 balcony meditation before the chapter ends. Cheats disable trophies and saving — keep them out of this run.
2. **Stage 2 — Strangers and finales.** Finish the character questlines (Andy is Lucia-only; Tyrone and Bret are Jason-only) and 8 qualifying stranger strands for Strangers & Freaks. Quest givers can go quiet mid-story but all return later.
3. **Stage 3 — Activities, robberies, collectibles.** 250 stunts, 42 gold shooting-range medals, 14 drone-race wins, 20 race wins, 50 challenges, 5 bank vaults, one illegal operation per gang, 3 card sets, 100 WAiNK scans, 100 vehicles, all 52 areas. Unlock the Scooter Bros app (Chapter 2, Moses) and garage buying (Chapter 2, Daily Driver) early.
4. **Stage 4 — 100% completion.** After the story, open Progress → Stats → 100% Completion and clear it: 39 gang operations, 22 bank jobs, 7 payday loan jobs, 8 bank vaults, 300 stunts, 70 of 80 challenges, 200 of 277 vehicles scanned, 100 of 255 animals studied, 15 of 18 meditation spots, 15 card sets, 100 WAiNK locations, 33 underwater discoveries, 100 flamingos. The checklist asks for more than the standalone trophies, so keep going after each one pops. A Long Road (gold) is the last gate; the platinum, Vice Got a Price!, pops with it.

## How the tracker works

Open the app, tick a trophy's checkbox when it pops, and it stays ticked — progress is stored in your browser only. Use **Export progress** to save a JSON backup, and **Import progress** to restore it on another machine or after clearing browser data. The kind filters (Story, Missable, Collectibles, Activities, Online) narrow the list; the spoiler toggle masks story trophies you have not earned yet. Deep links work too: `index.html#roadmap`, `index.html#missables`, `?filter=missable`, `?spoiler=on`.

## Sources

Guides are this atlas's own words. The facts come from the official trophy list on [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi), the roadmap and missable warning from [PowerPyx](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/), and per-trophy methods from [games.gg](https://games.gg/grand-theft-auto-vi/guides/complete-grand-theft-auto-6-trophy-list/), [KeenGamer](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/), [Mobalytics](https://mobalytics.gg/gamebase/guides/grand-theft-auto-6-all-trophies) and [GTA Spotter](https://gtaspotter.com/en/guides/gta-6-trophies-and-achievements/). Where a method is not yet confirmed in any published guide, the guide says so plainly instead of guessing.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no dependencies: `serve.ts` serves `app/` as static files, and the app runs with the network off.

<sub>Entered on [make.fun](https://make.fun/?ref=efmrhagc&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
