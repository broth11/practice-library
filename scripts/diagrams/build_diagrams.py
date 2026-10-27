"""Render every figure in src/diagrams/*.json to src/assets/diagrams/ in AP print style.

AP style follows the archetype library's style_guide rule S14: grayscale fills,
black lines, a bold title above when present, axis titles on both axes of a
chart, a boxed legend for several series, and relative-frequency axes in one
form only. Density curves follow AP convention and carry no vertical axis.

Output is deterministic for a pinned matplotlib version (see requirements.txt):
text is drawn as paths, the SVG hash salt is fixed, and the date metadata is
removed. Run:  python3 scripts/diagrams/build_diagrams.py [--check]
--check renders into memory and fails if any committed SVG differs.
"""
from __future__ import annotations

import io
import json
import math
import sys
from pathlib import Path
from statistics import NormalDist

import matplotlib

matplotlib.use("svg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Circle, Patch, Rectangle  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
SPECS = ROOT / "src" / "diagrams"
OUT = ROOT / "src" / "assets" / "diagrams"

INK = "#000000"
DARK = "#595959"     # highlighted bars, first segment
LIGHT = "#d9d9d9"    # unhighlighted bars, second segment, shaded areas
GRID = "#c8c8c8"
WIDE = (6.0, 2.62)   # the 480 x 210 figure slot used by the app

plt.rcParams.update({
    "svg.fonttype": "path",
    "svg.hashsalt": "practice-library",
    "font.family": "DejaVu Sans",
    "font.size": 9.5,
    "mathtext.fontset": "dejavusans",
    "axes.edgecolor": INK,
    "axes.linewidth": 0.9,
    "axes.titleweight": "bold",
    "axes.titlesize": 10.5,
    "xtick.color": INK,
    "ytick.color": INK,
    "lines.solid_capstyle": "butt",
})


def tex(label: str) -> str:
    """Route the few symbols the content uses through mathtext."""
    return (str(label).replace("x̄", r"$\bar{x}$").replace("μ", r"$\mu$").replace("σ", r"$\sigma$"))


def number(value: float) -> str:
    text = f"{value:.6f}".rstrip("0").rstrip(".")
    return text.replace("-", "−")


def finish(fig) -> bytes:
    buffer = io.StringIO()
    fig.savefig(buffer, format="svg", metadata={"Date": None, "Creator": None}, bbox_inches="tight", pad_inches=0.06)
    plt.close(fig)
    return buffer.getvalue().encode("utf-8")


def bars_axes(ax, x_label: str, y_label: str):
    ax.set_xlabel(tex(x_label))
    ax.set_ylabel(tex(y_label))
    ax.spines[["top", "right"]].set_visible(False)
    ax.yaxis.grid(True, color=GRID, linewidth=0.6)
    ax.set_axisbelow(True)


def probability_bars(spec: dict, values: list, probs: list, highlight, x_label: str) -> bytes:
    fig, ax = plt.subplots(figsize=WIDE)
    top = max(probs) * (1.22 if spec.get("printValues") else 1.12)
    for value, prob in zip(values, probs):
        selected = highlight is not None and highlight[0] <= value <= highlight[1]
        ax.bar(value, prob, width=0.7, color=DARK if selected else LIGHT, edgecolor=INK, linewidth=0.7)
        if spec.get("printValues"):
            ax.text(value, prob + top * 0.025, f"{prob:.2f}", ha="center", va="bottom", fontsize=9)
    ax.set_ylim(0, top)
    ax.set_xticks(values)
    ax.set_xlim(min(values) - 0.6, max(values) + 0.6)
    ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"{v:.2f}" if top >= 0.1 else f"{v:.3f}"))
    ax.yaxis.set_major_locator(matplotlib.ticker.MaxNLocator(4))
    bars_axes(ax, x_label, spec.get("yLabel", "Probability"))
    return finish(fig)


def discrete_bars(spec):
    return probability_bars(spec, spec["values"], spec["probs"], spec.get("highlight"), spec["xLabel"])


def binomial_bars(spec):
    n, p = spec["n"], spec["p"]
    values = list(range(n + 1))
    probs = [math.comb(n, k) * p ** k * (1 - p) ** (n - k) for k in values]
    return probability_bars(spec, values, probs, spec.get("highlight"), spec.get("xLabel", "Number of successes, x"))


