# Azmi Rehman Khan — Portfolio

Personal portfolio site, built as static HTML/CSS/JS (no build step), styled after
a distinctive single-page portfolio layout: hero, skills marquee, about, education
timeline, experience timeline, projects, skills grid, contact.

## Project structure

```
portfolio/
├── index.html
├── css/
│   ├── reset.css
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── images/        ← profile photo, logos, project screenshots
│   ├── documents/      ← resume.pdf (already added)
│   └── icons/          ← any custom icons not pulled from a CDN
├── CONTENT-PLAN.md     ← your real content mapped to each section
└── README.md
```

## 1. Environment setup (do this first)

1. Install [VS Code](https://code.visualstudio.com/)
2. Install [Git](https://git-scm.com/)
3. In VS Code, install the **Live Server** extension (by Ritwick Dey) — lets you
   preview the site locally with auto-reload, no build tools needed.
4. Create a free [GitHub](https://github.com) account if you don't have one.

No Node.js or npm is required for this project since it's plain HTML/CSS/JS.

## 2. Open and preview the project

1. Open the `portfolio` folder in VS Code (`File → Open Folder`).
2. Right-click `index.html` → **Open with Live Server**.
3. It opens in your browser at something like `http://127.0.0.1:5500` and
   auto-refreshes as you edit files.

## 3. Fill in your content

Open `CONTENT-PLAN.md` — it has your resume content already mapped to each
section, plus a list of assets still needed (photo, favicon, project
screenshots, logos). Fill in the `[ADD]` items when you have them.

## 4. Build order (what we'll do together next)

1. Design pass — pick the real color palette, typography and one signature
   visual element (replacing the placeholder tokens in `css/style.css`)
2. Build the navbar + theme toggle
3. Build the hero section
4. Build the skills marquee
5. Build about / education / experience
6. Build the projects section
7. Build the detailed skills grid + contact/footer
8. Responsive pass (mobile/tablet) + accessibility check
9. Push to GitHub and enable GitHub Pages

## 5. Publish to GitHub Pages (once the site is ready)

```bash
git init
git add .
git commit -m "Initial portfolio build"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then: repo → **Settings → Pages** → Source: `main` branch, `/root` folder →
Save. Your live URL will be `https://<your-username>.github.io/<repo-name>/`.
