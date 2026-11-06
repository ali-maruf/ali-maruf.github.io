# ali-maruf.github.io

Personal site. Plain HTML, CSS and about 4 KB of JavaScript. There's no build step: push it and it's live.

## Run locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Publish on GitHub Pages

1. Create a public repo named exactly `ali-maruf.github.io`.
2. Push this folder to `main`.
3. Go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, then `main` / `root`.
4. The site goes live at https://ali-maruf.github.io within a minute or two.

## Swap a placeholder for a real screenshot

Every tinted block is a `.shot`. Put an `<img>` inside it:

```html
<div class="shot" data-label="">
  <img src="/assets/img/digibikri.webp" width="1600" height="1000" alt="DigiBikri home page" loading="lazy" decoding="async">
</div>
```

- Export at 1600×1000 (16:10) for list and grid items, and 1920×1080 for case-page heroes. Use WebP or AVIF, under 150 KB each.
- Remove `data-label` once there's a real image.
- For the startup list, the image goes inside `.row-shot`. The hover preview copies it automatically.

## Add a startup

1. Copy a `<li>` in the `#work` list in `index.html`.
2. Copy a folder in `work/` and edit its text.
3. Update the "Next project" link on the case page before it, and add the URL to `sitemap.xml`.

## Brand rules

- One accent color, `#7B5CFF` (tokens on `:root` in `assets/css/site.css`).
- The accent period after the name is the brand mark. Headings end with it.
- Glass is used only for the nav, the hover preview and the contact card.
- One radius (`18px`). Mono labels follow the format `YEAR — STATUS`.