def resolve_normal(spec):
    mu, sd = spec["mu"], spec["sd"]
    if isinstance(mu, dict):
        anchor = mu["solveFrom"]
        mu = anchor["value"] - NormalDist().inv_cdf(anchor["percentile"]) * sd
    if isinstance(sd, dict):
        anchor = sd["solveFrom"]
        sd = (anchor["value"] - mu) / NormalDist().inv_cdf(anchor["percentile"])
    bound = lambda b: NormalDist(mu, sd).inv_cdf(b["percentile"]) if isinstance(b, dict) else b  # noqa: E731
    return mu, sd, bound(spec.get("lo")), bound(spec.get("hi"))


def normal(spec):
    mu, sd, lo, hi = resolve_normal(spec)
    dist = NormalDist(mu, sd)
    xs = [mu + sd * (-3.7 + 7.4 * i / 400) for i in range(401)]
    ys = [dist.pdf(x) for x in xs]
    fig, ax = plt.subplots(figsize=WIDE)
    inside = lambda x: (lo is None or x >= lo) and (hi is None or x <= hi)  # noqa: E731
    mask = [(not inside(x)) if spec.get("outside") else inside(x) for x in xs]
    ax.fill_between(xs, ys, where=mask, color=LIGHT, linewidth=0, interpolate=True)
    ax.plot(xs, ys, color=INK, linewidth=1.6)
    peak = dist.pdf(mu)
    ticks, labels = [mu], [tex(spec.get("meanLabel") or f"μ = {number(mu)}")]
    for mark in spec.get("marks", []):
        if not isinstance(mark, dict):
            mark = {"value": mark, "label": number(mark)}
        value = mark.get("value", {"lo": lo, "hi": hi}.get(mark.get("at")))
        if abs(value - mu) > 1e-9:
            ticks.append(value)
            labels.append(tex(mark["label"]))
    for value in ticks[1:]:
        ax.plot([value, value], [0, dist.pdf(value)], color=INK, linewidth=0.8)
    ax.set_xticks(ticks, labels)
    ax.set_yticks([])
    ax.spines[["left", "top", "right"]].set_visible(False)
    ax.set_xlim(xs[0], xs[-1])
    ax.set_ylim(0, peak * 1.25)
    ax.set_xlabel(tex(spec["xLabel"]))
    if spec.get("area"):
        ax.set_title(tex(spec["area"]))
    if spec.get("showSd", True):
        ax.text(0.98, 0.9, tex(f"σ = {number(sd)}"), transform=ax.transAxes, ha="right", va="top")
    return finish(fig)


def normal_comparison(spec):
    fig, ax = plt.subplots(figsize=WIDE)
    lo, hi = spec["xRange"]
    xs = [lo + (hi - lo) * i / 400 for i in range(401)]
    for curve in spec["curves"]:
        dist = NormalDist(spec["mu"], curve["sd"])
        ax.plot(xs, [dist.pdf(x) for x in xs], color=INK, linewidth=1.6, linestyle=curve["style"],
                label=tex(f"{curve['name']}: σ = {number(curve['sd'])}"))
    ax.set_xticks([spec["mu"]], [number(spec["mu"])])
    ax.set_yticks([])
    ax.spines[["left", "top", "right"]].set_visible(False)
    ax.set_xlim(lo, hi)
    ax.set_ylim(0, NormalDist(spec["mu"], min(c["sd"] for c in spec["curves"])).pdf(spec["mu"]) * 1.12)
    ax.set_xlabel(tex(spec["xLabel"]))
    ax.legend(loc="upper right", frameon=True, fancybox=False, edgecolor=INK, handlelength=2.6)
    return finish(fig)


def frequency_histogram(spec):
    fig, ax = plt.subplots(figsize=WIDE)
    start, width, counts = spec["start"], spec["width"], spec["counts"]
    top = max(counts) * 1.15
    for i, count in enumerate(counts):
        left = start + i * width
        selected = left >= spec["highlightFrom"] - 1e-9
        ax.bar(left, count, width=width, align="edge", color=DARK if selected else LIGHT, edgecolor=INK, linewidth=0.7)
        if spec.get("printCounts"):
            ax.text(left + width / 2, count + top * 0.02, str(count), ha="center", va="bottom", fontsize=spec.get("fontSize", 9))
    edges = [round(start + i * width, 6) for i in range(len(counts) + 1)]
    ax.set_xticks(edges, [f"{e:.1f}" for e in edges])
    ax.set_xlim(edges[0], edges[-1])
    ax.set_ylim(0, top)
    bars_axes(ax, spec["xLabel"], spec["yLabel"])
    if spec.get("fontSize"):
        ax.tick_params(labelsize=spec["fontSize"])
        ax.xaxis.label.set_size(spec["fontSize"])
        ax.yaxis.label.set_size(spec["fontSize"])
    return finish(fig)


