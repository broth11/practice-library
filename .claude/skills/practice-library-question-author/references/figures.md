# Figures

Every chart, plot, tree, and Venn diagram is generated from data. The SVG is output, not source.

## Workflow

1. Add or edit an entry in `src/diagrams/<course>.json`. Each entry names its `file`, its `kind`, the `questions` that display it (`"<unit>:<id>"`), and the kind's data.
2. Run `npm run diagrams`. It renders `src/assets/diagrams/<file>` and updates the linked stimulus's `width` and `height`.
3. Reference the figure from the question as an image stimulus with descriptive `alt` text and an optional `caption`.
4. Run `npm run check:diagrams` and `npm run check`. Both fail if a figure is stale, orphaned, or unlinked.

Install the renderer once with `pip install -r scripts/diagrams/requirements.txt`. The matplotlib version is pinned so output is byte-identical everywhere.

## Kinds

| kind | Use | Key fields |
|---|---|---|
| `discrete_bars` | A discrete probability distribution | `values`, `probs`, `printValues`, `xLabel` |
| `binomial_bars` | A binomial distribution, optionally highlighting counts | `n`, `p`, `highlight` `[lo, hi]` or `null` |
| `normal` | One normal curve with a shaded event | `mu`, `sd`, `lo`, `hi`, `outside`, `marks`, `xLabel`, `area`, `showSd`, `meanLabel` |
| `normal_comparison` | Several normal curves with a boxed legend | `mu`, `curves` (`name`, `sd`, `style`), `xRange` |
| `frequency_histogram` | Counts in equal-width bins | `start`, `width`, `counts`, `highlightFrom`, `printCounts` |
| `relative_frequency_bars` | Relative frequencies of discrete outcomes | `categories`, `counts`, `trials` |
| `dotplot` | One dot per value | `values`, `highlightMin`, `title` |
| `segmented` | Segmented bars within groups | `groups` (`label`, `values`), `legend`, `xLabel`, `yLabel` |
| `venn` | Two-set Venn diagram with counts | `left`, `right`, `counts` (`leftOnly`, `both`, `rightOnly`, `neither`) |
| `tree` | Two-stage probability tree | `root`, `branches` (`label`, `p`, `children`) |

A normal bound can be a number or `{ "percentile": 0.9 }`, and `mu` or `sd` can be `{ "solveFrom": { "value": 42, "percentile": 0.10 } }`. Prefer these to typed decimals so the figure and the question cannot drift apart.

## Style

AP print style, rule S14 in `ap-style.md`: grayscale, black lines, dark gray for the highlighted event, light gray otherwise, axis titles on both axes of a chart, and a boxed legend for several series. Density curves carry no vertical axis. Keep a figure's information identical to what the question needs. A figure that prints a value the question asks for gives away the answer.
