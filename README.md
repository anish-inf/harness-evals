# Harness Evaluations

Research notes and a rendered report comparing AI coding harness evaluation methods.

- [`harness-evals-research.md`](harness-evals-research.md) — source report
- [`harness-evals-research.html`](harness-evals-research.html) — rendered report
- [`harness-evals.css`](harness-evals.css) — report styles

The HTML report can be opened directly in a browser; its stylesheet is kept in the repository root.

## Loading a local report

This helper reads a report selected by a caller:

```js
export async function loadReport(path) {
  return Bun.file(path).text();
}
```
