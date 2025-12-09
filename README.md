<p align="center">
  <img src="https://nuxt.com/assets/design-kit/icon-green.svg" width="80" alt="Nuxt">
</p>

<h1 align="center">FAST UPLOADER</h1>

<p align="center">
  <strong>Your own file sharing server in minutes</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-4-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white" alt="Nuxt 4">
  <img src="https://img.shields.io/badge/Vue-3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3">
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>

<p align="center">
  <a href="https://github.com/iamLukyy/fast-uploader/stargazers">
    <img src="https://img.shields.io/github/stars/iamLukyy/fast-uploader?style=social" alt="Stars">
  </a>
  <a href="https://github.com/iamLukyy/fast-uploader/fork">
    <img src="https://img.shields.io/github/forks/iamLukyy/fast-uploader?style=social" alt="Forks">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/commit-activity/m/iamLukyy/fast-uploader?style=flat-square&label=commits" alt="Commits">
  <img src="https://img.shields.io/github/last-commit/iamLukyy/fast-uploader?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/github/contributors/iamLukyy/fast-uploader?style=flat-square" alt="Contributors">
</p>

---

## Why?

Tired of:
- Uploading files to random websites?
- Links expiring after 24 hours?
- File size limits?
- Privacy concerns?

Host your own. It takes 5 minutes.

---

## Screenshots

| Login | Dashboard | Share Page |
|:-----:|:---------:|:----------:|
| ![Login](https://upload.karel.app/f/b2288bbe-b9ed-4a40-baad-a6db95e1f230.png) | ![Dashboard](https://upload.karel.app/f/96c09446-2e7f-4a4e-ba0d-1fbd980ebea3.png) | ![Share](https://upload.karel.app/f/e16506dc-5db8-4fc7-94b4-52767dfa7ed2.png) |

---

## Features

- Drag & drop upload with progress bar
- **Ctrl+V paste** - upload screenshots directly from clipboard
- Shareable links (direct download + share pages)
- EXIF metadata display for photos
- Image preview with full-size view
- **Smart thumbnails** - auto-generated for large images
- **Grid/List view** toggle with preference saved
- Dark mode
- Password protected
- No file size limits (you control it)
- No expiration (your files stay forever)
- Self-hosted (your data, your server)

---

## Quick Start

```bash
git clone https://github.com/iamLukyy/fast-uploader.git
cd fast-uploader
cp .env.example .env
nano .env  # Set your password and secret
docker compose up -d
```

Done. Open `http://localhost:3000`

---

## Environment

```env
NUXT_SESSION_SECRET=your-secret-key-min-32-chars
NUXT_AUTH_PASSWORD=your-password
DOMAIN=localhost
```

---

## Host It Yourself

### Option 1: Raspberry Pi (free, at home)

Works on Raspberry Pi 4/5 with Docker:

```bash
# Install Docker on Raspberry Pi
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Logout and login again

# Clone and run
git clone https://github.com/iamLukyy/fast-uploader.git
cd fast-uploader
cp .env.example .env
nano .env
docker compose up -d
```

Want public access? Forward port 3000 in your router settings.

### Option 2: VPS ($3-5/month)

Any cheap VPS works (Hetzner, DigitalOcean, Contabo...):

```bash
git clone https://github.com/iamLukyy/fast-uploader.git
cd fast-uploader
cp .env.example .env
nano .env  # Set DOMAIN=your-domain.com
docker compose up -d
```

Add a reverse proxy (nginx, Traefik, Caddy) for HTTPS.

### Option 3: Without Docker

```bash
# Requires Node.js 20+ and pnpm
pnpm install
pnpm build
node .output/server/index.mjs
```

---

## Contributing

Contributions welcome! Feel free to:

- Open issues for bugs or feature requests
- Submit pull requests
- Improve documentation
- Share the project

---

## Stack

Nuxt 4 / Nuxt UI / Tailwind CSS / Sharp / SQLite / Docker

---

## AI Assisted

<p>
  <img src="https://img.shields.io/badge/Claude-AI-cc9b7a?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude AI">
</p>

Commit messages and code comments were generated with [Claude](https://claude.ai).

---

## License

MIT - do whatever you want with it.
