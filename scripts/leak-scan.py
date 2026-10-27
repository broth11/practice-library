"""Check that no AP scoring-guide text has leaked into this public repository.

Run on a machine that has the private AP Question Archetypes library:

    python3 scripts/leak-scan.py "~/Documents/Courses/AP Statistics/AP Question Archetypes"
    python3 scripts/leak-scan.py "<library>" --history    # also scan every file in every commit

It builds 8-word shingles from every transcribed item (sources/*.json) and every
card exemplar (cards/*.json), then reports runs of shared words in this
repository. Style rule S16 allows an exemplar's ask frame to be reused, so short
runs of stock wording ("what is the probability that at least one of the") are
expected. A run of FAIL_AT words or more fails. The library itself is never read
into the repository; only this script and its verdict are.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

N = 8
FAIL_AT = 12
# S16 permits stock ask frames. These exact context-free runs are exceptions;
# longer matches that include context, values, or other wording still fail.
STOCK_ASK_FRAMES = {
    "is the mean of the sampling distribution of the sample proportion of",
    "which of the following is closest to the standard deviation of the",
}
ROOT = Path(__file__).resolve().parents[1]


def words(text: str) -> list[str]:
    # Strip only real HTML tags, so statistical text such as "P(X < 3) and Y > 2" survives.
    return re.findall(r"[a-z0-9]+", re.sub(r"</?[a-zA-Z][^<>]*>", " ", text).lower())


def item_text(item: dict) -> str:
    parts = [item.get("scenario") or "", item.get("ask") or "", item.get("explanation") or ""]
    options = item.get("options") or {}
    parts += list(options.values()) if isinstance(options, dict) else [str(o) for o in options]
    return " ".join(str(p) for p in parts)


def corpus(library: Path) -> dict[str, str]:
    shingles: dict[str, str] = {}
    texts = []
    for f in sorted((library / "sources").glob("*.json")):
        texts += [(i["id"], item_text(i)) for i in json.loads(f.read_text())["items"]]
    for f in sorted((library / "cards").glob("*.json")):
        texts += [(e.get("id", f.stem), item_text(e)) for e in json.loads(f.read_text()).get("exemplars", [])]
    for source_id, text in texts:
        w = words(text)
        for i in range(len(w) - N + 1):
            shingles.setdefault(" ".join(w[i:i + N]), source_id)
    return shingles


def runs(text: str, shingles: dict[str, str]):
    w = words(text)
    hits = [i for i in range(len(w) - N + 1) if " ".join(w[i:i + N]) in shingles]
    start = prev = None
    for i in hits + [None]:
        if start is not None and (i is None or i > prev + 1):
            yield prev - start + N, " ".join(w[start:prev + N]), shingles[" ".join(w[start:start + N])]
            start = None
        if i is not None:
            start = i if start is None else start
            prev = i


def blobs(history: bool):
    git = lambda *a: subprocess.run(["git", *a], cwd=ROOT, capture_output=True, check=True).stdout  # noqa: E731
    if not history:
        for path in git("ls-files", "--cached", "--others", "--exclude-standard").decode().splitlines():
            yield path, (ROOT / path).read_bytes()
        return
    seen = set()
    for line in git("rev-list", "--all", "--objects").decode().splitlines():
        sha, _, path = line.partition(" ")
        if path and sha not in seen and git("cat-file", "-t", sha).strip() == b"blob":
            seen.add(sha)
            yield f"{path} @ {sha[:8]}", git("cat-file", "-p", sha)



def fragments(name: str, text: str):
    """Never join distinct JSON fields/choices into an invented source sentence."""
    if name.split(" @ ", 1)[0].endswith(".json"):
        try:
            parsed = json.loads(text)
        except (ValueError, TypeError):
            pass
        else:
            def walk(value, path):
                if isinstance(value, str):
                    yield path, value
                elif isinstance(value, list):
                    for index, item in enumerate(value):
                        yield from walk(item, f"{path}[{index}]")
                elif isinstance(value, dict):
                    for key, item in value.items():
                        yield from walk(item, f"{path}.{key}")
            yield from walk(parsed, name)
            return
    yield name, text


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    library = Path(sys.argv[1]).expanduser()
    shingles = corpus(library)
    worst = 0
    failures = []
    for name, data in blobs("--history" in sys.argv):
        if b"\0" in data[:4000]:
            continue
        for location, fragment in fragments(name, data.decode("utf-8", "ignore")):
            for length, text, source in runs(fragment, shingles):
                worst = max(worst, length)
                if length >= FAIL_AT and text not in STOCK_ASK_FRAMES:
                    failures.append(f"{location}: {length} words shared with {source}: {text[:160]}")
    print(f"Scanned against {len(shingles)} AP shingles. Longest shared run: {worst} words (fail at {FAIL_AT}).")
    for failure in failures:
        print("LEAK", failure)
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
