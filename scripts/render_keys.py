#!/usr/bin/env python3
"""Regenerate keys.html from the local *-KEY.ipynb notebooks.

The KEY notebooks are gitignored (never commit answer keys in plaintext); this script renders
them to HTML, encrypts the HTML with a passphrase, and splices the ciphertext into keys.html,
whose in-browser JS (WebCrypto: PBKDF2-SHA256 x 600k -> AES-256-GCM) decrypts it on unlock.

Usage:  python3 scripts/render_keys.py            (passphrase from KEYS_PASSPHRASE env)
        python3 scripts/render_keys.py --ask      (prompted, hidden)

The passphrase is never stored. Run from the repo root. Requires: cryptography, markdown (pip install cryptography markdown).
"""
import json, glob, html, io, os, re, sys, base64, difflib, getpass, datetime
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
try:
    import markdown as _md
    def md2html(t): return _md.markdown(t, extensions=['tables', 'fenced_code'])
except ImportError:                                   # fallback: escaped, monospace
    def md2html(t): return '<pre class="mdraw">' + esc(t) + '</pre>'

ITER = 600_000
esc  = html.escape
BLANK = re.compile(r'(?<![.\w])\.\.\.(?![.\w])')

def cells(path):
    return json.load(open(path, encoding='utf-8'))['cells']

def src(c): return ''.join(c['source'])

def blank_table(level):
    """Blank-by-blank answers: student line -> KEY line, matched by content similarity."""
    stu = cells(f'notebooks/workshop3/{level}.ipynb')
    key = cells(f'notebooks/workshop3/{level}-KEY.ipynb')
    kcode = [src(c) for c in key if c['cell_type'] == 'code']
    out, n = [], 0
    for c in stu:
        if c['cell_type'] != 'code' or not BLANK.search(src(c)): continue
        n += 1
        s = src(c)
        k = max(kcode, key=lambda x: difflib.SequenceMatcher(None, BLANK.sub('', s), BLANK.sub('', x)).ratio())
        ident = esc(s.strip().split('\n')[0][:100])
        rows = []
        for sl in (l for l in s.split('\n') if BLANK.search(l)):
            m = difflib.get_close_matches(sl, k.split('\n'), n=1, cutoff=0.25)
            ans = m[0].strip() if m else '(see full notebook below)'
            rows.append(f'<tr><td><code>{esc(sl.strip())}</code></td><td><code class="ans">{esc(ans)}</code></td></tr>')
        notes = [l.replace('# KEY:','').strip() for l in k.split('\n') if l.strip().startswith('# KEY:')]
        note = f'<p class="out">{esc(" | ".join(notes))}</p>' if notes else ''
        out.append(f'<div class="bk"><p class="bh">blank {n} · <b>{ident}</b></p>'
                   f'<table><tr><th>student sees</th><th>answer</th></tr>{"".join(rows)}</table>{note}</div>')
    return ''.join(out) or '<p class="muted">No fill-in blanks in this notebook.</p>'

def code_html(body):
    """Dark code block; instructor `# KEY:` notes get the green expected-output style."""
    lines = []
    for l in body.split('\n'):
        e = esc(l)
        lines.append(f'<span class="keyline">{e}</span>' if l.strip().startswith('# KEY:') else e)
    return '<pre>' + '\n'.join(lines) + '</pre>'

def full_listing(path):
    parts = []
    for c in cells(path):
        body = src(c).rstrip()
        if not body: continue
        if c['cell_type'] == 'markdown':
            parts.append(f'<div class="mdc">{md2html(body)}</div>')
        else:
            parts.append(code_html(body))
    return ''.join(parts)

