# Actuation Atlas

> Layer force curves for the keyboard switches you're deciding between, picked from a searchable library of 22 switches.

| Status | Version | Last updated |
|--------|---------|--------------|
| Working | 1.0.1 | 2026-10-26 |

## Open it
Download [`app/actuation-atlas.html`](app/actuation-atlas.html) and double-click it. It runs in any browser, offline, with no install.

## What it is
A keyboard-switch comparison tool. It plots gram-force against travel (mm) from the first gram of resistance to bottom-out, so you can see linear, tactile and clicky shapes side by side.

## What it does
- **Library of 22 switches:**
  - Cherry MX Red/Black/Speed Silver/Brown/Blue
  - Gateron Red/Yellow/Ink Black V2/Brown/Magnetic Jade
  - Zealios V2 67g, Holy Panda, Glorious Panda, Boba U4, Alpaca V2
  - Kailh Box White/Navy, Speed Copper/Bronze
  - Akko Piano Pro, SP-Star Meteor White, Wooting Lekker L45 V2
- **Search** by name or brand, with quick-add chips.
- **Layered switches list:** a show/hide toggle and × remove for each. Hover a row to highlight its curve.
- **Force-curve chart** with an actuation-point dot for each switch.
- **Spec table:** type, pre-travel, total travel, actuation, bottom-out and tactile peak.
- **Reset** goes back to the default set (MX Red, Brown, Blue).

## How to use
1. Type in **Add a switch**, or tap a chip. Press Enter to add the first match.
2. Use the toggle to hide a curve without removing it.

## Data and saving
Your layered set is saved in this browser only (localStorage key `actuationAtlasState_v1`).

## Tests
13 automated browser tests (Playwright) in [`tests/`](tests/): default switches, search by name and brand, adding, show/hide, remove, reset, the spec table and saving after a reload. They run on every push (GitHub Actions). To run them locally: `npm install`, then `npm test`.

## Known limits
Curves are **modeled** from published actuation, bottom-out and travel specs. They're not measured.

## License
[MIT](LICENSE)
