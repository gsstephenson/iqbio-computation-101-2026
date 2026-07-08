# Computation 101 — IQ Biology Bootcamp 2026

Four-workshop computing bootcamp for the 2026 IQ Biology cohort (BioFrontiers Institute, CU Boulder):
bash & cluster computing on Fiji, Git/GitHub, Python & programming practice, and AI-assisted workflows.

**Live site:** https://gsstephenson.github.io/iqbio-computation-101-2026/

## Structure

- `index.html` — bootcamp hub: workshop arc & schedule, Homework Zero checklist, setup guides,
  and the Verify & Submit readiness panel. Self-contained.
- `workshop1.html` — interactive Workshop 1 (Bash & the Cluster): practice terminal, searchable
  cheatsheet, Slurm script builder, and 24 exercises with saved progress. Self-contained.
- `roster.html` — organizer dashboard. Reads `roster.json` plus the public GitHub issues labeled
  `readiness` (via the GitHub API) and shows who is ready / in progress / not filed. Unlisted —
  share the URL with organizers.
- `roster.json` — expected cohort (first name + last initial only).
- `.github/ISSUE_TEMPLATE/readiness.yml` — the readiness check issue form students file from the site.
- `workshops/01-bash-cluster/` — the 2026 slide deck for Workshop 1.

No build step, no dependencies — every page is a single static file.

## Preview locally

Serve the folder (so `roster.html` can fetch `roster.json`):
`python3 -m http.server` then open http://localhost:8000. The other pages also work opened directly.

## Publish

GitHub → **Settings → Pages** → Deploy from a branch → `main` / `(root)`.
Pages caches for ~10 minutes; hard-refresh after a push.

## Status

Live planning version. The **"Decisions needed Thursday"** section on `index.html` is internal —
delete it before the page goes out to students.

## Workshop 3 — in-browser Python

- `workshop3.html` runs real CPython via Pyodide (loaded from CDN on first use) and self-checks each
  lab cell against the genome in `data/lambda.fasta` (NCBI J02459.1, 48,502 bp).
- `lab/` is a prebuilt JupyterLite (a full JupyterLab in the browser) with the student notebook and the
  genome baked into its file browser. Rebuild after changing the notebook:
  `jupyter lite build --contents files --output-dir lab` (needs jupyterlite-core, jupyterlite-pyodide-kernel, jupyter-server).
- `.nojekyll` keeps GitHub Pages from filtering JupyterLite's asset paths.
