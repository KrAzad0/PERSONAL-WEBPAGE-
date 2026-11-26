"""Regenerate the portfolio's mathematical SVG illustrations.

The torus is an orthographic projection of its standard parametrization.
The orbital is a section through the analytic hydrogen 2p_z density, with
coordinates measured in Bohr radii. Neither image represents numerical
results from a research project. Runtime site dependencies: none.
"""

from pathlib import Path
from math import cos, sin, pi

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
ASSETS.mkdir(exist_ok=True)


def make_torus():
    R, r = 2.18, 0.73
    elevation, azimuth, tilt = 0.63, 0.43, -0.17
    ce, se = cos(elevation), sin(elevation)
    ca, sa = cos(azimuth), sin(azimuth)
    ct, st = cos(tilt), sin(tilt)

    def project(u, v):
        x, y, z = (R + r * cos(v)) * cos(u), (R + r * cos(v)) * sin(u), r * sin(v)
        sx, sy = ca * x - sa * y, -se * (sa * x + ca * y) + ce * z
        # SVG has downward-positive y; retain a right-handed geometric view.
        px, py = ct * sx - st * sy, st * sx + ct * sy
        n_dot_eye = ce * (sa * cos(v) * cos(u) + ca * cos(v) * sin(u)) + se * sin(v)
        return (250 + 76 * px, 215 - 76 * py, n_dot_eye >= 0)

    curves = []
    for i in range(36):
        u = 2 * pi * i / 36
        curves.append(([project(u, 2 * pi * j / 120) for j in range(121)], i in (4, 22), False))
    for i in range(18):
        v = 2 * pi * i / 18
        curves.append(([project(2 * pi * j / 180, v) for j in range(181)], False, i in (0, 9)))

    paths = {False: [], True: []}
    for points, copper, equator in curves:
        segments, run = [], [points[0]]
        facing = points[0][2]
        for point in points[1:]:
            run.append(point)
            if point[2] != facing:
                segments.append((facing, run))
                facing, run = point[2], [point]
        if len(run) > 1:
            segments.append((facing, run))
        for front, run in segments:
            d = "M" + "L".join(f"{p[0]:.2f},{p[1]:.2f}" for p in run)
            stroke = "#a66b49" if copper else "#365c7d"
            width = "1.3" if copper else ("0.95" if equator else "0.65")
            opacity = ".86" if copper else (".77" if equator else ".65")
            if not front:
                opacity = ".28" if copper else ".18"
            paths[front].append(f'<path d="{d}" stroke="{stroke}" stroke-width="{width}" opacity="{opacity}"/>')

    svg = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 430" role="img" aria-labelledby="torus-title torus-desc">',
           '<title id="torus-title">Toroidal geometry</title>',
           '<desc id="torus-desc">A schematic wireframe of a circular torus in orthographic projection. Blue curves follow the two angular coordinates; copper meridians emphasize the tube geometry. This is a mathematical illustration, not a research result.</desc>',
           '<g fill="none" stroke-linejoin="round" stroke-linecap="round">',
           *paths[False], *paths[True], '</g></svg>']
    (ASSETS / "toroidal-geometry.svg").write_text("\n".join(svg), encoding="utf-8")


def make_orbital():
    # Matplotlib is needed only when regenerating this optional illustration.
    import numpy as np
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    x = np.linspace(-11, 11, 600)
    z = np.linspace(-11, 11, 600)
    X, Z = np.meshgrid(x, z)
    radius = np.sqrt(X * X + Z * Z)
    density = Z * Z * np.exp(-radius) / (32 * np.pi)
    peak = 4 * np.exp(-2) / (32 * np.pi)
    levels = peak * np.array([0.01, 0.025, 0.055, 0.11, 0.20, 0.34, 0.50, 0.68, 0.84, 0.95])
    fig, ax = plt.subplots()
    contour = ax.contour(X, Z, density, levels=levels)
    paths = []
    for level_index, level_segments in enumerate(contour.allsegs):
        for segment in level_segments:
            if len(segment) < 3:
                continue
            # Simplify with subsampling only; contour geometry stays analytic.
            segment = segment[::2]
            d = "M" + "L".join(f"{200 + p[0] * 17.8:.2f},{200 - p[1] * 17.8:.2f}" for p in segment) + "Z"
            opacity = 0.24 + 0.06 * level_index
            paths.append(f'<path d="{d}" opacity="{opacity:.2f}"/>')
    plt.close(fig)
    svg = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-labelledby="orbital-title orbital-desc">',
           '<title id="orbital-title">Hydrogen 2p_z probability density</title>',
           '<desc id="orbital-desc">Contours of the analytic hydrogen 2p_z probability density in the x-z plane, in Bohr-radius coordinates. The horizontal plane is a node. These contours are an illustration of the exact nonrelativistic wavefunction, not measured data.</desc>',
           '<path d="M35,200H365" stroke="#9baebd" stroke-width=".7" stroke-dasharray="3 5" opacity=".45"/>',
           '<g fill="none" stroke="#365c7d" stroke-width="1.1" stroke-linejoin="round">',
           *paths, '</g></svg>']
    (ASSETS / "hydrogen-orbital.svg").write_text("\n".join(svg), encoding="utf-8")


if __name__ == "__main__":
    make_torus()
    make_orbital()
    for name in ("toroidal-geometry.svg", "hydrogen-orbital.svg"):
        print(name, (ASSETS / name).stat().st_size, "bytes")
