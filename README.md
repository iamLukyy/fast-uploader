<p align="center">
  <img src="https://nuxt.com/assets/design-kit/icon-green.svg" width="80" alt="Nuxt">
</p>

<h1 align="center">FAST UPLOADER</h1>

<p align="center">
  <strong>Self-hosted file sharing</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-4-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white" alt="Nuxt 4">
  <img src="https://img.shields.io/badge/Vue-3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3">
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>

---

## Screenshots

| Login | Dashboard | Share Page |
|:-----:|:---------:|:----------:|
| ![Login](https://upload.karel.app/f/b2288bbe-b9ed-4a40-baad-a6db95e1f230.png) | ![Dashboard](https://upload.karel.app/f/96c09446-2e7f-4a4e-ba0d-1fbd980ebea3.png) | ![Share](https://upload.karel.app/f/e16506dc-5db8-4fc7-94b4-52767dfa7ed2.png) |

---

## Features

- Drag & drop upload with progress
- Shareable links (direct + share pages)
- EXIF metadata for photos
- Image preview with full-size view
- Dark mode
- Password protected
- Self-hosted

---

## Quick Start

```bash
git clone https://github.com/iamLukyy/fast-uploader.git
cd fast-uploader
cp .env.example .env
# Edit .env with your settings
docker compose up -d
```

Open `http://localhost:3000`

---

## Environment

```env
NUXT_SESSION_SECRET=your-secret-key-min-32-chars
NUXT_AUTH_PASSWORD=your-password
DOMAIN=upload.example.com
NUXT_PUBLIC_BASE_URL=https://upload.example.com
```

---

## Run Anywhere

Works on any Linux with Docker or Node.js.

### Without Docker

```bash
pnpm install
pnpm build
node .output/server/index.mjs
```

---

## Stack

Nuxt 4 / Nuxt UI / Tailwind CSS / SQLite / Docker

---

## License

MIT
