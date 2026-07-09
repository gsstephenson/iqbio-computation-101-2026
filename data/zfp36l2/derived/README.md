# Derived teaching files — reproduced from the deposited data

Everything here is **computed** from the vendored source tables (`../de/`, `../eclip/`,
`../expression_table1.csv`), not hand-entered. The rule for a differentially expressed gene
is the paper's: **|log2FoldChange| > 1 and padj < 0.05** in that tissue's DESeq2 table
(up = log2FC > 1, the genes stabilized when ZFP36L2 is knocked out).

## Files

- `<Tissue>_up_geneids.txt`, `<Tissue>_down_geneids.txt` — per-tissue up/down gene sets (Ensembl gene IDs).
- `up_tissue_overlap.csv` — every up-regulated gene with the number of tissues it's up in, and a 0/1 per tissue.
- `Apol11b_DE_profile.csv` — Apol11b's log2FC/padj across all six tissues (up in every one).

## Reproduced ground-truth (what the autograders check against)

Independently recomputed here from GSE283043 — these match the paper:

| Result | Reproduced | Paper |
|--------|-----------|-------|
| Gene up-regulated in **all six** tissues | **1 — Apol11b** (ENSMUSG00000091694) | 1 — Apol11b |
| Genes up in **≥4** tissues | 16 | 17 * |
| Per-tissue up-regulated genes | Lung 71 · Liver 404 · **BM 1343** · Spleen 573 · Ovary 291 · Kidney 53 | BM/Spleen largest (coding: 1,135 / 430) |
| Per-tissue down-regulated genes | Lung 35 · Liver 247 · BM 846 · Spleen 657 · Ovary 125 · Kidney 41 | — |
| eCLIP peaks (total → significant 3′UTR) | 55,449 → 164 | 2,143 reproducible; 258 at 3′UTRs ** |

\* Off by one: the paper's tissue-overlap count uses a downstream definition (GeneOverlap on the
up-regulated gene set) that differs by a single borderline gene from the direct DE-table recomputation.
The autograders use the **reproduced** number (16) so student code that correctly analyzes the vendored
tables passes; the paper's 17 is noted for context.

\** The eCLIP "2,143 reproducible peaks / 258 at 3′UTRs" come from the paper's replicate-reproducibility
+ HOMER pipeline on the raw data. The vendored table is the deposited ZFP36L2-vs-IgG comparison (all
55,449 peaks); `ZFP36L2_eCLIP_3UTR_peaks.bed` is a teaching subset (significant 3′UTR peaks at
log2FC>1 & −log10(p)>1). For exact paper reproduction, see the raw data under GSE283044.

## Annotation note

The union of DESeq2-tested genes across the six tables is **22,239** — consistent with the confirmed
Ensembl **GRCm38.p6** (release-102) annotation. Because every exercise runs on these deposited tables,
the exact gene models are fixed regardless of which GRCm38.p6 sub-release is used downstream.