def relative_frequency_bars(spec):
    fig, ax = plt.subplots(figsize=WIDE)
    shares = [c / spec["trials"] for c in spec["counts"]]
    for category, share in zip(spec["categories"], shares):
        ax.bar(category, share, width=1.0, color=LIGHT, edgecolor=INK, linewidth=0.7)
        ax.text(category, share + 0.012, f"{share:.3f}", ha="center", va="bottom", fontsize=9)
    ax.set_xticks(spec["categories"])
    ax.set_xlim(min(spec["categories"]) - 0.5, max(spec["categories"]) + 0.5)
    ax.set_ylim(0, 0.5)
    ax.set_yticks([i / 10 for i in range(6)], [f"{i / 10:.1f}" for i in range(6)])
    bars_axes(ax, spec["xLabel"], spec["yLabel"])
    return finish(fig)


def dotplot(spec):
    fig, ax = plt.subplots(figsize=(6.0, 2.1))
    seen: dict = {}
    for value in spec["values"]:
        level = seen.get(value, 0)
        seen[value] = level + 1
        selected = value >= spec["highlightMin"]
        ax.add_patch(Circle((value, 0.28 + level * 0.36), 0.14, facecolor=DARK if selected else "white", edgecolor=INK, linewidth=1))
    low, high = min(spec["values"]), max(spec["values"])
    ax.set_xlim(low - 0.6, high + 0.6)
    ax.set_ylim(0, 0.28 + max(seen.values()) * 0.36 + 0.1)
    ax.set_aspect("equal")
    ax.set_xticks(range(low, high + 1))
    ax.set_yticks([])
    ax.spines[["left", "top", "right"]].set_visible(False)
    ax.set_xlabel(tex(spec["xLabel"]))
    if spec.get("fontSize"):
        ax.tick_params(labelsize=spec["fontSize"])
        ax.xaxis.label.set_size(spec["fontSize"])
    if spec.get("title"):
        ax.set_title(spec["title"])
    return finish(fig)


def categorical_bars(spec):
    fig, ax = plt.subplots(figsize=WIDE)
    bars = ax.bar(spec["categories"], spec["values"], color=LIGHT, edgecolor=INK, linewidth=0.8)
    step = spec.get("tickStep", 5)
    top = math.ceil((max(spec["values"]) + step) / step) * step
    ax.set_ylim(0, top)
    ax.set_yticks(range(0, top + 1, step))
    if spec.get("printValues"):
        ax.bar_label(bars, padding=3, fontsize=9)
    bars_axes(ax, spec["xLabel"], spec["yLabel"])
    return finish(fig)


def categorical_pie(spec):
    fig, ax = plt.subplots(figsize=(6.0, 3.1))
    colors = ["#dddddd", "#999999", "#eeeeee", "#666666", "#bbbbbb"]
    wedges, _, _ = ax.pie(spec["values"], autopct="%1.0f%%", colors=colors[:len(spec["values"])],
                          startangle=90, wedgeprops={"edgecolor": INK, "linewidth": 0.8},
                          textprops={"color": INK, "fontsize": 13})
    ax.legend(wedges, spec["categories"], loc="center left", bbox_to_anchor=(1, 0.5),
              frameon=True, fancybox=False, edgecolor=INK, fontsize=12)
    ax.set_aspect("equal")
    return finish(fig)


