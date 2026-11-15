"""Render the 1200x630 social share card in the site's chart style."""
import math
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

repo = Path(sys.argv[1])
work = Path(sys.argv[2])
out = Path(sys.argv[3])
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
serif = ttf(nm / '@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2', 'serif')

PAPER = (241, 234, 219)
INK = (20, 35, 58)
INK_SOFT = (43, 58, 82)
MUTED = (72, 84, 102)
ACCENT = (31, 86, 168)
SKY = (157, 188, 240)
CONTOUR = (143, 166, 176)
ONINK_MUTED = (198, 207, 220)

W, H = 1200, 630
S = 2  # supersample
img = Image.new('RGB', (W * S, H * S), PAPER)
d = ImageDraw.Draw(img)

def font(path, size, wght=None):
    f = ImageFont.truetype(path, size * S)
    if wght is not None:
        try:
            f.set_variation_by_axes([wght])
        except Exception:
            pass
    return f

# contour lines, like the chart bands
for k in range(6):
    pts = []
    for x in range(0, W + 20, 8):
        y = 470 + k * 26 + 28 * math.sin(x / 150 + k * 0.6) + 12 * math.sin(x / 63 + k)
        pts.append((x * S, y * S))
    d.line(pts, fill=CONTOUR, width=S)

# depth gauge strip on the left
GW = 56
d.rectangle([0, 0, GW * S, H * S], fill=INK)
for i, y in enumerate(range(70, H - 30, 22)):
    major = i % 5 == 0
    d.line([((GW - (18 if major else 8)) * S, y * S), (GW * S, y * S)], fill=ONINK_MUTED, width=S)
d.line([(3 * S, 70 * S), (3 * S, 300 * S)], fill=SKY, width=3 * S)
d.text((12 * S, 30 * S), 'DEPTH', font=font(mono, 11, 500), fill=ONINK_MUTED)

L = 104
# brand and site address
d.text((L * S, 56 * S), '~/captain-devops', font=font(mono, 22, 600), fill=ACCENT)
d.text((L * S, 92 * S), 'Bernardo Mesko · Platform Engineer', font=font(mono, 19, 400), fill=MUTED)

# headline: plain part in ink, second part in cobalt italic (sheared)
title_font = font(grotesk, 52)
lines_plain = ['I build the boring parts', 'of shipping software,']
lines_accent = ['so teams can spend their', 'time on the fun ones.']
y = 160
lh = 60
for ln in lines_plain:
    d.text((L * S, y * S), ln, font=title_font, fill=INK)
    y += lh

# accent lines: each on its own layer, sheared around its baseline so the
# left edges stay aligned with the lines above
shear = 0.2
for ln in lines_accent:
    lay_h = lh + 10
    layer = Image.new('RGBA', (W * S, lay_h * S), (0, 0, 0, 0))
    ImageDraw.Draw(layer).text((L * S, 4 * S), ln, font=title_font, fill=ACCENT + (255,))
    base = (4 + 46) * S
    layer = layer.transform(layer.size, Image.AFFINE, (1, shear, -shear * base, 0, 1, 0), resample=Image.BICUBIC)
    img.paste(layer, (0, (y - 4) * S), layer)
    y += lh
y += 20

d.text((L * S, (y + 8) * S), 'bemesko.github.io', font=font(mono, 22, 500), fill=INK_SOFT)

# portrait, duotone square with a double frame like the site's boxes
P = 300
px, py = W - P - 70, 120
photo = Image.open(repo / 'src/assets/captain-helm.jpg').convert('RGB')
w, h = photo.size
side = min(w, h)
top = int((h - side) * 0.15)
photo = photo.crop(((w - side) // 2, top, (w - side) // 2 + side, top + side)).resize((P * S, P * S), Image.LANCZOS)
img.paste(photo, (px * S, py * S))
d.rectangle([px * S, py * S, (px + P) * S, (py + P) * S], outline=INK, width=S)
pad = 12
d.rectangle([(px - pad) * S, (py - pad) * S, (px + P + pad) * S, (py + P + pad) * S], outline=INK, width=S)
d.rectangle([(px - pad - 5) * S, (py - pad - 5) * S, (px + P + pad + 5) * S, (py + P + pad + 5) * S], outline=INK, width=1)
d.text((px * S, (py + P + pad + 18) * S), 'fig. 1 · at the helm', font=font(mono, 15, 400), fill=MUTED)

img = img.resize((W, H), Image.LANCZOS)
out.parent.mkdir(parents=True, exist_ok=True)
img.save(out, optimize=True)
print(out, img.size)
