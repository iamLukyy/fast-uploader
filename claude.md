# Fast Uploader

## Project Overview
Moderní file upload aplikace na **upload.karel.app**

## Tech Stack
- **Framework**: Nuxt 4
- **UI**: Nuxt UI 4 + Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Session**: h3 sealed cookies
- **Storage**: Local filesystem (/data/uploads)
- **Container**: Docker + Traefik

## Key Configuration
- **Auth Password**: `luky` (env: NUXT_AUTH_PASSWORD)
- **Max File Size**: 500 MB
- **Allowed Types**: All
- **Public Downloads**: Yes (no auth required for /f/:filename)

## API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | No | Login with password |
| POST | /api/auth/logout | Yes | Logout |
| GET | /api/auth/session | No | Check session |
| GET | /api/files | Yes | List files |
| POST | /api/files | Yes | Upload file |
| DELETE | /api/files/:id | Yes | Delete file |
| GET | /f/:filename | No | Public download |

## Directory Structure
```
app/
  components/     # Vue components
  composables/    # useAuth, useFiles, useUpload
  middleware/     # auth.ts
  pages/          # index.vue, login.vue
server/
  api/            # API routes
  routes/         # Public file serving
  utils/          # db.ts, session.ts, storage.ts
  plugins/        # database.ts init
data/
  uploads/        # Stored files
  database.sqlite # SQLite database
```

## Database Schema
```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  original_name TEXT NOT NULL,
  stored_name TEXT NOT NULL UNIQUE,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Current Status
- [x] Project initialized with Nuxt 4 + Nuxt UI
- [x] GitHub repo created (public): https://github.com/iamLukyy/fast-uploader
- [x] Backend auth implementation
- [x] Backend database setup (SQLite)
- [x] Backend file API (upload, list, delete, download)
- [x] Frontend auth (login page, middleware)
- [x] Frontend upload UI (drag & drop, progress bar)
- [x] Frontend file browser (grid, copy link, delete)
- [x] Docker deployment (Node 24, Traefik)

## Deployment
Live at: **https://upload.karel.app**

## Environment Variables (required)
```
NUXT_SESSION_SECRET=<min 32 chars>
NUXT_AUTH_PASSWORD=<your password>
DOMAIN=upload.karel.app
NUXT_PUBLIC_BASE_URL=https://upload.karel.app
```
