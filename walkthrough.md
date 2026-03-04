# Editing Flo Karl Berger in Paper.design

## What you've got

The site is now split into three layers:

**`styles.css`** — All visual decisions. Colors, fonts, sizes, spacing, CRT effects. This is the file Paper.design can meaningfully work with. Every value lives in a CSS custom property at the top of the file, so changing `--blue: #0033CC` to `--blue: #1a1a2e` recolors the entire site.

**`interaction.js`** — All behavior. Boot sequence, keyboard navigation, page rendering, language toggle, sprites. You won't edit this in Paper — it stays in your code editor.

**`index.html`** — The glue. Just links the CSS and JS together and provides the structural skeleton (boot screen, scroll container, status bar). Minimal markup.

**`template.html`** — A static snapshot of every page state (Menu, Bio, Works, Groups, Contact) laid out as frames on a dark canvas. This is your Paper.design working file — every row is real HTML using the same classes as the live site, so any style changes you make here apply to the real thing.

---

## Step by step

### 1. Get Paper Desktop

Download from [paper.design](https://paper.design). You need the desktop app for file system access and MCP.

### 2. Open the template in Paper

Open `template.html` in Paper. Since Paper's canvas is built on real HTML/CSS, you'll see all five page states rendered with VT323, the blue background, the highlight bars — the actual site, static.

Each page state is a `page-frame` div at 1280px wide. You can scroll through them vertically on the Paper canvas.

### 3. Edit the design tokens

This is where Paper shines. Open `styles.css` alongside your Paper canvas (or connect via MCP — see below). The `:root` block at the top controls everything:

```css
:root {
  --blue:     #0033CC;    /* Background */
  --white:    #E8E8FF;    /* Body text */
  --bright:   #FFFFFF;    /* Highlight text / active */
  --dim:      #7788CC;    /* Secondary text */

  --font:     'VT323', 'Courier New', monospace;
  --size-big: clamp(34px, 6.5vw, 62px);
  --size-sml: clamp(24px, 4vw, 42px);
  --stretch:  scaleY(1.15);

  --sp-sm:    clamp(8px, 1.5vw, 16px);
  --sp-md:    clamp(12px, 2vw, 20px);
  --sp-lg:    clamp(16px, 3vw, 32px);
  --sp-xl:    clamp(24px, 4vw, 40px);

  --scanline-gap:     4px;
  --scanline-opacity: 0.08;
  --vignette-start:   50%;
  --vignette-opacity: 0.4;
  --sprite-opacity:   0.55;
}
```

In Paper, you can select any text element, tweak color/size in the inspector, then map those changes back to the CSS variables. Or edit the CSS directly and watch the template update.

### 4. Connect via MCP (optional, more powerful)

Paper's MCP server lets any coding agent read and write to your canvas. Set it up:

1. In Paper Desktop, enable the MCP server (settings → connections)
2. In Claude Code or Cursor, connect to Paper's MCP endpoint
3. Now you can prompt things like: "Change --blue to a darker navy, increase --size-big by 10%, reduce scanline opacity to 0.05" and the agent updates both the CSS file and the Paper canvas

This round-trips: design in Paper → agent reads the changes → updates `styles.css` → site reflects it.

### 5. What to edit where

| Want to change...          | Edit in...         |
|---------------------------|--------------------|
| Colors                    | `styles.css` → `:root` variables |
| Font / size / stretch     | `styles.css` → `:root` variables |
| Spacing between rows      | `styles.css` → `--sp-*` variables |
| CRT scanline intensity    | `styles.css` → `--scanline-*` |
| Vignette darkness         | `styles.css` → `--vignette-*` |
| Highlight style           | `styles.css` → `.r.hi` rule |
| Back button appearance    | `styles.css` → `.r.back-btn` rule |
| Sprite opacity on hover   | `styles.css` → `--sprite-opacity` |
| Status bar text           | `index.html` → `#statusbar` |
| Bio / works / groups text | `interaction.js` → translation objects + data arrays |
| Boot sequence timing      | `interaction.js` → `setTimeout` values in boot |
| Add/remove menu items     | `interaction.js` → `pageMenu()` function |
| Sprite pixel art          | `interaction.js` → frame arrays |

### 6. Sync back to the live site

Once you're happy with how the template looks in Paper:

1. Your `styles.css` changes already apply to `index.html` — they share the same stylesheet
2. Open `index.html` in a browser to test the full interactive version
3. If you've changed any structural HTML in the template (added rows, changed classes), mirror those changes in the corresponding page builder function in `interaction.js`

The template is a reference, not the source of truth for content. Content lives in the JS data arrays. The CSS *is* the source of truth for all visual styling.

### 7. Deploy

The three files (`index.html`, `styles.css`, `interaction.js`) are the production site. Drop them on any static host — Netlify, Vercel, a shared server, even a USB stick. No build step.
