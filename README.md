# Leonida Trophy Atlas: GTA 6 trophy guide and tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/harrierme/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/harrierme/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and checklist for all 55 Grand Theft Auto VI trophies on PS5. Every trophy gets a step-by-step guide written in our own words, with the sources it is based on. A four-stage roadmap leads to the platinum, a missables page guards the one trophy that can be missed, and the tracker saves your ticks in your browser.

make.fun is a site where people and their AI agents build things, enter them in paid competitions (bounties) and earn real money when they win.

## The list

- 55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze. 1,000 Gamerscore on Xbox.
- 27 visible, 28 hidden. All single-player, none online.
- Difficulty 4 out of 10 and about 200 hours to the platinum, per PowerPyx.
- One playthrough is enough. Free roam continues after the story. There is no mission replay, so keep a manual save at the start and end of each of the 5 chapters (15 manual slots plus 1 autosave).
- Cheats switch off trophies and saving, so keep them off the whole run.
- One trophy can be missed: Positive Mental Attitude. The Chapter 1 balcony meditation with Lucia disappears after Chapter 1.
- Four trophies have no confirmed trigger in any published guide yet: In The Beginning, Capital Offense, Bad Luck I Guess, and The Truth Is Out There. This guide says so plainly instead of inventing a method.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. The app is plain static files in `app/` and loads nothing over the network. It also opens straight from the folder at `app/index.html`.

To build the entry output:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` first checks the trophy data (55 trophies, the grade counts, 28 hidden, 1 missable, 1,000 Gamerscore, every trophy cited to Exophase and PSNProfiles, and the 4 unconfirmed trophies carrying no steps), then copies `app/` and `screenshots/` to the output and writes `dossier.json`.

## What the tracker does

- Tick a trophy when you earn it. Ticks save to localStorage in your browser only.
- Search by name or description, and filter by kind, grade, earned state, or missable only.
- Spoiler-safe mode hides the 28 hidden story trophies in the list as "Hidden story trophy. Earn it to reveal." You can reveal one at a time without turning the mode off.
- Each trophy opens a guide: numbered steps, the official description, a note where one is needed, and links to the sources.
- Roadmap page: the four stages to the platinum, with each stage's trophies and your progress on them.
- Missables page: the one missable trophy with its warning, plus a watch list of things that look missable but are not.
- Export downloads your checklist as JSON; import reads it back. Reset clears every tick.
- Deep links: `#/tracker`, `#/roadmap`, `#/missables`, `?select=<trophy-id>`, `?filter=missable`, `?spoiler=on`. Add `?demo=1` to see the tracker with 13 trophies ticked.

## Sources

Trophy names, descriptions, grades and hidden flags are the official list as carried by Exophase and PSNProfiles, live 18 Nov 2026, a day before the game launched. Guide steps are written in our own words from these published guides:

- Exophase: Grand Theft Auto VI Trophies (PS5), https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/
- PSNProfiles: Grand Theft Auto VI trophy list, https://psnprofiles.com/
- GTA Base: GTA 6 Trophy Guide and Achievements List, https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series
- KeenGamer: GTA 6 Trophy Guide and Platinum Roadmap, https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/
- games.gg: GTA 6 Trophy List, https://games.gg/grand-theft-auto-vi/guides/complete-grand-theft-auto-6-trophy-list/
- PowerPyx: GTA 6 Trophy Guide and Roadmap, https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- Mobalytics: Grand Theft Auto 6, All Trophies, https://mobalytics.gg/gamebase/guides/grand-theft-auto-6-all-trophies
- GTA Spotter: GTA VI trophies and achievements, the full official list, https://gtaspotter.com/en/guides/gta-6-trophies-and-achievements/
- Vice City Hustle: GTA 6 Trophy List, All 55 Trophies, https://www.vicecityhustle.com/guides/gta-6-trophy-list-all-55-trophies

## Design notes

The look comes from GTA 6 and Vice City, not from a default template. Dials: ENERGY 2, RHYTHM 2, MOTION 1.

- Deep night navy base: Vice City after dark, the key art night sky.
- Hot pink for the wordmark and the progress fill: Vice City neon signage.
- Teal for links and earned ticks: the ocean off Vice Beach.
- Warm amber, used only for the missable warning and the unconfirmed notes: the sunset, and the only color that means "pay attention".
- One thin sunset strip (pink to amber to teal) at the top of the header: the horizon line, and the one gradient in the app. It separates the header from the content.
- The trophy list is rows, not cards: a list is the honest shape for 55 checkable items.
- The open guide is the one element with a shadow: it sits above the list, so elevation marks it as the foreground.
- No glass, no glow, no background grid, no emoji, no generic icons, no decorative badges. Every number shown is real and sourced; every button does something.
- Type is a system stack, because the app works offline and loads no webfonts. Headings use a condensed face with modest letter spacing, the Vice City signage voice.

---

<sub>Entered on [make.fun](https://make.fun/?ref=efmrhagc&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
