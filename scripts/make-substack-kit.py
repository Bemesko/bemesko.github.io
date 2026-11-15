"""Render Substack brand assets in the portfolio's chart style.

Usage: python scripts/make-substack-kit.py <font-work-dir>
Writes docs/brand/substack/{logo.png, wordmark.png, cover.png}.
Needs Pillow and fontTools (with brotli) to read the site's woff2 fonts.
"""
import math
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

repo = Path(__file__).resolve().parent.parent
work = Path(sys.argv[1])
out = repo / 'docs/brand/substack'
out.mkdir(parents=True, exist_ok=True)
nm = repo / 'node_modules'

def ttf(src: Path, name: str) -> str:
    dst = work / f'{name}.ttf'
    if not dst.exists():
        f = TTFont(src)
        f.flavor = None
        f.save(dst)
    return str(dst)

grotesk = ttf(nm / '@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2', 'grotesk500')
mono = ttf(nm / '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2', 'mono')

PAPER = (241, 234, 219)
INK = (20, 35, 58)
MUTED = (72, 84, 102)
ACCENT = (31, 86, 168)
SKY = (157, 188, 240)
CONTOUR = (143, 166, 176)

def font(path, size, wght=None):
    f = ImageFont.truetype(path, size)
    if wght is not None:
        try:
            f.set_variation_by_axes([wght])
        except Exception:
            pass
    return f

def waves(d, x0, y0, w, gap, stroke, colours, scale=1.0):
    """The favicon's three waves (M6 11c4-3 8 3 12 0s6-2 8-1), drawn with a round
    brush so the ends and edges stay smooth. Draw on a supersampled canvas."""
    r = stroke / 2
    for i, col in enumerate(colours):
        n = int(w * 2)
        for t in range(n + 1):
            u = t / n
            x = x0 + u * w
            y = y0 + i * gap + scale * (-0.18 * w * math.sin(u * 2 * math.pi * 0.8))
            d.ellipse([x - r, y - r, x + r, y + r], fill=col)


def supersampled(size, bg, k=4):
    """Return (image, draw, k): draw at k times the size, then call finish()."""
    mode = 'RGBA' if len(bg) == 4 else 'RGB'
    img = Image.new(mode, (size[0] * k, size[1] * k), bg)
    return img, ImageDraw.Draw(img), k


def finish(img, size):
    return img.resize(size, Image.LANCZOS)


# 1. logo: the favicon, 1024px square
S = 1024
logo, d, k = supersampled((S, S), INK)
waves(d, 190 * k, 360 * k, 640 * k, 150 * k, 64 * k, [PAPER, SKY, ACCENT], scale=0.55)
finish(logo, (S, S)).save(out / 'logo.png', optimize=True)

# 2. wordmark: transparent, for the publication header
W, H = 1700, 360
wm, d, k = supersampled((W, H), (0, 0, 0, 0))
d.rounded_rectangle([20 * k, 40 * k, 300 * k, 320 * k], radius=56 * k, fill=INK)
waves(d, 70 * k, 130 * k, 180 * k, 50 * k, 20 * k, [PAPER, SKY, ACCENT], scale=0.55)
d.text((350 * k, 76 * k), "Captain DevOps' Notes", font=font(grotesk, 104 * k), fill=INK)
d.text((356 * k, 224 * k), '~/captain-devops', font=font(mono, 60 * k, 600), fill=ACCENT)
finish(wm, (W, H)).save(out / 'wordmark.png', optimize=True)

# 3. cover / social image, 1200x630, matching the portfolio's share card
W, H = 1200, 630
cv, d, k = supersampled((W, H), PAPER, k=2)
for j in range(6):
    pts = [(x * k, (470 + j * 26 + 28 * math.sin(x / 150 + j * 0.6) + 12 * math.sin(x / 63 + j)) * k) for x in range(0, W + 20, 8)]
    d.line(pts, fill=CONTOUR, width=k)
d.rectangle([0, 0, 56 * k, H * k], fill=INK)
for i, y in enumerate(range(70, H - 30, 22)):
    d.line([((56 - (18 if i % 5 == 0 else 8)) * k, y * k), (56 * k, y * k)], fill=(198, 207, 220), width=k)
d.rounded_rectangle([104 * k, 96 * k, 224 * k, 216 * k], radius=24 * k, fill=INK)
waves(d, 126 * k, 136 * k, 76 * k, 22 * k, 9 * k, [PAPER, SKY, ACCENT], scale=0.55)
d.text((104 * k, 250 * k), "Captain DevOps' Notes", font=font(grotesk, 72 * k), fill=INK)
d.text((104 * k, 350 * k), 'A byte-sized blog about learning,', font=font(grotesk, 40 * k), fill=ACCENT)
d.text((104 * k, 400 * k), 'DevOps and tech shenanigans.', font=font(grotesk, 40 * k), fill=ACCENT)
d.text((104 * k, 500 * k), 'by Bernardo Mesko · bemesko.github.io', font=font(mono, 22 * k, 500), fill=MUTED)
finish(cv, (W, H)).save(out / 'cover.png', optimize=True)
print('wrote', sorted(p.name for p in out.iterdir()))