def summary_boxplots(spec):
    fig, ax = plt.subplots(figsize=(6.0, 2.35 if len(spec["groups"]) > 1 else 1.9))
    groups = spec["groups"]
    stats = [{"label": g["label"], "whislo": g["min"], "q1": g["q1"], "med": g["median"],
              "q3": g["q3"], "whishi": g["max"], "fliers": g.get("outliers", [])} for g in groups]
    ax.bxp(stats, vert=False, patch_artist=True, widths=0.5,
           boxprops={"facecolor": LIGHT, "edgecolor": INK},
           medianprops={"color": INK, "linewidth": 1.5},
           whiskerprops={"color": INK}, capprops={"color": INK},
           flierprops={"marker": "o", "markerfacecolor": "white", "markeredgecolor": INK, "markersize": 5})
    values = [v for g in groups for v in [g["min"], g["q1"], g["median"], g["q3"], g["max"], *g.get("outliers", [])]]
    low, high = math.floor(min(values) / 2) * 2, math.ceil(max(values) / 2) * 2
    ax.set_xticks(spec.get("ticks", list(range(low, high + 1, 2))))
    ax.set_xlim(low - 1, high + 1)
    ax.xaxis.grid(True, color=GRID, linewidth=0.6)
    ax.set_axisbelow(True)
    ax.set_xlabel(spec["xLabel"])
    ax.set_ylabel("Group")
    ax.tick_params(labelsize=13)
    ax.xaxis.label.set_size(13)
    ax.yaxis.label.set_size(13)
    ax.spines[["top", "right"]].set_visible(False)
    return finish(fig)


def paired_histograms(spec):
    fig, axes = plt.subplots(len(spec["groups"]), 1, figsize=(6.0, 4.6), sharex=True, sharey=True)
    top = max(max(g["counts"]) for g in spec["groups"]) + 2
    for ax, group in zip(axes, spec["groups"]):
        edges = [spec["start"] + i * spec["width"] for i in range(len(group["counts"]) + 1)]
        ax.bar(edges[:-1], group["counts"], width=spec["width"], align="edge", color=LIGHT, edgecolor=INK)
        ax.set_xticks(edges)
        ax.set_ylim(0, top)
        ax.set_title(group["label"])
        bars_axes(ax, spec["xLabel"], spec["yLabel"])
        ax.tick_params(labelsize=13)
        ax.xaxis.label.set_size(13)
        ax.yaxis.label.set_size(13)
    fig.tight_layout()
    return finish(fig)


def segmented(spec):
    fig, ax = plt.subplots(figsize=(6.0, 2.2))
    groups = spec["groups"]
    positions = list(range(len(groups)))[::-1]
    for position, group in zip(positions, groups):
        first = group["values"][0] * 100
        ax.barh(position, first, height=0.55, color=DARK, edgecolor=INK, linewidth=0.8)
        ax.barh(position, 100 - first, left=first, height=0.55, color=LIGHT, edgecolor=INK, linewidth=0.8)
    ax.set_yticks(positions, [g["label"] for g in groups])
    ax.set_xlim(0, 100)
    ax.set_xticks(range(0, 101, 10), [f"{v}%" for v in range(0, 101, 10)])
    ax.xaxis.grid(True, color=GRID, linewidth=0.6)
    ax.set_axisbelow(True)
    ax.set_ylim(-0.6, len(groups) - 0.4)
    ax.set_xlabel(spec["xLabel"])
    ax.set_ylabel(spec["yLabel"])
    ax.spines[["top", "right"]].set_visible(False)
    handles = [Patch(facecolor=DARK, edgecolor=INK, label=spec["legend"][0]), Patch(facecolor=LIGHT, edgecolor=INK, label=spec["legend"][1])]
    ax.legend(handles=handles, loc="upper center", borderaxespad=0, bbox_to_anchor=(0.5, -0.30), ncol=2, frameon=True, fancybox=False, edgecolor=INK)
    return finish(fig)


def venn(spec):
    fig, ax = plt.subplots(figsize=(7.2, 3.75))
    counts = spec["counts"]
    ax.add_patch(Rectangle((0, 0), 10, 5.2, fill=False, edgecolor=INK, linewidth=1))
    for cx in (3.9, 6.1):
        ax.add_patch(Circle((cx, 2.55), 1.9, facecolor=LIGHT, alpha=0.45, edgecolor=INK, linewidth=1.2))
    ax.text(3.0, 4.7, spec["left"], ha="center", fontsize=11)
    ax.text(7.0, 4.7, spec["right"], ha="center", fontsize=11)
    for x, key in ((2.9, "leftOnly"), (5.0, "both"), (7.1, "rightOnly")):
        ax.text(x, 2.45, str(counts[key]), ha="center", va="center", fontsize=12)
    ax.text(9.6, 0.35, f"{counts['neither']} neither", ha="right", va="bottom", fontsize=11)
    ax.set_xlim(-0.05, 10.05)
    ax.set_ylim(-0.05, 5.25)
    ax.set_aspect("equal")
    ax.axis("off")
    return finish(fig)


