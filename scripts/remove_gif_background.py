#!/usr/bin/env python3
"""
Remove flat studio background (+ soft shadow) from public/gizgizi.gif.
Requires: python3 -m venv .venv-gif && .venv-gif/bin/pip install Pillow numpy
"""
from __future__ import annotations

import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "gizgizi.gif"
DST = ROOT / "public" / "gizgizi.gif"
# Keep backup outside public/ (large file, not served by Next)
BACKUP = ROOT / "scripts" / "gizgizi-opaque-original.gif"

# Two dominant corner tones from the asset (dithered GIF)
BG_REFS = np.array(
    [[192, 182, 172], [227, 215, 194], [210, 198, 180]],
    dtype=np.float32,
)


def rgba_frame(rgb: np.ndarray) -> np.ndarray:
    """rgb uint8 HxWx3 -> rgba uint8, transparent where background/shadow."""
    f = rgb.astype(np.float32)
    r, g, b = f[..., 0], f[..., 1], f[..., 2]

    # Distance to nearest studio background swatch
    d = np.linalg.norm(f[..., None, :] - BG_REFS[None, None, :, :], axis=-1)
    dist_bg = d.min(axis=-1)

    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = mx - mn
    lum = 0.299 * r + 0.587 * g + 0.114 * b

    # Flat backdrop + dither around the two grays
    key_bg = dist_bg < 38.0

    # Soft shadow on the table: gray, low saturation, not as dark as clay
    key_shadow = (
        (sat < 34.0)
        & (lum > 90.0)
        & (lum < 198.0)
        & (mn > 62.0)
    )

    transparent = key_bg | key_shadow
    alpha = np.where(transparent, 0, 255).astype(np.uint8)
    return np.dstack([rgb, alpha])


def main() -> int:
    if not SRC.exists():
        print(f"Missing {SRC}", file=sys.stderr)
        return 1

    if not BACKUP.exists():
        shutil.copy2(SRC, BACKUP)
        print(f"Backed up opaque original to {BACKUP.name}")

    im = Image.open(SRC)
    n = im.n_frames
    durations: list[int] = []
    frames_out: list[Image.Image] = []

    for i in range(n):
        im.seek(i)
        durations.append(im.info.get("duration", 40))
        rgb = np.array(im.convert("RGB"))
        rgba = rgba_frame(rgb)
        frames_out.append(Image.fromarray(rgba, "RGBA"))

    # Pillow writes animated GIF transparency from RGBA frames
    frames_out[0].save(
        DST,
        save_all=True,
        append_images=frames_out[1:],
        duration=durations,
        loop=im.info.get("loop", 0),
        disposal=2,
        optimize=True,
    )
    print(f"Wrote {n} frames to {DST.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
