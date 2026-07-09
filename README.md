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

## Workshop 3 — in-browser Python on real research data

- `workshop3.html` runs real CPython via Pyodide (loaded from CDN on first use) and self-checks each
  lab cell against the **ZFP36L2 knockout dataset** in `data/zfp36l2/` (GEO GSE283043 / GSE283044). Students
  discover the universal target (Apol11b) themselves; the finale reveals it's a peer's published RNA Biology paper.
- All autograder numbers are validated against the paper — see `data/zfp36l2/derived/README.md`.
- `lab/` is a prebuilt JupyterLite (a full JupyterLab in the browser) with the student notebook and the
  ZFP36L2 data baked into its file browser. Rebuild after changing the notebook or data:
  bake `files/` (notebook + the short-named data files) then `jupyter lite build --output-dir lab`
  (needs jupyterlite-core, jupyterlite-pyodide-kernel, jupyter-server; pass
  `FederatedExtensionAddon.extra_labextensions_path` if the pyodide kernel isn't found).
- `.nojekyll` keeps GitHub Pages from filtering JupyterLite's asset paths.
- Dataset provenance and the reference-genome fetch lesson live in `data/zfp36l2/` (`DATA.md`, `fetch_reference.sh`).
