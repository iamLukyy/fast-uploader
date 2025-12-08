# Fast Uploader

Simple, self-hosted file sharing.

## Features

- Drag & drop upload with progress
- Copy shareable links
- Password protected
- Dark mode

## Quick Start

```bash
cp .env.example .env
# Edit .env with your settings
docker compose up -d
```

## Environment

```
NUXT_SESSION_SECRET=<32+ chars>
NUXT_AUTH_PASSWORD=<password>
DOMAIN=upload.example.com
```

## Stack

Nuxt 4 / Nuxt UI / SQLite / Docker