def build_html():
    today = datetime.date.today().isoformat()
    P = [f'<h1>Instructor Keys — Computation 101</h1>',
         f'<p class="muted">Regenerated {today} from the current KEY notebooks. Blank-by-blank answers first; the full completed notebook is under each fold.</p>',
         '<div class="nums">The funnel every W3 student lands on: <b>16,973</b> tested → <b>6,881</b> at raw p&lt;0.05 (~<b>849</b> luck) → <b>5,547</b> after Benjamini-Hochberg → <b>1,343</b> with log2FC&gt;1. One gene up in all six tissues: <b>Apol11b</b> (ENSMUSG00000091694) from a <b>2,223</b>-gene union.</div>']
    for lvl in ['beginner', 'intermediate', 'advanced', 'expert']:
        P.append(f'<h2>Workshop 3 · {lvl}</h2>')
        P.append(blank_table(lvl))
        P.append(f'<details><summary>full {lvl}-KEY notebook — every cell, answers filled</summary>{full_listing(f"notebooks/workshop3/{lvl}-KEY.ipynb")}</details>')
    w4 = sorted(glob.glob('notebooks/workshop4/*-KEY.ipynb'))
    if w4:
        P.append('<h2>Workshop 4 (parked — not run in 2026)</h2>'
                 '<p class="muted">Kept for a future cohort; the workshop page is archived and unlinked.</p>')
        for p in w4:
            name = os.path.basename(p).replace('-KEY.ipynb', '')
            P.append(f'<details><summary>{name}-KEY</summary>{full_listing(p)}</details>')
    P.append('''<style>
      .content h2{background:#15181d;color:#CFB87C;padding:.45rem .8rem;border-radius:8px;margin-top:2rem}
      .content .bk{background:#fff;border:1px solid #e5e2d9;border-radius:9px;margin:.7rem 0;padding:.6rem .8rem}
      .content .bh{font-family:var(--mono);font-size:.74rem;color:#5b6068;margin-bottom:.4rem}
      .content table{width:100%;border-collapse:collapse;font-size:.82rem}
      .content th{text-align:left;font-family:var(--mono);font-size:.64rem;text-transform:uppercase;color:#8a8f98;padding:.2rem .4rem}
      .content td{padding:.25rem .4rem;border-top:1px solid #f0ede3;vertical-align:top;width:50%}
      .content code{font-family:var(--mono);font-size:.78rem;background:#0d1117;color:#c9d1d9;padding:.1rem .35rem;border-radius:4px;display:inline-block}
      .content code.ans{background:#0d3a1a;color:#7ee787;font-weight:700}
      .content .out{font-family:var(--mono);font-size:.72rem;color:#1a7f37;margin:.3rem 0 0}
      .content .nums{background:#15181d;color:#e6edf3;border-radius:9px;padding:.8rem 1rem;margin:.8rem 0;font-size:.9rem}
      .content .nums b{color:#CFB87C}
      .content .muted{color:#5b6068;font-size:.85rem}
      .content details{margin:.6rem 0;border:1px solid #e5e2d9;border-radius:8px;padding:.5rem .8rem;background:#fcfbf7}
      .content summary{cursor:pointer;font-family:var(--mono);font-size:.78rem;color:#a8925a}
      .content .mdc{background:#fff;border:1px solid #e5e2d9;border-left:3px solid #CFB87C;border-radius:6px;padding:.55rem .9rem;margin:.55rem 0;font-size:.88rem;line-height:1.55}
      .content .mdc h1,.content .mdc h2,.content .mdc h3{background:none;color:#15181d;padding:0;margin:.3rem 0 .4rem;font-size:1.02rem;border-bottom:2px solid #CFB87C;display:inline-block}
      .content .mdc p{margin:.35rem 0}
      .content .mdc ul,.content .mdc ol{margin:.3rem 0 .3rem 1.2rem}
      .content .mdc li{margin:.15rem 0}
      .content .mdc table{margin:.4rem 0}
      .content .mdc td,.content .mdc th{width:auto}
      .content .mdc code{background:#f0ede3;color:#7a4a00;font-weight:600}
      .content .mdc pre code{background:none;color:inherit;font-weight:400;padding:0}
      .content .mdc pre{background:#0d1117;color:#c9d1d9;padding:.5rem .7rem;border-radius:6px;overflow-x:auto;font-size:.76rem}
      .content .mdc blockquote{border-left:3px solid #c07a2a;margin:.4rem 0;padding:.2rem .8rem;background:#fff8ec;border-radius:4px}
      .content pre{background:#0d1117;color:#c9d1d9;padding:.6rem .8rem;border-radius:6px;overflow-x:auto;font-size:.76rem;line-height:1.45}
      .content pre .keyline{color:#7ee787;font-weight:700;display:inline-block;background:rgba(63,185,80,.12);border-radius:3px}
      .content details summary{font-size:.85rem;padding:.2rem 0}
    </style>''')
    return ''.join(P)

def encrypt(plaintext, passphrase):
    salt, iv = os.urandom(16), os.urandom(12)
    key = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=ITER).derive(passphrase.encode())
    ct = AESGCM(key).encrypt(iv, plaintext.encode(), None)   # tag appended — WebCrypto-compatible
    b64 = lambda b: base64.b64encode(b).decode()
    return {'v': 1, 'kdf': 'PBKDF2', 'hash': 'SHA-256', 'iter': ITER,
            'salt': b64(salt), 'iv': b64(iv), 'ct': b64(ct)}

def main():
    pw = getpass.getpass('passphrase: ') if '--ask' in sys.argv else os.environ.get('KEYS_PASSPHRASE')
    if not pw: sys.exit('set KEYS_PASSPHRASE or use --ask')
    if not glob.glob('notebooks/workshop3/*-KEY.ipynb'):
        sys.exit('no KEY notebooks found — run from the repo root on the machine that has them')
    bundle = encrypt(build_html(), pw)
    page = io.open('keys.html', encoding='utf-8').read()
    new, n = re.subn(r'const BUNDLE = \{.*?\};', 'const BUNDLE = ' + json.dumps(bundle) + ';', page, count=1, flags=re.S)
    if n != 1: sys.exit('BUNDLE not found in keys.html')
    io.open('keys.html', 'w', encoding='utf-8').write(new)
    print(f'keys.html regenerated: {len(bundle["ct"])} b64 chars of ciphertext, {ITER} PBKDF2 iterations')

if __name__ == '__main__':
    main()
