# Speed Lines

A real-time configuration playground for animated speed-line backgrounds. Design, preview, and export stunning converging beam effects for hero sections, landing pages, and beyond.

## Features

- **Live preview** — every parameter updates the background instantly
- **Configurable beams** — control count, convergence gap, vertical spread, palette, opacity, stroke width, glow blur, and animation
- **Accent beams** — add highlighted beams with separate styling
- **Text overlay** — hero heading, subtext, and CTA button with customizable content and URL
- **Effects** — vignette, edge glow, center radial glow, and orthogonal grid with fade mask
- **Seeded RNG** — deterministic layouts via a configurable seed
- **Export / Import** — download configs as `.txt` (human-readable summary + raw JSON) and re-import them later
- **Randomize & Reset** — quickly explore variations or restore defaults

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Linting | ESLint 9 |

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn / pnpm / bun)

### Installation

```bash
git clone <repo-url>
cd speed-lines
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Production Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project Structure

```
speed-lines/
├── public/                        # Static assets
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind import, custom classes & keyframes
│   │   ├── layout.tsx             # Root layout with metadata and fonts
│   │   └── page.tsx               # Main page — wires config state to components
│   └── components/
│       ├── ControlPanel.tsx       # Right-side collapsible settings panel
│       ├── HeroSection.tsx        # Text overlay with heading, subtext, CTA, grid & glow
│       └── SpeedLinesBackground.tsx  # SVG speed-lines renderer with animations
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## How It Works

**SpeedLinesBackground** renders SVG beams that curve from the left and right edges toward a configurable center gap. Beams use gradient strokes that fade toward the center. A seeded pseudo-random number generator ensures layouts are deterministic and reproducible.

A subset of beams can be animated with dashed "particle" trails using CSS keyframes. Additional layers include edge glow (radial gradients on left/right), a vignette overlay, and optional accent beams with separate styling.

**ControlPanel** is a glassmorphism sidebar with collapsible sections for every parameter group — beams, colors, stroke, animation, glow & effects, accent beams, text overlay, center glow, grid, and seed. It also provides download/upload, randomize, and reset actions.

**HeroSection** renders an optional overlay with a heading, subtext, and CTA button. It supports a center radial glow and an orthogonal SVG grid with a fade mask.

## Configuration Sections

| Section | Controls |
| --- | --- |
| Beams | Count, convergence gap, top/bottom spread |
| Colors | Background color, beam color palette (add/remove/edit) |
| Stroke | Width, opacity, glow blur |
| Animation | Chance, speed, dash pattern |
| Glow & Effects | Vignette, edge glow |
| Accent Beams | Toggle, count, width, opacity |
| Text Overlay | Heading, subtext, CTA label & URL |
| Center Glow | Inner/outer color, size |
| Grid | Toggle, color, opacity, spacing |
| Seed | Numeric seed for deterministic randomness |

## License

MIT
