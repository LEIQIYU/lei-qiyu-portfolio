# LEI QIYU · Personal Portfolio

A personal portfolio website for **LEI QIYU** — content creator, editor, and photographer based in Seoul, South Korea.

🔗 **Live demo**: https://8p5wkpnxa68k0.space.mcode.cn

## Stack

- Pure HTML + CSS + vanilla JavaScript (no build step)
- Cover: `<video>` hero (`assets/cover.mp4`)
- Global mouse-particle trail on a full-page `<canvas>`
- Each page is wrapped in a macOS-style "window frame" with traffic-light dots
- Korean typography via Noto Serif KR / Nanum Myeongjo (Google Fonts)

## Sections

1. **Cover** — hero video + 4 floating folder icons
2. **About me** — bilingual (EN / 한국어) bio with pop-up window reveal on scroll
3. **My channel** — YouTube + Douyin real covers with EXAMPLE tag and `lnk.bio` link
4. **My project · <嗨皮海恩>** — Bilibili video grid (4 cards)
5. **My project · <불청객>** — short film poster (right) + meta & crew (left), 14th Chungmuro IFF Jury Special Prize
6. **My project · <북작북작>** — variety show stills + YouTube embed
7. **Photo by me** — 25 photos across 4 themed groups (lightbox navigation)
8. **My skill** — 3-column skill table (Design / Photo & Video / Langs) with 5-row rating
9. **Contact me** — email, phone, 4 mini folders

## File layout

```
portfolio/
├── index.html          # 9 sections + global particle canvas
├── style.css           # ~21 KB, fully responsive
├── script.js           # particles, smooth scroll, lang toggle, lightbox, IO reveal
└── assets/
    ├── cover.mp4        # hero video
    ├── about-me-1.jpg   # portrait
    ├── yt-1..3.jpg      # YouTube covers (extracted from channel.pdf)
    ├── dy-1..5.jpg      # Douyin covers (extracted from channel.pdf)
    ├── proj01-poster.jpg, proj01-crew.jpg
    ├── proj02-still-1.png, proj02-still-2.png
    ├── window-bg.jpg
    └── photos/          # 25 photos in 4 themed groups
        ├── retro-*.jpg
        ├── silk-*.jpg
        ├── midnight-*.jpg
        └── friends-*.jpg
```

## Run locally

```bash
cd portfolio
python3 -m http.server 8765
# open http://127.0.0.1:8765/
```

Any static file server works (`npx serve`, `caddy file-server`, etc.).

## License

Personal portfolio. Contents and assets © LEI QIYU.