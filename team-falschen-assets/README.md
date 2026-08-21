# Team Fälschen Local Visual Asset Bundle

This archive contains the visual assets used by the Team Fälschen showcase, plus the supplied source variants. It was assembled as a single ZIP for local download. The website currently uses managed paths beginning with `/manus-storage/`; for a local copy, place the files in a folder such as `public/assets/` and replace those managed URLs with local paths such as `/assets/falschen-hero-globe.png`.

## Current website assets

| File | Role | Current managed reference |
|---|---|---|
| `falschen-hero-globe.png` | Hero globe / technical sketch background | `/manus-storage/falschen-hero-globe_f40db927.png` |
| `falschen-research-schematic.png` | Research section schematic background | `/manus-storage/falschen-research-schematic_f08b8a0f.png` |
| `falschen-footer-dither.png` | Footer dither texture | `/manus-storage/falschen-footer-dither_74ec1dbf.png` |
| `falschen-anvil.svg` | Original anvil mark used in hero/footer | `/manus-storage/falschen-anvil_035baa3d.svg` |
| `main-forge-icon.png` | Attached forge icon used in the navbar lockup | `/manus-storage/main-forge-icon_d1a6a0b8.png` |
| `lifesphere-mark.png` | LifeSphere logo used by the React ASCII renderer | `/manus-storage/lifesphere-mark_befa514c.png` |

## Supplied source variants

The archive also includes the supplied logo and sketch variants under `supplied-sources/`, including the original transparent icon files, LifeSphere variants, dark and white wordmark versions, and the three ChatGPT-generated image files. These are preserved as source material and are not all active references in the current project.

## Local replacement example

```tsx
const heroArt = "/assets/falschen-hero-globe.png";
const logoUrl = "/assets/main-forge-icon.png";
const lifesphereMark = "/assets/lifesphere-mark.png";
```
