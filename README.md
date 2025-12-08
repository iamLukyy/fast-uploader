<p align="center">
  <img src="https://nuxt.com/assets/design-kit/icon-green.svg" width="80" alt="Nuxt">
</p>

<h1 align="center">FAST UPLOADER</h1>

<p align="center">
  <strong>Simple, self-hosted file sharing with style</strong>
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

<p align="center">
  <img src="https://upload.karel.app/f/b2288bbe-b9ed-4a40-baad-a6db95e1f230.png" width="280" alt="Login">
  <img src="https://upload.karel.app/f/96c09446-2e7f-4a4e-ba0d-1fbd980ebea3.png" width="280" alt="Dashboard">
  <img src="https://upload.karel.app/f/e16506dc-5db8-4fc7-94b4-52767dfa7ed2.png" width="280" alt="Share Page">
</p>

---

## Features

- **Drag & Drop Upload** - Just drop your files
- **Progress Bar** - Real-time upload progress
- **Shareable Links** - Direct links & share pages
- **EXIF Metadata** - Camera info for photos (ISO, aperture, shutter speed...)
- **Image Gallery** - Preview images with full-size view
- **Dark Mode** - Easy on the eyes
- **Password Protected** - Simple authentication
- **Self-Hosted** - Your data, your server

---

## Quick Start

```bash
git clone https://github.com/iamLukyy/fast-uploader.git
cd fast-uploader
cp .env.example .env
# Edit .env with your settings
docker compose up -d
```

**That's it!** Open `http://localhost:3000` (or your domain).

---

## Environment Variables

```env
NUXT_SESSION_SECRET=your-secret-key-min-32-chars
NUXT_AUTH_PASSWORD=your-password
DOMAIN=upload.example.com
NUXT_PUBLIC_BASE_URL=https://upload.example.com
```

---

## Run Anywhere

Fast Uploader runs on any system with Docker:

| Platform | Status |
|----------|--------|
| VPS / Cloud | Works |
| Raspberry Pi | Works |
| Home Server | Works |
| NAS (Synology, etc.) | Works |
| Local Machine | Works |

### Without Docker

```bash
pnpm install
pnpm build
node .output/server/index.mjs
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Nuxt 4](https://nuxt.com) |
| UI | [Nuxt UI](https://ui.nuxt.com) + Tailwind CSS |
| Database | SQLite (better-sqlite3) |
| Storage | Local filesystem |
| Container | Docker |

---

## License

MIT