def tree(spec):
    fig, ax = plt.subplots(figsize=(6.0, 2.7))
    root_x, root_y, mid_x = 0.9, 2.0, 3.0
    longest = max(len(b["label"]) for b in spec["branches"])
    stage_two = mid_x + 0.2 + longest * 0.17      # second-stage lines start after the longest label
    end_x = stage_two + 2.3
    ax.text(root_x - 0.1, root_y, spec["root"], ha="right", va="center", fontsize=11)
    for branch, y in zip(spec["branches"], (3.0, 1.0)):
        ax.plot([root_x, mid_x], [root_y, y], color=INK, linewidth=1)
        ax.text((root_x + mid_x) / 2, (root_y + y) / 2 + (0.24 if y > root_y else -0.24), branch["p"], ha="center", va="center", fontsize=10.5)
        ax.text(mid_x + 0.1, y, branch["label"], ha="left", va="center", fontsize=11)
        for child, cy in zip(branch["children"], (y + 0.55, y - 0.55)):
            ax.plot([stage_two, end_x], [y, cy], color=INK, linewidth=1)
            ax.text((stage_two + end_x) / 2, (y + cy) / 2 + (0.22 if cy > y else -0.22), child["p"], ha="center", va="center", fontsize=10.5)
            ax.text(end_x + 0.1, cy, child["label"], ha="left", va="center", fontsize=11)
    ax.set_xlim(-0.2, end_x + 1.6)
    ax.set_ylim(0.2, 3.8)
    ax.axis("off")
    return finish(fig)


def grouped_bars(spec):
    fig, ax = plt.subplots(figsize=(6.0, 3.0))
    groups = spec['groups']
    width = 0.72 / len(groups)
    for i, group in enumerate(groups):
        positions = [x - 0.36 + width * (i + 0.5) for x in range(len(spec['categories']))]
        bars = ax.bar(positions, group['values'], width=width, label=group['label'],
                      color=[DARK, LIGHT, 'white'][i % 3], edgecolor=INK, linewidth=0.8)
        labels = [number(v) for v in group['values']]
        ax.bar_label(bars, labels=labels, padding=3, fontsize=11)
    ax.set_xticks(range(len(spec['categories'])), spec['categories'])
    top = max(max(g['values']) for g in groups)
    if spec.get('relative'):
        ax.set_ylim(0, 1)
        ax.set_yticks([0, .2, .4, .6, .8, 1], ['0', '0.2', '0.4', '0.6', '0.8', '1'])
    else:
        step = 10
        ax.set_ylim(0, math.ceil((top + step) / step) * step)
        ax.set_yticks(range(0, int(ax.get_ylim()[1]) + 1, step))
    bars_axes(ax, spec['xLabel'], spec['yLabel'])
    ax.tick_params(labelsize=11)
    ax.legend(loc='upper center', bbox_to_anchor=(.5, -.30), ncol=len(groups),
              frameon=True, fancybox=False, edgecolor=INK, fontsize=11)
    return finish(fig)


def mosaic(spec):
    fig, ax = plt.subplots(figsize=(6.0, 3.0))
    groups = spec['groups']
    total = sum(sum(g['counts']) for g in groups)
    left = 0
    colors = [DARK, LIGHT, 'white']
    centers = []
    for group in groups:
        n = sum(group['counts'])
        width = n / total
        bottom = 0
        centers.append(left + width / 2)
        for i, count in enumerate(group['counts']):
            height = count / n
            ax.add_patch(Rectangle((left, bottom), width, height, facecolor=colors[i % 3],
                                   edgecolor=INK, linewidth=1))
            ax.text(left + width / 2, bottom + height / 2, str(count), ha='center', va='center',
                    color='white' if i == 0 else INK, fontsize=13)
            bottom += height
        left += width
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.set_xticks(centers, [g['label'] for g in groups])
    ax.set_yticks([0, .25, .5, .75, 1], ['0', '0.25', '0.50', '0.75', '1'])
    ax.set_xlabel(spec['xLabel'])
    ax.set_ylabel(spec['yLabel'])
    ax.tick_params(labelsize=11)
    handles = [Patch(facecolor=colors[i], edgecolor=INK, label=l) for i, l in enumerate(spec['legend'])]
    ax.legend(handles=handles, loc='upper center', bbox_to_anchor=(.5, -.30), ncol=len(handles),
              frameon=True, fancybox=False, edgecolor=INK, fontsize=11)
    return finish(fig)


