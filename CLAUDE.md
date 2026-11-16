# Tarot website — project brief

Read this first. It records every decision made so far. The first prototype (see "Plan" and "Status") is built.

## Owner's working style
- Confirm the plan before large implementation steps; small tweaks can go straight in.
- Show changes visually where possible (screenshots or a local preview).

## Stack
- Vanilla HTML, CSS and JavaScript (ES modules). No framework, no build step.
- Hash routing (`#/`, `#/major`, `#/wands`, `#/cups`, `#/swords`, `#/pentacles`) so it runs on GitHub Pages with no config.
- Preview locally with a static server (modules don't load from file://). This PC has no Python/Node, so use `powershell -ExecutionPolicy Bypass -File serve.ps1` → http://localhost:8000/ (also the `tarot-site` entry in `../.claude/launch.json`). `serve.ps1` refuses `source-art/`.
- Must stay scalable: a card-drawing / reading feature (daily card, three-card spread) comes later. Keep card, modal, data and i18n as reusable modules.

## Art
- Deck: **Lovecraft Tarot by EternalAteliers** (Etsy). 78 cards, 825×1425 originals.
- `source-art/`: untouched originals, renamed. Git-ignored on purpose; do not commit or publish them. `reference/` (design mock-ups) is also git-ignored and stays local.
- Owner confirmed written permission from the seller for website display (2026-11-15).
- `assets/cards/full/` 825×1338 WebP and `assets/cards/thumb/` 412×668 WebP: seller caption removed, thin gold border restored at the bottom.
- `data/cards.json`: 78 cards with id, name, arcana, suit, number, numeral, element, image, thumb, video.
- Licensing: the owner is getting written permission from the seller for website display, adding frames/titles, animation, and possibly using the guidebook meanings. Footer credit: "Artwork by EternalAteliers, used under license."

## Decided design
- **Background:** dark, moonlit teal stage, drifting fog and soft motes. Lovecraft cards are dark, so they need a light rim/glow to separate from the page.
- **Frame (section pages):** code-drawn SVG frame from `reference/frame-lab.html`. Metal: **bone**. Title lettering: **Roman capitals (Cinzel)**. Use the earlier, taller-banner version (approved). See `reference/frame-bone-approved.png`.
- **Home page cards are frameless**, edges softly fading into the background (mask), no hard border.
- **Card pop-up:** native `<dialog>`, nearly full screen, fully responsive (no fixed size). Left: unframed art at full height; right: numeral, title, Major/Minor, upright + reversed keywords, description. Stacks on phones (<720px). Close via ×, backdrop click, Esc. Add next/previous arrows. See `reference/popup-approved.png` and the viewer code in `frame-lab.html`.
- **Video:** Major Arcana get looping videos later (`assets/videos/<id>.mp4`). If the file exists, play it muted/looped/playsinline over the still; otherwise show stand-in motion (slow zoom, light sweep, motes). Respect prefers-reduced-motion. Lazy-load; WebM+MP4, ~720px wide, no audio.

## Layout
- **Header:** site name top-left (click → home), EN / 繁中 toggle top-right, choice remembered in localStorage.
- **Left rail on every page** (including home): collapsed to suit emblems (crescent, wand with flame, chalice, sword, pentacle; `js/components/icons.js`), expands on hover/toggle, highlights the current section. Entries: Major Arcana, Wands, Cups, Swords, Pentacles; later a divider + reading features. Phones: ☰ drawer.
- **Home:** five clickable zones per `reference/sketch-home.png` — Major Arcana large in the center, Wands top-left, Cups top-right, Swords bottom-left, Pentacles bottom-right. Each zone slowly crossfades through its cards (~6–8 s, staggered so only one changes at a time, pauses on hover). Caption each zone with its element (Wands · Fire, Cups · Water, Swords · Air, Pentacles · Earth). Phones: Major on top, suits in a 2×2 grid.
- **Section pages:** short suit intro, then a grid of framed cards per `reference/sketch-section.png` (6 columns wide → 2 on phones). Click opens the pop-up.
- **Footer:** site name + tagline, art credit, "for reflection and entertainment" disclaimer, language switch.

## Language
- English and **Traditional Chinese**. Fonts: Cinzel (EN display), Noto Serif TC (Chinese). Use 大秘儀 / 小秘儀 for Major / Minor Arcana.
- Keep all strings in `data/i18n/en.json` and `data/i18n/zh-Hant.json`.

## Site name
Not chosen yet. Shortlist: Moonlit Arcana / 月下秘儀, Arcana Noctis / 夜之秘儀, The Drowned Oracle / 沉淵神諭, Nocturne Tarot / 夜曲塔羅, Tides of Fate / 命運之潮. Keep the name in one config value; use "Moonlit Arcana / 月下秘儀" as the placeholder.

## Card meanings
Original wording informed by the guidebook (see Status). Pop-up shows: upright keywords + reading, reversed keywords + reading, then "A question to reflect on".

## Suggested structure
```
index.html
css/   base.css home.css gallery.css modal.css
js/    main.js router.js i18n.js data.js
       components/card.js components/modal.js components/rail.js
       views/home.js views/gallery.js
       (later) deck.js views/reading.js
data/  cards.json meanings.json i18n/en.json i18n/zh-Hant.json
assets/cards/full assets/cards/thumb assets/videos
```

## Plan (first prototype)
1. Scaffold structure, router, i18n, data loader.
2. Header, left rail, footer.
3. Home with five cycling zones.
4. Section pages with framed grid.
5. Pop-up with arrows and video fallback.
6. Check desktop, tablet and phone widths.

## Status (prototype 1, 2026-11-09)
- All six plan steps done and checked at 1440×900, 768×1024 and 375×812, in EN and 繁中.
- Frame top medallion: Majors show their numeral; Minors show a pictorial element glyph — flame, water drop, wind, leaf (`elementGlyph()` in `js/components/frame.js`; owner chose these over the alchemical triangles, which are kept as `style: "alchemical"`; comparison in `reference/glyph-compare.html`).
- Site name lives in `js/config.js` (`SITE.name`), with sections and storage keys.
- Chinese card names are composed in `i18n.cardName()` from `cardNames` in `zh-Hant.json`.
- `data/meanings.json` (2026-11-13): all 78 cards, EN + 繁中, each with up/rev keywords, upText/revText and a reflection `question`. Written in our own words using the seller's guidebook ("The Eldritch Veil Tarot", EternalAteliers, kept outside the repo on the owner's Desktop) and traditional tarot meanings as reference — no guidebook text copied. The guidebook says personal use only / no redistribution, so keep it out of the repo and don't paste its wording into the site unless the seller's written permission covers it.
- Video: the pop-up probes `assets/videos/<id>.webm` then `.mp4` for Majors; missing files show a 404 in the console once per card, then the stand-in motion is used.
- Home cycling: one zone changes every 1.5 s in a fixed order (each zone ~every 7.5 s); off for reduced motion.
- Not built yet: deep links to single cards, reading features (rail has room for a divider + entries).
