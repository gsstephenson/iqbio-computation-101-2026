# Computation 101 — IQ Biology Bootcamp 2026

Four-workshop computing bootcamp for the 2026 IQ Biology cohort (BioFrontiers Institute, CU Boulder):
bash & cluster computing on Fiji, Git/GitHub, Python & programming practice, and AI-assisted workflows.

All four workshops thread **one continuous project**: students build a `zfp36l2-analysis` repo — bash on Fiji
(W1) → git (W2) → Python in Colab (W3) → AI (W4) — reproducing a published RNA Biology paper from its deposited
data. W1 pulls the data with `wget` (see `data/zfp36l2-data.tar.gz`); the practice terminal is seeded with a small
themed sample. Fiji-specific values (partition, module, scratch path) are tagged `CONFIRM` pending a check on the cluster.

**Live site:** https://gsstephenson.github.io/iqbio-computation-101-2026/

## Structure

- `index.html` — slim landing/launcher: the workshop arc, schedule, and four workshop cards that
  open each session's page.
- `start-here.html` — Homework Zero checklist + the Verify & Submit readiness panel.
- `guides.html` — the three step-by-step setup guides (Connect to Fiji, SSH→GitHub, first repo), with per-OS tabs.
- `planning.html` — internal "Decisions needed Thursday" planning page (unlisted, `noindex`).
- `assets/site.css`, `assets/site.js` — shared styling + scroll-reveal used by the hub pages.
- `workshop1.html` — interactive Workshop 1 (Bash & the Cluster): practice terminal, searchable
  cheatsheet, Slurm script builder, and 24 exercises with saved progress.
- `roster.html` — organizer dashboard. Reads `roster.json` plus the public GitHub issues labeled
  `readiness` (via the GitHub API) and shows who is ready / in progress / not filed. Unlisted —
  share the URL with organizers.
- `roster.json` — expected cohort (first name + last initial only).
- `.github/ISSUE_TEMPLATE/readiness.yml` — the readiness check issue form students file from the site.
- `workshops/01-bash-cluster/` — the 2026 slide deck for Workshop 1.

No build step, no dependencies. The hub pages (`index`, `start-here`, `guides`, `planning`) share
`assets/site.css`; the workshop pages are self-contained.

## Preview locally

Serve the folder (so `roster.html` can fetch `roster.json`):
`python3 -m http.server` then open http://localhost:8000. The other pages also work opened directly.

## Publish

GitHub → **Settings → Pages** → Deploy from a branch → `main` / `(root)`.
Pages caches for ~10 minutes; hard-refresh after a push.

## Status

Live planning version. The internal **"Decisions needed Thursday"** notes now live on the unlisted
`planning.html` (not linked from the public site, `noindex`), so nothing internal needs stripping from
the public pages before release.

## Workshop 3 — syntax lecture on-site, lab in Google Colab

- `workshop3.html` is the **lecture**: a live-run Python follow-along (variables → lists → dicts →
  sets/`&` → loops → functions) using Pyodide for tiny **neutral** snippets — no data, no accounts, no
  spoilers. It ends by handing off to the lab.
- `notebooks/workshop3/` holds the **lab** as four leveled Colab workbooks
  (`beginner|intermediate|advanced|expert.ipynb`) plus instructor keys (`*-KEY.ipynb`). Each is
  self-contained: its first cell `git clone`s this repo inside the Colab Linux VM and reads the real
  DESeq2 tables from `data/zfp36l2/`. Students discover Apol11b themselves; the reveal (a peer's published
  RNA Biology paper) is the last cell.
- The page's Open-in-Colab links point at
  `colab.research.google.com/github/gsstephenson/iqbio-computation-101-2026/blob/main/notebooks/workshop3/<level>.ipynb`.
- Every workbook number is validated against the paper — see `data/zfp36l2/DATA.md` and
  `data/zfp36l2/derived/README.md`. (Note: Apol11b's direct binding is shown by gel-shift assay, not eCLIP.)
- Keys are in the public repo for now; move them to a private instructor repo before student release.
- Dataset provenance and the reference-genome fetch lesson live in `data/zfp36l2/` (`DATA.md`, `fetch_reference.sh`).
