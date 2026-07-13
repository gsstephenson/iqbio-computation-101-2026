# Computation 101 — IQ Biology Bootcamp 2026

Five-workshop computing bootcamp for the 2026 IQ Biology cohort (BioFrontiers Institute, CU Boulder):
bash & cluster computing on Fiji, Git/GitHub, Python & programming practice, AI-assisted workflows, and
statistical rigor.

All five workshops thread **one continuous project**: students build a `zfp36l2-analysis` repo — bash on Fiji
(W1) → git (W2) → Python in Colab (W3) → AI (W4) → statistics & rigor (W5) — reproducing a published RNA Biology paper from its deposited
data. W1 pulls the data with `wget` (see `data/zfp36l2-data.tar.gz`); the practice terminal is seeded with a small
themed sample. Fiji-specific values (partition, module, scratch path) are tagged `CONFIRM` pending a check on the cluster.

**Live site:** https://gsstephenson.github.io/iqbio-computation-101-2026/

## Structure

- `index.html` — slim landing/launcher: the workshop arc, schedule, and five workshop cards that
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

## Workshop 4 — verify-first AI workflow, lab in Colab

- `workshop4.html` is the **lecture**: a tool-agnostic AI-workflow follow-along built on Dan Larremore's
  *Principles for Writing Code with LLMs* — the shift to judgment over keystrokes, the reviewer/tester roles,
  when *not* to use an LLM, and the handful of ideas true of every assistant. It centers on the **verify-first
  loop**, with one live Pyodide "spot the confidently-wrong function" cell (neutral sample data), then hands off.
- `notebooks/workshop4/` holds the **lab** as four leveled Colab workbooks + instructor keys, same self-contained
  clone-the-repo pattern as W3. Theme: verifying AI-written code against ground truth the students already own.
  Beginner verifies a function against 1,343; Intermediate catches two confidently-wrong functions (an `abs()`
  bug → 2,189 and a `pvalue`-for-`padj` bug → 1,445, both vs the true 1,343); Advanced drives the AI to extend
  the paper (down-regulation, all six tissues) verifying each step against the derived tables; Expert writes the
  test first (TDD), lets AI implement to pass it, then writes an honest `AI_NOTES.md` and pushes.
- Tool-agnostic, no API key: students bring any free chat assistant (ChatGPT / Claude / Gemini / Colab's built-in
  Gemini / GitHub Copilot) and paste. Every workbook number is validated against the real DE tables.
- Instructor keys are **not** shipped as plaintext. They're rendered (with per-question grading notes), encrypted client-side (AES-GCM + PBKDF2 via Web Crypto), and viewable only through passphrase-gated `keys.html`. The `*-KEY.ipynb` are removed from the repo and scrubbed from history.

## Workshop 5 — Reading the Data: Statistics &amp; Rigor (interactive capstone)

- `workshop5.html` is a **self-contained interactive lecture** (no Colab lab, no notebooks, no keys): the "cells" are
  manipulable, canvas-based simulations the student drives, all grounded in the real ZFP36L2 numbers. Progress is saved
  per browser (`c101-w5-secs`), matching the other pages.
- Six activities, animations and a fallacy game interleaved: **(1)** a Central-Limit-Theorem sampler (pick an ugly
  parent — uniform / skewed / bimodal / gene-expression — and watch the sample means go Normal); **(2)** a **p-value
  simulator** (p is uniform under the null, ~5% "pass" at 0.05; add an effect and it piles at 0); **(3)** a
  **multiple-testing / FDR** demo on the *real* bone-marrow histogram (16,973 tests; 6,881 raw hits; ~849 expected by
  chance; Benjamini-Hochberg trims to 5,547 → the reported 1,343); **(4)** an **effect-size-vs-significance** slider
  (a trivial effect crosses p<0.05 as n grows); **(5)** an **Anscombe's Quartet** morph (identical stats, four shapes);
  **(6)** a **regression-to-the-mean** live demo plus a leveled **Spot-the-Fallacy** game (pseudoreplication,
  survivorship, spurious correlation, p-hacking, and more) with per-scenario feedback and a rigor takeaway.
- Positioned as the capstone after W4 (arc: pull → track → analyze → verify → **judge**). It formalizes the statistics
  W3/W4 already used (Anscombe, `padj`/FDR, effect size, the `pvalue`-vs-`padj` bug) and drives home the rigor real
  scientific work requires.
- Built on the IQ Biology **Statistics 101** materials and the **QED** talk by **Dr. Robin Dowell** (Dowell &amp; Allen
  labs, CU Boulder); the CLT sampler is inspired by **Seeing Theory** (Daniel Kunin, Brown). Credited on the page.
