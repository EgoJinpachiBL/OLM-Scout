# OML Scout

**[olmscout.netlify.app](https://olmscout.netlify.app/)**

A standalone scouting and squad-comparison tool for **[Open League Manager (OLManager)](https://github.com/OpenLeagueManager/OLManager)** — an open-source, free League of Legends esports management game.

OML Scout is not affiliated with or endorsed by the OLManager project. It's a fan-made companion tool that reads your own local save data to help with squad building and transfer scouting — nothing more.

---

## What it does

OLManager tracks a lot about every player in your world: nine core attributes, contract details, market value, and a hidden potential rating that only reveals itself once you've scouted someone. OML Scout takes that data and gives you three views on it:

### Squad
Browse every player currently loaded — your own roster or anyone else's — in a sortable table or a card view with a 9-point radar chart per player. Filter by team, league, or role, search by name, and sort by any attribute (so "who has the best Shotcalling in the database" is a one-click answer, not a scroll-and-guess).

### My Team
Pick your club (or let it auto-detect from your save) to see:
- **Role coverage** — your starter and bench depth at Top/Jungle/Mid/Adc/Support, with any empty role flagged
- **Squad vs. league average** — a radar comparing your team's average attributes against everyone else currently loaded
- **Strengths and weaknesses** — your best and worst attributes relative to the league average, each weakness with a one-click "Find players →" that jumps to Squad, sorted by exactly that attribute

### Compare
Pick up to 5 players — from your squad or anyone else — and overlay their radars with a stat-by-stat table, the best value in each row highlighted. Star players into a shortlist as you browse Squad, then load the whole shortlist into Compare in one click.

### Other things worth knowing
- **Potential stays hidden until scouted**, matching how the game itself works — there's an explicit opt-in toggle if you want to peek at your own data, off by default.
- **Light and dark mode**, toggle in the header.
- Nothing is sent anywhere. All your data stays in your browser (IndexedDB) — there's no backend, no account, no server this app talks to.

---

## How to use it

1. Go to **[olmscout.netlify.app](https://olmscout.netlify.app/)**
2. Click **Import** and choose either:
   - Your live save (`.olsave` file, found in OLManager's save folder), or
   - A `world.json` export
3. Browse, filter, sort, shortlist, and compare.

Not sure where your save file lives? Click the **?** icon next to Import — it shows the save folder path for your OS with a one-click copy button, so you can paste it straight into the file picker's address bar instead of clicking through folders manually.

**Save folder locations:**

| OS | Path |
|---|---|
| Windows | `%APPDATA%\com.openleaguemanager.olmanager\saves` |
| macOS | `~/Library/Application Support/com.openleaguemanager.olmanager/saves` |
| Linux | `~/.local/share/com.openleaguemanager.olmanager/saves` |

Re-importing a newer save updates existing players/teams without wiping anything you added manually.

---

## Tech stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Recharts](https://recharts.org/) for the radar charts
- [Lucide](https://lucide.dev/) for icons
- IndexedDB for local persistence (no backend)

## Running it locally

```bash
git clone <this-repo>
cd oml-scout
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Output goes to `dist/` — a static site with no server requirements.

---

## Credit

All player, team, and attribute data comes from **[Open League Manager](https://github.com/OpenLeagueManager/OLManager)**, an open-source (GPL-3.0) game built by the OpenLeagueManager team. Go check out the actual game — this tool is just a companion to it, not a replacement.

OML Scout doesn't bundle or redistribute any of OLManager's game data — it only reads files you already have locally (your own save or world export) and everything stays in your browser.

## License

This project's code is provided as-is. See [OLManager's repository](https://github.com/OpenLeagueManager/OLManager) for the license terms governing the game and its data.
