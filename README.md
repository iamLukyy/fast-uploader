<p align="center">
  <img src="https://api.iconify.design/lucide:arrow-down-to-line.svg?color=%23888" width="80" alt="Drop">
</p>

<h1 align="center">DROP</h1>

<p align="center">
  <strong>Your own file sharing server. Share with friends, no limits.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Self_Hosted-Your_Data-555?style=for-the-badge" alt="Self Hosted">
  <img src="https://img.shields.io/badge/Raspberry_Pi-Ready-333?style=for-the-badge&logo=raspberry-pi&logoColor=white" alt="Raspberry Pi">
  <img src="https://img.shields.io/badge/Docker-Ready-333?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-4-333?style=for-the-badge&logo=nuxt.js&logoColor=white" alt="Nuxt 4">
  <img src="https://img.shields.io/badge/SQLite-Database-333?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
</p>

---

## Why Self-Host?

Tired of:
- File size limits on every service?
- Links expiring after 24 hours?
- Ads and upsells everywhere?
- Not knowing where your data goes?

**Host your own uploader.** It takes 5 minutes.

- **No limits** - you decide the max file size
- **No expiration** - your files stay forever
- **Your data** - stored on YOUR server
- **Share freely** - send links to anyone
- **Complete privacy** - no tracking, no analytics

---

## Features

- **Drag & drop** upload with progress bar
- **Ctrl+V paste** - upload screenshots directly
- **Shareable links** - direct download or share page
- **Smart thumbnails** - auto-generated for images
- **EXIF display** - camera info for photos
- **Grid/List view** - toggle with saved preference
- **Dark mode** - easy on the eyes
- **Password protected** - only you can upload

---

## Quick Start

```bash
git clone https://github.com/iamLukyy/drop.git
cd drop
cp .env.example .env
nano .env  # Set your password
docker compose up -d
```

Open `http://localhost:3000` - done!

---

## Deployment Options

### Option A: Raspberry Pi at Home (Free)

Perfect for personal use. Your files stay in your house.

**Requirements:**
- Raspberry Pi 4 or 5 (2GB+ RAM)
- SD card or USB storage
- Internet connection

**Step 1: Install Docker**

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

Log out and log back in.

**Step 2: Run Drop**

```bash
git clone https://github.com/iamLukyy/drop.git
cd drop
cp .env.example .env
nano .env  # Set NUXT_AUTH_PASSWORD
docker compose up -d
```

**Step 3: Access locally**

Find your Pi's IP:
```bash
hostname -I
```

Open `http://YOUR_PI_IP:3000` from any device on your network.

---

### Make It Public (Port Forwarding)

Want to share files with friends outside your network?

**1. Forward port in your router:**
- Go to your router admin (usually `192.168.1.1`)
- Find "Port Forwarding" settings
- Forward external port `3000` to your Pi's local IP, port `3000`

**2. Get your public IP:**
```bash
curl ifconfig.me
```

**3. Share with friends:**
```
http://YOUR_PUBLIC_IP:3000
```

**Dynamic IP? Use DuckDNS (free):**

1. Create account at [duckdns.org](https://www.duckdns.org)
2. Create a subdomain (e.g., `mydrop.duckdns.org`)
3. Install the update script on your Pi:

```bash
mkdir -p ~/duckdns
echo 'echo url="https://www.duckdns.org/update?domains=YOUR_SUBDOMAIN&token=YOUR_TOKEN&ip=" | curl -k -o ~/duckdns/duck.log -K -' > ~/duckdns/duck.sh
chmod 700 ~/duckdns/duck.sh
```

4. Add to crontab (`crontab -e`):
```
*/5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1
```

Now share: `http://mydrop.duckdns.org:3000`

---

### Option B: VPS / Cloud Server ($3-5/month)

Most reliable for public access. Always online, static IP, easy HTTPS.

**Recommended providers:**
- [Hetzner Cloud](https://www.hetzner.com/cloud) - Cheapest in EU (~$4/mo)
- [DigitalOcean](https://www.digitalocean.com) - Simple, $6/mo
- [Contabo](https://contabo.com) - Great value
- [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/) - Free forever (limited)

**Step 1: Deploy**

```bash
ssh root@your-vps-ip
git clone https://github.com/iamLukyy/drop.git
cd drop
cp .env.example .env
nano .env
```

Set these in `.env`:
```env
NUXT_AUTH_PASSWORD=your-secure-password
NUXT_SESSION_SECRET=run-openssl-rand-base64-32
NUXT_PUBLIC_BASE_URL=https://your-domain.com
```

```bash
docker compose up -d
```

**Step 2: Add HTTPS with Caddy (easiest)**

```bash
apt update && apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install caddy
```

Edit `/etc/caddy/Caddyfile`:
```
your-domain.com {
    reverse_proxy localhost:3000
}
```

```bash
systemctl restart caddy
```

Caddy automatically gets SSL certificates from Let's Encrypt!

**Alternative: Use included Traefik config**

```bash
# Create Traefik network first
docker network create traefik

# Edit docker-compose.traefik.yml with your domain
docker compose -f docker-compose.traefik.yml up -d
```

---

### Option C: Local Network Only

For home or office use without internet access.

```bash
git clone https://github.com/iamLukyy/drop.git
cd drop
cp .env.example .env
nano .env  # Set password
docker compose up -d
```

Access from any device on the same network:
```
http://192.168.1.XXX:3000
```

Share files with family/coworkers without exposing anything to the internet.

---

## Configuration

Create `.env` from the example:
```bash
cp .env.example .env
```

**Required settings:**

| Variable | Description |
|----------|-------------|
| `NUXT_AUTH_PASSWORD` | Your login password |
| `NUXT_SESSION_SECRET` | Random string, min 32 chars |

Generate a secret:
```bash
openssl rand -base64 32
```

**Optional settings:**

| Variable | Description |
|----------|-------------|
| `NUXT_PUBLIC_BASE_URL` | Your public URL (for share links) |
| `DOMAIN` | Domain for Traefik setup |

---

## Storage & Backups

**Where files are stored:**
```
./data/
├── uploads/          # Your uploaded files
└── database.sqlite   # File metadata
```

**Backup everything:**
```bash
cp -r ./data ./backup-$(date +%Y%m%d)
```

**Restore:**
```bash
cp -r ./backup-YYYYMMDD/* ./data/
```

**Default limits:**
- Max file size: 10GB (configurable in code)
- Storage: Limited only by your disk space

---

## Stack

Built with: **Nuxt 4** / **Vue 3** / **Tailwind CSS** / **SQLite** / **Sharp** / **Docker**

---

## Contributing

Contributions welcome!

- Open issues for bugs or feature requests
- Submit pull requests
- Improve documentation
- Star the repo if you like it

---

## License

MIT - do whatever you want with it.

