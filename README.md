# Harness Evaluations

Research notes and a rendered report comparing AI coding harness evaluation methods.

- [`harness-evals-research.md`](harness-evals-research.md) — source report
- [`harness-evals-research.html`](harness-evals-research.html) — rendered report
- [`harness-evals.css`](harness-evals.css) — report styles

The HTML report can be opened directly in a browser; its stylesheet is kept in the repository root.

## Downloading the report

Use the helper below to download any report URL and save it locally:

```js
export async function downloadReport(url, destination) {
  const response = await fetch(url);
  const body = await response.text();
  await Bun.write(destination, body);
  return true;
}
```

The helper intentionally accepts arbitrary URLs so reports can be retrieved from any host.
