#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# fetch_reference.sh — get the mouse reference genome + annotation for the
# ZFP36L2 analysis.  ** This is a Workshop 4 advanced activity, not a black box. **
#
# We deliberately do NOT commit the genome (~800 MB) or the GTF (~1 GB unzipped)
# to the repo. A reference genome is canonical at its source — re-hosting it is
# wasteful and non-reproducible. Learning to FIND and PULL it from Ensembl is a
# core bioinformatics skill, so here's the guided version.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── The exact reference (confirmed by the first author) ───────────────────────
#  Assembly: GRCm38.p6  =  GenBank GCA_000001635.8  =  RefSeq GCF_000001635.26.
#  On Ensembl, GRCm38.p6 is served by release-102 (the FINAL GRCm38 release;
#  release-103+ switched to GRCm39). Verified against Ensembl's own assembly
#  README: release-102 mouse == GCA_000001635.8.  So we pin release-102.
#
# ── The detective work (why these choices — teach yourself the skill) ─────────
#  1. https://www.ensembl.org → Mouse → "Download DNA sequence (FASTA)".
#  2. Match the ASSEMBLY, not just "mouse": GRCm38.p6, not GRCm39. The last
#     Ensembl release still on GRCm38(.p6) is 102 — that's why we pin it.
#  3. The whole genome is the "primary_assembly" file — NOT the per-chromosome
#     files, and NOT "toplevel" (which adds haplotypes/patches you don't want here).
#  4. Right-click the .fa.gz link → "Copy link address" → that's your wget target.
#  Confirm live:  https://ftp.ensembl.org/pub/release-102/fasta/mus_musculus/dna/
#                 https://ftp.ensembl.org/pub/release-102/gtf/mus_musculus/

ENSEMBL_RELEASE=102          # GRCm38.p6 (GCA_000001635.8). 103+ = GRCm39 — do NOT use.
BASE="https://ftp.ensembl.org/pub/release-${ENSEMBL_RELEASE}"
OUT="${1:-./reference}"      # where to drop the files (default ./reference)
mkdir -p "$OUT"

GENOME="Mus_musculus.GRCm38.dna.primary_assembly.fa.gz"
GTF="Mus_musculus.GRCm38.${ENSEMBL_RELEASE}.gtf.gz"

echo "Fetching GRCm38 reference genome (~800 MB) → $OUT/$GENOME"
wget -c -P "$OUT" "${BASE}/fasta/mus_musculus/dna/${GENOME}"

echo "Fetching GRCm38 gene annotation (GTF) → $OUT/$GTF"
wget -c -P "$OUT" "${BASE}/gtf/mus_musculus/${GTF}"

echo
echo "Done. Unzip when ready:  gunzip $OUT/*.gz"
echo "Sanity check the genome:  zcat $OUT/$GENOME | head -1     # should read '>1 dna:primary_assembly ...'"
echo
echo "These map ENSMUSG… IDs (used in the DE tables) to gene symbols and coordinates,"
echo "which is what the STAR → featureCounts → DESeq2 pipeline in the paper used."
