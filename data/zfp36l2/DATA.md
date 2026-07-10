# ZFP36L2 tissue-selective mRNA targeting — dataset provenance

All data here comes from a published, open-access study. It is used in the Computation 101
bootcamp with attribution, under the terms below. **Public, deposited data — safe to reuse and share.**

## Source publication

Stephenson GS, Fleifel D, Cook JG, Laederach A, Ramos SBV.
**The RNA binding protein ZFP36L2 displays tissue-selective mRNA targeting in mice.**
*RNA Biology* 2026;23(1):1–24. https://doi.org/10.1080/15476286.2026.2690792

License: **Creative Commons Attribution-NonCommercial (CC BY-NC 4.0).** Non-commercial reuse
(including university teaching) is permitted with attribution. Cite the paper above.

First author: George Stephenson (this bootcamp's organizer), BCB Program, UNC-Chapel Hill.

## Accessions

| Data | Accession | BioProject |
|------|-----------|------------|
| RNA-seq (WT vs *Zfp36l2*-KO, 6 tissues) | GEO **GSE283043** | PRJNA1191493 |
| eCLIP-seq (MLTC-1 cells, anti-ZFP36L2 vs IgG) | GEO **GSE283044** | PRJNA1191490 |
| eCLIP peak browser session | UCSC: `gsgeorge/Zfp36l2_mm10_eclip_peaks` | — |

GEO: https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE283043 · https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE283044

## Methods (for reproducing / advanced activities)

- **Reference genome:** **GRCm38.p6** — GenBank `GCA_000001635.8` / RefSeq `GCF_000001635.26`
  (assembly confirmed by first author). Served by **Ensembl release-102**, the final GRCm38 release
  (verified against Ensembl's assembly README: release-102 = `GCA_000001635.8`). mm10-equivalent.
  *Note:* GRCm38.p6 fixes the assembly exactly; the gene annotation carries a minor release dimension
  (Ensembl 91–102 all use GRCm38.p6) — release-102 is the canonical final GRCm38.p6 annotation, and the
  deposited DE tables already encode the exact gene models used, so no drift in any vendored result.
- **Alignment:** Trimmomatic v0.36 → STAR **v2.5.2b** (two-pass) → **featureCounts** (Subread **v1.5.2**) → **DESeq2** (Wald test).
- **Differential expression call:** a gene is up-/down-regulated if **|log2FoldChange| > 1 and padj < 0.05**
  (up = log2FC > 1; down = log2FC < −1).
- **eCLIP:** EclipseBio protocol; MLTC-1 Leydig cells (ATCC CRL-2065); anti-ZFP36L2 (Abcam ab70775)
  vs rabbit IgG control (ab313801); peaks called at log2FC > 1.

## What's vendored here vs. referenced

**Vendored** (processed, teaching-sized — in this folder):

- `expression_table1.csv` — Supplementary Table 1: WT expression of the up-regulated gene set — the WT-detected subset (2,111 of the ~2,223-gene union) across 6 tissues.
- `de/<Tissue>_DE.csv` — the six full per-tissue DESeq2 tables (Lung, Liver, BM, Spleen, Ovary, Kidney; ~17,390 genes each).
- `eclip/ZFP36L2_vs_IgG_peaks.tsv` — eCLIP peak comparison table (ZFP36L2 vs IgG).
- `derived/` — small teaching files computed from the above (per-tissue up/down gene lists, the Apol11b intersection, ARE examples). See `derived/README.md`.

**Referenced, not vendored** (large + canonical at source — pull with `fetch_reference.sh`):

- Ensembl GRCm38 genome FASTA and GTF annotation. *Finding and downloading these is a Workshop 4 advanced activity* — see the script.
- Raw reads (SRA) and coverage tracks: `GSE283043_RAW.tar` (188 MB), `GSE283044_RAW.tar` (111 MB, bigWig).

## Ground-truth landmarks (published results — used to auto-check exercises)

- **Apol11b** is the single gene up-regulated in **all six** tissues.
- **16** genes are up-regulated in **four or more** tissues (the paper reports 17 — a one-gene
  downstream-definition difference; the autograders use the reproduced 16, see `derived/README.md`).
- Largest up-regulated *coding* sets: **bone marrow 1,135**, **spleen 430**.
- IgV (immunoglobulin variable) genes: **2.40%** of up-regulated genes. *(paper figure; on the unique up-gene set it reproduces as ≈3.1%.)*
- Up-regulated-gene detection rates across WT tissues: **74–83%**.
- AREScore (3′UTRs): up-regulated mean **3.75** vs **2.82** for the rest (p = 1.48×10⁻¹²);
  core motif **AUUUA**; Apol11b carries one 7-mer ARE, **UAUUUAU**.
- eCLIP: **2,143** reproducible peaks → **597** genes; **258** peaks at 3′UTRs. *(published figures; the vendored eCLIP table reproduces ~55,449 peaks → 164 3′UTR peaks — see `derived/README.md`.)*
- **Apol11b is *not* among the eCLIP peaks** — it isn't expressed in the MLTC-1 cell line the eCLIP
  used (paper Discussion; confirmed by qPCR). ZFP36L2 binding to the **Apol11b 3′UTR was shown by
  gel-shift assay (EMSA, Figure 5C)** over its single 7-mer ARE (UAUUUAU), *not* by eCLIP. eCLIP's
  cell-line dependence — capturing only genes expressed in MLTC-1 — is the documented limitation the
  paper highlights. So Apol11b's direct-target evidence is ARE + EMSA; eCLIP is genome-wide context.
