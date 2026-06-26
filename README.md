# Sangjit Invitation — Ivan × Sioni

Static, mobile-first digital invitation for the Sangjit (Chinese engagement) of **Ivan Rusli & Sara Sioni Santoso** (Sara goes by *Sioni*) on **11 July 2026**.

Built as plain HTML + CSS + JS, no build step. Designed to open smoothly on mobile for elderly guests, with a garden-Chinese aesthetic (ivory + foliage green + pastel peony + champagne gold, jade accents from the ceremony attire).

---

## Quick preview

Open `index.html` directly in any modern browser, or serve the folder:

```bash
cd /Users/mcdohl/projects/sioni
python3 -m http.server 8080
# then visit http://localhost:8080
```

Try a personalised link:

```
http://localhost:8080/?to=Bapak%20Budi%20Santoso
```

---

## Things you still need to fill in

Search `index.html` for `TODO` comments. Placeholders:

| Where | What |
|---|---|
| `index.html` → `.families` section | Parents' names for both sides |
| `index.html` → `.event` section | (optional) Full street address below the venue name |
| `assets/img/hero.svg` | Hero / cover background (swap with real photo if desired) |
| `assets/audio/background.mp3` | Looping Chinese-themed background music (see `assets/audio/README.txt`) |

### Swapping the hero image (optional)

Replace `assets/img/hero.svg` with a JPG/PNG at 1200×1500 px or larger, then update the `<img src>` in `index.html` to match the new extension. Compress with [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/) to stay under ~300 KB.

### Updating the venue (already set: Authentic Coffeeshop)

The map is pinned to Authentic Coffeeshop (`-7.0923364, 110.9054284`). If the venue changes:

1. Open [Google Maps](https://maps.google.com), search for the new venue.
2. Click **Share** → **Embed a map** → copy the `src` and paste into the `.event-map iframe` in `index.html`.
3. Update the `href` on the "Buka di Google Maps" `<a id="mapBtn">` button with the share link (short `maps.app.goo.gl/...` URL works fine).

---

## Per-guest personalised links

Append `?to=` with the guest's name (URL-encoded):

```
https://your-site.example.com/?to=Bapak%20dan%20Ibu%20Hadi
```

The opening cover will greet them by name (rendered via `textContent`, so it is XSS-safe).

### How invitations are sent (WhatsApp)

Sending is driven from a **Google Sheet** guest list, not from inside the invitation page. Run `setup_sheet.py` (repo root) once to build the template. Each guest row has two auto-generated columns:

- **Link Undangan** — a `HYPERLINK` to `…/?to=<name>` for that guest.
- **Kirim via WhatsApp** — a **Kirim WA** button. Its formula builds a `https://wa.me/<number>?text=<message>` deep link: it normalises the phone number (leading `0` → `62`, strips `+`/`-`) and pre-fills the full message (matching `wording_wa.txt`) including the personalised invitation link.

Workflow: fill in name + phone → click **Kirim WA** → WhatsApp opens to that chat with the message and link ready → press Send → mark the row **Terkirim**.

> Note: there is currently no in-page "Share via WhatsApp" button — the `index.html` page only handles greeting personalisation. All sending happens from the Sheet.

Tip: use a spreadsheet to build a list of personalised links. Column A = guest name, column B:

```
=CONCATENATE("https://your-site.example.com/?to=", ENCODEURL(A2))
```

---

## Deploying to GitHub Pages (free)

1. Create a new public repo on GitHub, e.g. `sangjit-ivan-sara`.
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial invitation"
   git branch -M main
   git remote add origin git@github.com:<your-user>/sangjit-ivan-sara.git
   git push -u origin main
   ```
3. In the GitHub repo → **Settings → Pages** → **Source**: `Deploy from a branch` → `main` / root → **Save**.
4. After a minute, your invitation will be live at `https://<your-user>.github.io/sangjit-ivan-sara/`.

For a custom domain (optional): point a CNAME record at `<your-user>.github.io` and add the domain in GitHub Pages settings.

---

## Features

- **Opening cover** with guest name personalisation via `?to=` URL param
- **Hero** with 囍 moon-gate ornament and peony sprays
- **Countdown** to 11 July 2026 10:00 WIB (edit `EVENT_DATE` in `assets/js/script.js` if the time changes)
- **Couple intro** cards with parents' names
- **Event details** with embedded Google Maps and a direct-link button
- **Closing** with signature "Kami yang berbahagia, Ivan & Sioni beserta keluarga"
- **Language toggle** ID ⇄ EN (persists in localStorage; default Indonesian)
- **Music toggle** — floating button, silent by default (tap to play; respects mobile autoplay rules)
- **Accessibility**: 18px+ body, high contrast, 48px tap targets, `prefers-reduced-motion` support, semantic HTML

---

## File layout

```
sioni/
├── index.html              Single-page structure
├── README.md               This file
├── .gitignore
└── assets/
    ├── css/styles.css      Palette, typography, layouts
    ├── js/script.js        Cover, countdown, language, music
    ├── img/                Hero image (swap for real photo if desired)
    └── audio/              Background music (user-supplied)
```

---

## Customising the palette

All colours live as CSS variables in `assets/css/styles.css` under `:root`. Adjust `--jade`, `--gold`, `--blush`, etc., and the whole invitation recolours.
