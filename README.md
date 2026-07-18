# BloodBikeWest Hub

A landing page that links out to the two BloodBikeWest apps:

- **Rota** → `rota.bloodbikewest.ie` (prod) / `dev.rota.bloodbikewest.ie` (dev)
- **Control Center** → `app.bloodbikewest.ie` (prod) / `dev.app.bloodbikewest.ie` (dev)

Plain HTML/CSS/JS, no build step. Two branches, `main` and `dev`, differ only
in `config.js` (which URLs the cards link to, and whether the dev banner shows).

## 1. Push to GitHub

This repo already has both branches committed locally. To get it onto GitHub:

```bash
# create a new empty repo called "Hub" on github.com first (no README/gitignore), then:
cd hub
git remote add origin https://github.com/<your-org-or-username>/Hub.git
git push -u origin main
git push -u origin dev
```

## 2. Connect to Netlify

1. Netlify → **Add new site → Import an existing project** → pick the `Hub` repo.
2. Set **Production branch** to `main`. Build command: none. Publish directory: `.`
3. Go to **Site configuration → Build & deploy → Branches and deploy contexts**,
   and add `dev` as a branch deploy (not just a preview) so it gets its own
   persistent URL that stays live.

## 3. Custom domains

You'll need **two** Netlify sites if you want both `hub.bloodbikewest.ie` (main)
and `dev.hub.bloodbikewest.ie` (dev) live at the same time as separate,
permanently-addressable sites — Netlify's branch subdomains are normally
`dev--yoursite.netlify.app` by default, so to get `dev.hub.bloodbikewest.ie`
specifically you have two options:

**Option A — one Netlify site, branch deploy + Netlify DNS**
If bloodbikewest.ie's DNS is already delegated to Netlify DNS, you can assign
`dev.hub.bloodbikewest.ie` as a **branch subdomain** for the `dev` branch deploy
directly in Domain settings, alongside `hub.bloodbikewest.ie` for `main`.

**Option B — two Netlify sites, same repo, different branch**
Create a second Netlify site pointing at the same GitHub repo but with
**production branch = `dev`**. Then add `hub.bloodbikewest.ie` as the custom
domain on site 1 (main) and `dev.hub.bloodbikewest.ie` as the custom domain on
site 2 (dev). This is the simpler option if your DNS isn't on Netlify — you just
add a `CNAME` record for each subdomain pointing at that site's `*.netlify.app` address.

DNS records needed either way (with your DNS provider):
```
hub.bloodbikewest.ie      CNAME   <your-site>.netlify.app
dev.hub.bloodbikewest.ie  CNAME   <your-dev-site>.netlify.app
```

Netlify will auto-provision HTTPS certs for each once the CNAME resolves.

## 4. Updating the app links later

Edit `config.js` on the relevant branch and push — no other files need to change.
