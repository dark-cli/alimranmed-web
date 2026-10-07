# Installation guide

**Who this is for:** The owner / content editor setting up this project
on a fresh laptop for the first time, so they can preview the site
locally and edit content through the browser-based CMS.

**Not a developer?** This guide is written for you. Each step shows
exactly what to type and what you should see. If a step fails, skip to
the **Troubleshooting** section at the bottom.

**Already technical?** See [`docs/setup.md`](setup.md) for the shorter
developer-flavoured version.

---

## What you'll end up with

- The site running on your laptop at `http://localhost:4321/`
- The CMS admin at `http://localhost:4321/admin/` — a web page where
  you can edit every article, add doctors, change the home page, etc.
- A workflow where edits you save in the CMS appear instantly in the
  local preview, and get published to the live site by committing to
  Git.

Rough time: **15–25 minutes** on a fresh machine.

---

## Step 1 — Install the three prerequisites

You need three things on your computer before the project will run.
Install them in this order.

### 1a. Node.js (version 20 or newer)

Node is what runs the site locally. The project needs version **20 or
newer** — older versions will fail with cryptic errors.

- **Download:** <https://nodejs.org/>
- Pick the **LTS** version (the one on the left). Download the installer
  for your OS and run it. Accept all defaults.
- **Verify** by opening a terminal:

  - macOS: `Cmd+Space` → type "Terminal"
  - Windows: `Win` key → type "PowerShell" or "Terminal"
  - Linux: open your usual terminal app

  Then type:

  ```bash
  node -v
  ```

  You should see something like `v20.11.0` or newer. If you see
  `command not found`, Node didn't install — try the installer again
  or reboot.

### 1b. Git

Git is how the project tracks changes and how your edits get published
to the live site.

- **macOS:** usually already installed. Type `git --version` in a
  terminal — if you see a version number, you're done. If not, install
  the Xcode Command Line Tools when macOS prompts you.
- **Windows:** download from <https://git-scm.com/> and run the
  installer. Accept all defaults.
- **Linux:** `sudo apt install git` (Debian/Ubuntu/Mint) or
  `sudo dnf install git` (Fedora).

**Verify:**

```bash
git --version
```

Should show something like `git version 2.40.0`.

### 1c. A Chromium-based browser

