# Aurora Portal — Login Experience

An animated, interactive login page: a canvas aurora/starfield background with
mouse parallax, a 3D tilting glass card, a rotating "portal ring" emblem, and
a full-screen light-burst sequence on successful sign-in.

Made by **Anik Biswas (AK27)**.

Demo credentials (pre-filled):
- Username: `Anik Biswas`
- Password: `helloworld`

## 1. Run locally

Requires [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Aurora portal login page"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 3. Deploy (pick one)

### Vercel (recommended, zero config)
1. Go to https://vercel.com/new and import your GitHub repo.
2. Framework preset: **Vite**. Build command `npm run build`, output dir `dist`.
3. Click Deploy — you'll get a live `https://your-project.vercel.app` link.

### Netlify
1. Go to https://app.netlify.com/start and import the repo.
2. Build command: `npm run build`, publish directory: `dist`.
3. Deploy — Netlify gives you a live link.

### GitHub Pages
```bash
npm run build
npm install -g gh-pages
gh-pages -d dist
```
Then enable GitHub Pages in the repo settings (branch: `gh-pages`).

## Project structure

```
login-portal/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── components/
        ├── AuroraBackground.jsx
        ├── PortalRing.jsx
        └── LoginCard.jsx
```

## Notes

- This is a front-end-only demo: the "login" check happens in the browser
  against the two demo values above. For a real product, swap the check in
  `LoginCard.jsx`'s `handleSubmit` for a call to your auth API.
- Respects `prefers-reduced-motion` and keeps visible keyboard focus states.
