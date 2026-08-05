# Derived teaching files — reproduced from the deposited data

Every **gene set and count** here is computed from the vendored source tables (`../de/`, `../eclip/`,
`../expression_table1.csv`), not hand-entered. The rule for a differentially expressed gene
is the paper's: **|log2FoldChange| > 1 and padj < 0.05** in that tissue's DESeq2 table
(up = log2FC > 1, the genes stabilized when ZFP36L2 is knocked out). Two *annotation* columns are the
exception and come from Ensembl rather than the DE tables — see the note on `multi_tissue_up_symbols.csv`.

## Files

- `<Tissue>_up_geneids.txt`, `<Tissue>_down_geneids.txt` — per-tissue up/down gene sets (Ensembl gene IDs).
- `up_tissue_overlap.csv` — every up-regulated gene with the number of tissues it's up in, and a 0/1 per tissue.
- `Apol11b_DE_profile.csv` — Apol11b's log2FC/padj across all six tissues (up in every one).
- `multi_tissue_up_symbols.csv` — the 16 genes up in ≥4 tissues, with symbol and biotype.
  **Two symbols here are current MGI names rather than the ones in the DE tables:**
  `ENSMUSG00000048489` is `Depp1` here but `8430408G22Rik` in `../de/*.csv`, and `ENSMUSG00000078606`
  is `Gvin2` here but `Gm4070` there. The Ensembl IDs are authoritative and identical either way — if
  you pull symbols from the DE tables you will get the older names, and that is correct. The `biotype`
  column also comes from Ensembl annotation, not from the DE tables.

## Reproduced ground-truth (what the autograders check against)

Independently recomputed here from GSE283043 — these match the paper:

| Result | Reproduced | Paper |
|--------|-----------|-------|
| Gene up-regulated in **all six** tissues | **1 — Apol11b** (ENSMUSG00000091694) | 1 — Apol11b |
| Genes up in **≥4** tissues | 16 | 17 * |
| Per-tissue up-regulated genes | Lung 71 · Liver 404 · **BM 1343** · Spleen 573 · Ovary 291 · Kidney 53 | BM/Spleen largest (coding: 1,135 / 430) |
| Per-tissue down-regulated genes | Lung 35 · Liver 247 · BM 846 · Spleen 657 · Ovary 125 · Kidney 41 | — |
| eCLIP peaks (total → significant 3′UTR) | 55,449 → 164 | 2,143 reproducible; 258 at 3′UTRs ** |

\* Off by one: the paper reports 17; direct recomputation from these deposited DE tables gives 16.
The cause is **not established here**, and the difference should not be read as one disputed gene —
the two analyses do not start from the same gene set. The paper's up-regulated union is 2,583 genes
(paper: "0.04% (1/2,583) of up-regulated genes were found in all tissues"), whereas these six tables
reproduce a union of 2,223. The autograders use the **reproduced** number (16) so student code that
correctly analyzes the vendored tables passes; the paper's 17 is noted for context.

\** The eCLIP "2,143 reproducible peaks / 258 at 3′UTRs" come from the paper's replicate-reproducibility
+ HOMER pipeline on the raw data. The vendored table is the deposited ZFP36L2-vs-IgG comparison (all
55,449 peaks); `ZFP36L2_eCLIP_3UTR_peaks.bed` is a teaching subset (significant 3′UTR peaks at
log2FC>1 & −log10(p)>1). For exact paper reproduction, see the raw data under GSE283044.

## Annotation note

The union of gene IDs that carry an adjusted p-value across the six tables is **22,239**. The union of
*all* rows is **22,455** — the extra 216 were tested by DESeq2 but had `padj` set to `NA` by independent
filtering, so they carry a baseMean, a log2FoldChange and a raw p-value but no adjusted one. (If you take
a plain `set().union()` over the six indexes you will get 22,455, not 22,239.) Both are consistent with the
confirmed Ensembl **GRCm38.p6** (release-102) annotation. Because every exercise runs on these deposited tables,
the exact gene models are fixed regardless of which GRCm38.p6 sub-release is used downstream.