The CMS admin requires a browser that supports the **File System
Access API**. That means **Chrome, Edge, Brave, or Arc**. Firefox and
Safari will not work for the admin page (they'll show a blank screen).

The live site works in every browser — this restriction only applies
to the admin.

- Chrome: <https://www.google.com/chrome/>
- Edge: <https://www.microsoft.com/edge> (pre-installed on Windows)
- Brave: <https://brave.com/>

Pick one. You don't need all of them.

---

## Step 2 — Download the project

Open a terminal in the folder where you'd like the project to live
(the Desktop or Documents are fine). Then run:

```bash
git clone https://github.com/dark-cli/alimranmed-web.git
cd alimranmed-web
```

- The first command downloads the whole project — a folder called
  `alimranmed-web` will appear.
- The second command enters that folder. All later commands run from
  inside it.

> **Private repository?** If `git clone` prompts for a username /
> password, the repo is private and you need access. Ask whoever gave
> you this guide to add your GitHub account as a collaborator, then
> re-run the clone. If you've never pushed to GitHub from this
> machine before, you may also need to configure a Personal Access
> Token — see <https://docs.github.com/en/authentication>.

---

## Step 3 — Install the project's internal pieces

The project depends on a handful of libraries (Astro, Sharp, etc.) that
aren't included in the Git download. One command fetches them all:

```bash
npm install
```

This takes **2–5 minutes** on a decent connection. You'll see a lot of
scrolling text — that's normal. The command is done when the terminal
prompt comes back and there's no "ERR!" line anywhere.

A new folder called `node_modules/` appears (around 1.4 GB — it's
large, but it's gitignored so it only lives on your machine).

---

## Step 4 — Start the dev server

```bash
npm run dev
```

You should see something like:

```
 🚀  astro  v5.10.1 started in 1230ms

   ┃ Local    http://localhost:4321/
   ┃ Network  use --host to expose
```

Open **`http://localhost:4321/`** in any browser. You should see the
site. The URL redirects to `/en/` by default; for Arabic, go to
`http://localhost:4321/ar/`.

Leave this terminal window open — the dev server runs for as long as
you're editing. Any file you save (an article, an image, a style)
reloads the browser automatically.

**To stop the server** later: click into the terminal window and
press `Ctrl+C`.

---

## Step 5 — Open the CMS admin

With the dev server still running, go to:

**`http://localhost:4321/admin/`**

in **Chrome / Edge / Brave** (not Firefox or Safari).

You'll see a login screen. Click **"Work with Local Repository"**.
The browser will ask permission to access a folder — pick the
`alimranmed-web` folder you cloned in Step 2.

> **Why permission?** The CMS reads and writes the same `.md` files
> that the site builds from. There's no database, no server — just
> files on disk. The browser needs permission to touch those files.

Once granted, you'll see the collections sidebar: **Home, Doctors,
Treatments, Services, Blog, Cases, About, Contact**. Click any one
to see its entries.

**Try it:** open Home → English, change the main heading, click
**Save**. Switch to your browser tab for `http://localhost:4321/en/`
and refresh — the heading has changed. You just edited the website.

The CMS writes directly to files on your disk, so **the change isn't
live yet** — it's only on your laptop. See Step 7 for publishing.

---

## Step 6 — Day-to-day workflow

Every time you sit down to edit:

1. Open a terminal, `cd alimranmed-web`.
2. `git pull` — fetches anything new from the live site.
3. `npm run dev` — starts the preview.
4. Open `http://localhost:4321/admin/` and edit.
5. When done, see **Step 7** to publish.

When closing down:

- `Ctrl+C` in the dev-server terminal.
- Close the admin tab.

---

## Step 7 — Publishing to the live site

Edits saved in the CMS only live on your machine until you push them.
The live site at `https://alimran.clinic/` rebuilds automatically when
new commits land on the `main` branch.

In the terminal:

```bash
git status            # see what's changed
git add .             # stage every change
git commit -m "Update home page intro"
git push
```

- `git status` lists the files you've edited.
- `git add .` tells Git to include every change in the next commit.
- `git commit -m "…"` records the change with a short message.
- `git push` sends it to GitHub. Within 2–3 minutes the live site
  rebuilds and your edits are public.

**No terminal fan?** Install **[GitHub Desktop](https://desktop.github.com/)** —
it does the same four steps through a graphical interface. Open the
app, point it at the `alimranmed-web` folder, and the "Changes" panel
shows a human-readable diff. Click **Commit** then **Push**.

---

## Troubleshooting

### `node: command not found`
Node didn't install correctly. Re-run the installer from
<https://nodejs.org/>, then **restart the terminal** (the terminal
loads your PATH only when it opens).

### `npm install` fails with "EACCES" or permission errors
You ran into a Node permissions issue (common on macOS/Linux when Node
was installed via `sudo`). The clean fix:
- macOS/Linux: use [nvm](https://github.com/nvm-sh/nvm) to install Node
  under your user account. Delete the system-installed Node first.
- Windows: re-run the Node installer and make sure you're not using an
  "elevated" PowerShell.

### Browser shows "This site can't be reached" at localhost:4321
The dev server stopped (crashed, or you closed the terminal). Go back
to the terminal, make sure you're in the `alimranmed-web` folder, and
run `npm run dev` again.

### CMS admin page is blank / spinning forever
You're using Firefox or Safari. Switch to Chrome, Edge, or Brave.
Hard-refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`) after switching.

### `git push` is rejected ("non-fast-forward")
Someone else (or another device) pushed changes while you were
editing. Run `git pull --rebase`, resolve any conflicts if prompted,
then `git push` again.

### Live site didn't update after `git push`
Give it 2–3 minutes — the Cloudflare build takes a bit. If after 10
minutes it still looks stale, check the Cloudflare Pages dashboard
for a failed build. See [`docs/deployment.md`](deployment.md).

### CMS says "cannot access folder" / permission revoked
Browsers sometimes drop File System Access permissions after a long
idle. Re-open the admin page, click **Work with Local Repository**,
and pick the folder again.

### Need to reset everything
Close the dev server (`Ctrl+C`). Then:

```bash
rm -rf node_modules .astro dist
npm install
npm run dev
```

That nukes every build cache and reinstalls fresh. Your content under
`src/content/` is never touched.

---

## What to read next

- [`docs/writing-guide.md`](writing-guide.md) — the three ways to get
  content onto the site, including the AI-assisted route.
- [`docs/cms.md`](cms.md) — tour of every CMS feature + its limits.
- [`docs/content-authoring.md`](content-authoring.md) — how to write
  an article (frontmatter, voice, bilingual policy).
- [`docs/sections.md`](sections.md) — reference for every block type
  (hero, FAQ, stats, image row, …) with examples.
