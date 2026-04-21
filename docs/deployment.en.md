# Deployment — VPS + GitHub Actions

> 中文版請見 [deployment.md](./deployment.md)。

This doc explains how to manually trigger the `Deploy to VPS` workflow via GitHub Actions to deploy the Portfolio static site to your own VPS (behind Nginx).

## Architecture

```
GitHub master → (manual) workflow_dispatch → GitHub Actions runner
    ↓ npm ci → npm run build (VITE_BASE=/smartresume/)
    ↓ rsync dist/ → VPS
VPS: /var/www/smartresume/  ← Nginx root
    ↓
https://your-domain.example.com/smartresume/
```

## One-time setup

### 1. Generate a deploy key on the VPS

SSH into the VPS and run:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -C "github-actions-deploy" -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

> `-N ""` means an empty passphrase — GitHub Actions cannot type one interactively. Use this key for deployment only; don't reuse your personal SSH key.

### 2. Copy the deploy key's private half

```bash
cat ~/.ssh/github_deploy
```

Copy the entire block including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`.

### 3. Configure GitHub Repository Secrets

GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Add each:

| Name | Value | Notes |
|------|-------|-------|
| `VPS_HOST` | `your-domain.example.com` | VPS address (domain or IP) |
| `VPS_USER` | `deploy` | SSH username |
| `VPS_SSH_KEY` | Private key from step 2 | Deploy key private half |
| `VPS_DEPLOY_PATH` | `/var/www/smartresume` | Target directory (no trailing slash) |

### 4. Prepare the target directory and Nginx on the VPS

Create the directory:

```bash
sudo mkdir -p /var/www/smartresume
sudo chown -R $USER:$USER /var/www/smartresume
```

Example Nginx server block (adjust for your setup, then `nginx -t && systemctl reload nginx`):

```nginx
server {
    listen 80;
    server_name your-domain.example.com;

    location /smartresume/ {
        alias /var/www/smartresume/;
        try_files $uri $uri/ /smartresume/index.html;
        index index.html;
    }
}
```

> To enable HTTPS later: `certbot --nginx -d your-domain.example.com` sets up a Let's Encrypt certificate automatically.

## Trigger a deployment

1. Go to the GitHub repo → **Actions** tab
2. Pick `Deploy to VPS` on the left
3. Click `Run workflow` (top-right)
4. `base_path` defaults to `/smartresume/` — leave as-is or change it, then click the green button
5. After ~1-2 minutes the workflow turns green and the site is updated

## Verify the build locally (no deploy)

```bash
# Mirror the CI build — same subpath-prefixed asset URLs
VITE_BASE=/smartresume/ npm run build

# Preview locally (uses preview mode)
npm run preview -- --base /smartresume/
```

Open `dist/index.html` and you should see `<script src="/smartresume/assets/xxx.js">` — the prefix is applied.

## Troubleshooting

| Symptom | Likely cause |
|---------|--------------|
| Workflow fails at `Configure SSH` | `VPS_SSH_KEY` is malformed (header/footer trimmed, newlines stripped) |
| `rsync` can't connect — `Connection refused` | SSH port isn't 22; add it via `-e "ssh -p xxxx ..."` or configure `~/.ssh/config` on the VPS |
| `rsync` connects but `Permission denied` | Target directory not writable; `chown -R $USER:$USER /path` |
| Site 404s after deploy | Nginx `alias` path is wrong, or `try_files` doesn't fall back for SPA |
| Assets (JS/CSS) return 404 | `VITE_BASE` wasn't passed, or Nginx `location` doesn't match the subpath |

## Swapping the default deploy target

To deploy somewhere else later (e.g. `example.com/app/`):

- Update the GitHub secrets `VPS_HOST` / `VPS_USER` / `VPS_DEPLOY_PATH`
- Pass a new `base_path` (e.g. `/app/`) when triggering the workflow
- Update the Live Demo URL in the README

The workflow file itself does **not** need to change.