def comparison_dotplots(spec):
    """Exact-value comparisons on one shared horizontal scale."""
    groups = spec["groups"]
    fig, axes = plt.subplots(len(groups), 1, figsize=(6.0, 2.8), sharex=True)
    values = [v for g in groups for v in g["values"]]
    low, high = min(values), max(values)
    for ax, g in zip(axes, groups):
        seen = {}
        for v in g["values"]:
            seen[v] = seen.get(v, 0) + 1
            ax.plot(v, seen[v], "o", ms=7, mfc="white", mec=INK, mew=1)
        ax.set_ylim(0, max(seen.values()) + .7)
        ax.set_xlim(low - .6, high + .6)
        ax.set_yticks([])
        ax.set_ylabel(g["label"], rotation=0, labelpad=28, va="center", fontsize=12)
        ax.spines[["left", "top", "right"]].set_visible(False)
        ax.set_xticks(range(low, high + 1))
        ax.tick_params(labelsize=11)
    axes[-1].set_xlabel(spec["xLabel"], fontsize=12)
    fig.tight_layout(h_pad=.4)
    return finish(fig)


def study_flow(spec):
    """A two-branch selection or assignment plan with explicit action labels."""
    fig, ax = plt.subplots(figsize=(6.4, 3.0))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    def box(x, y, label, w, h):
        ax.add_patch(Rectangle((x-w/2, y-h/2), w, h, facecolor=LIGHT,
                               edgecolor=INK, linewidth=1))
        ax.text(x, y, label, ha="center", va="center", fontsize=14.5)
    box(.5, .85, spec["root"], .62, .26)
    for x, branch in zip([.25, .75], spec["branches"]):
        ax.annotate("", xy=(x, .29), xytext=(.5, .71),
                    arrowprops={"arrowstyle": "->", "color": INK, "lw": 1.1})
        ax.text(x, .49, branch["label"], ha="center", va="center", fontsize=12.5,
                bbox={"facecolor": "white", "edgecolor": "none", "pad": 2})
        box(x, .15, branch["end"], .46, .26)
    return finish(fig)


def sampling_grid(spec):
    """Show selection of intact groups, with individual units visible inside."""
    fig, ax = plt.subplots(figsize=(6.4, 2.7))
    ax.set_xlim(0, 6)
    ax.set_ylim(0, 2.55)
    ax.axis('off')
    ax.set_title(spec['title'], fontsize=15)
    for i, label in enumerate(spec['groups']):
        selected = i in spec['selected']
        ax.add_patch(Rectangle((i+.1, .55), .8, 1.25, facecolor=LIGHT if selected else 'white',
                               edgecolor=INK, linewidth=1.1))
        for x, y in [(i+.33,.9), (i+.67,.9), (i+.33,1.4), (i+.67,1.4)]:
            ax.plot(x,y,'o',mfc=DARK if selected else 'white',mec=INK,ms=7)
        ax.text(i+.5, 1.98, label, ha='center', fontsize=14)
    handles = [Patch(facecolor=LIGHT, edgecolor=INK, label='Selected: survey every resident'),
               Patch(facecolor='white', edgecolor=INK, label='Not selected')]
    ax.legend(handles=handles, loc='lower center', bbox_to_anchor=(.5,-.1),
              frameon=True, fancybox=False, edgecolor=INK, fontsize=14, ncol=1)
    return finish(fig)


def proportion_dotplot(spec):
    """A data-driven sample-proportion dotplot."""
    fig, ax = plt.subplots(figsize=WIDE)
    counts = {}
    for x in spec['values']:
        counts[x] = counts.get(x, 0)+1
        ax.scatter([x], [counts[x]], s=35, facecolor='white', edgecolor=INK, linewidth=1)
    step = spec['step']
    low, high = min(counts), max(counts)
    ax.set_xlim(low-step/2, high+step/2)
    ax.set_ylim(0,max(counts.values())+.7)
    ticks = [low+i*step for i in range(round((high-low)/step)+1)]
    ax.set_xticks(ticks,[f'{x:.2f}' for x in ticks])
    ax.set_yticks([])
    ax.spines[['left','right','top']].set_visible(False)
    ax.set_xlabel(tex(spec['xLabel']))
    return finish(fig)


