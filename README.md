# Computation 101 — IQ Biology Bootcamp 2026

Three-workshop computing bootcamp for the 2026 IQ Biology cohort (BioFrontiers Institute, CU Boulder):
bash & cluster computing on Fiji, Git/GitHub, Python & programming practice, AI-assisted workflows, and
statistical rigor.

All three workshops thread **one continuous project**: students build a `zfp36l2-analysis` repo — bash on Fiji
(W1) → git (W2) → Python & statistics in Colab (W3) — reproducing a published RNA Biology paper from its deposited
data. W1 pulls the data with `wget` (see `data/zfp36l2-data.tar.gz`); the practice terminal is seeded with a small
themed sample. Fiji-specific values (partition, module, scratch path) are tagged `CONFIRM` pending a check on the cluster.

**Live site:** https://gsstephenson.github.io/iqbio-computation-101-2026/

## Structure

- `index.html` — slim landing/launcher: the workshop arc, schedule, and three workshop cards that
  open each session's page.
- `start-here.html` — Homework Zero checklist + the Verify & Submit readiness panel.
- `guides.html` — the four step-by-step setup guides (Connect to Fiji, SSH→GitHub, first repo, GPG signed commits [optional]), with per-OS tabs.
- `planning.html` — internal "Decisions needed Thursday" planning page (unlisted, `noindex`).
- `assets/site.css`, `assets/site.js` — shared styling + scroll-reveal used by the hub pages.
- `workshop1.html` — interactive Workshop 1 (Bash & the Cluster): practice terminal, searchable
  cheatsheet, Slurm script builder, and 12 hash-graded exercises with saved progress.
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

## Workshops 1–2 — paste-graded Fiji labs

- Both pages keep their on-site sandbox (practice terminal / git sandbox) as a **warmup**, then a leveled
  **"lab on Fiji"** (Beginner→Expert): students run real commands on the cluster, paste the stdout back into
  the page, and it's checked on the spot — no solutions shown. W1 answers (data-derived) are graded by
  **SHA-256 hash** so the correct value isn't in the page source; W2 confirmations (ssh/git/gpg success lines)
  are graded by regex. Every W1 hash was verified against the real data; the git/GPG sequences were tested locally.
- W2 Beginner wires GitHub↔Fiji over **SSH for every student** (once, reused all program) and pushes the
  `zfp36l2-analysis` repo — the same repo W3–4 save into. The **Expert track is optional GPG signed commits**,
  introduced with a pros/cons box; full steps in `guides.html` **Guide 4 · GPG (optional)**.

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
- W3 also teaches the two *ends* of the workflow. On the page: a paper-grounded **pipeline primer**
  (FASTQ → Trimmomatic → STAR → featureCounts → DESeq2, from the Methods) + a file-formats table, a
  **stats-literacy** section (effect size vs significance, Benjamini-Hochberg FDR), and a **reproducibility**
  step (`pip freeze`/`requirements.txt`, shipped at repo root). In the labs: **plots** built from scratch
  (bar / volcano / MA / heatmap), the universal **Anscombe's Quartet** validation capstone, and **functional
  enrichment** (`gseapy`/Enrichr, Colab-only) as the "so what," plus a your-own-question extension.
- Instructor keys are **not** shipped as plaintext. They're rendered (with per-question grading notes), encrypted client-side (AES-GCM + PBKDF2 via Web Crypto), and viewable only through passphrase-gated `keys.html`. The `*-KEY.ipynb` are removed from the repo and scrubbed from history.
- Dataset provenance and the reference-genome fetch lesson live in `data/zfp36l2/` (`DATA.md`, `fetch_reference.sh`).

## Parked — Workshops 4 and 5 (not run in 2026)

The 2026 program is **three workshops**. Workshop 4 (Advanced AI Workflows) and Workshop 5
(Reading the Data: Statistics & Rigor) have no slot in the final orientation grid and are not run
this year. Their key statistics — `padj` vs raw `p`, multiple-testing correction, effect size vs
significance — moved into Workshop 3.

`workshop4.html` and `workshop5.html` are **kept, deployed, and unlinked**: `noindex, nofollow`,
an archived banner at the top of each, and no inbound link from any live page. `notebooks/workshop4/`
stays in the repo so W4's Colab buttons still work. Bringing either back is two deletions (the banner,
the robots meta) and three restorations (an index card, an arc node, a footer link).

Credit for the statistics material now taught in Workshop 3, carried over from the Workshop 5 capstone:
built on the IQ Biology **Statistics 101** materials and the **QED** talk by **Dr. Robin Dowell**
(Dowell & Allen labs, CU Boulder); the Central Limit Theorem sampler is inspired by **Seeing Theory**
(Daniel Kunin, Brown). Anscombe's Quartet is from F. J. Anscombe (1973).