def chi_square_curve(spec):
    """Defining gamma density, without an additional dependency."""
    from math import exp, lgamma, log
    df = spec['df']
    if df < 1 or df != int(df):
        raise ValueError('Chi-square df must be a positive integer')
    xmax = spec['xMax']
    density = lambda x: exp((df/2-1)*log(x)-x/2-(df/2)*log(2)-lgamma(df/2))
    xs = [xmax*i/600 for i in range(1,601)]
    ys = [density(x) for x in xs]
    fig, ax = plt.subplots(figsize=WIDE)
    cutoff = spec.get('cutoff')
    if cutoff is not None:
        ax.fill_between(xs,ys,where=[x>=cutoff for x in xs],color=LIGHT,interpolate=True)
        ax.plot([cutoff,cutoff],[0,density(cutoff)],color=INK,linewidth=.8)
    ax.plot(xs,ys,color=INK,linewidth=1.6)
    ax.set_xlim(0,xmax)
    ax.set_ylim(0,max(ys)*1.15)
    ticks=[0,xmax/4,xmax/2,3*xmax/4,xmax]
    if cutoff is not None: ticks=sorted(set([t for t in ticks if abs(t-cutoff)>xmax*.075]+[cutoff]))
    ax.set_xticks(ticks,[number(x) for x in ticks])
    ax.set_yticks([])
    ax.spines[['left','top','right']].set_visible(False)
    ax.set_xlabel(tex(spec['xLabel']))
    ax.text(.98,.9,f'df = {df}',transform=ax.transAxes,ha='right',va='top')
    return finish(fig)


KINDS = {fn.__name__: fn for fn in (discrete_bars, binomial_bars, normal, normal_comparison, frequency_histogram,
                                    relative_frequency_bars, dotplot, segmented, venn, tree,
                                    categorical_bars, categorical_pie, summary_boxplots, paired_histograms, grouped_bars, mosaic,
                                    comparison_dotplots, study_flow, sampling_grid, proportion_dotplot, chi_square_curve)}


def display_size(svg: bytes) -> tuple[int, int]:
    import re
    width, height = re.search(rb'width="([\d.]+)pt" height="([\d.]+)pt"', svg[:800]).groups()
    return 480, round(480 * float(height) / float(width))


def sync_sizes(course: str, sizes: dict) -> int:
    """Keep each image stimulus's width/height equal to its SVG's aspect ratio.

    This is the only content field the builder writes. The app uses these
    attributes to reserve space before the image loads.
    """
    changed = 0
    for unit_file in sorted((ROOT / "src" / "content" / course / "units").glob("*.json")):
        text = unit_file.read_text()
        unit = json.loads(text)
        for question in unit["questions"]:
            for slot in ("stimulus", "solutionStimulus"):
                stimulus = question.get(slot)
                if stimulus and stimulus.get("type") == "image":
                    size = sizes.get(stimulus["src"].removeprefix("assets/"))
                    if size and (stimulus.get("width"), stimulus.get("height")) != size:
                        stimulus["width"], stimulus["height"] = size
                        changed += 1
        updated = json.dumps(unit, ensure_ascii=False, indent=2) + "\n"
        if updated != text:
            unit_file.write_text(updated)
    return changed


def main(check_only: bool) -> int:
    stale = []
    count = 0
    for spec_file in sorted(SPECS.glob("*.json")):
        sizes = {}
        for spec in json.loads(spec_file.read_text())["diagrams"]:
            svg = KINDS[spec["kind"]](spec)
            target = OUT / spec["file"]
            sizes[spec["file"]] = display_size(svg)
            count += 1
            if check_only:
                if not target.exists() or target.read_bytes() != svg:
                    stale.append(spec["file"])
            else:
                OUT.mkdir(parents=True, exist_ok=True)
                target.write_bytes(svg)
        if not check_only:
            changed = sync_sizes(spec_file.stem, sizes)
            if changed:
                print(f"Updated width/height on {changed} image stimuli.")
    if check_only:
        if stale:
            print("Diagrams out of date (run npm run diagrams): " + ", ".join(stale))
            return 1
        print(f"Verified {count} diagrams are reproducible from src/diagrams.")
        return 0
    print(f"Rendered {count} diagrams into src/assets/diagrams.")
    return 0


if __name__ == "__main__":
    sys.exit(main("--check" in sys.argv[1:]))
