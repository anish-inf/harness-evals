# Report server example

Run the example with:

```bash
bun examples/report-server.js
```

Place source files in the repository's `reports` directory, then request a
conversion using a relative `report` path and an allowed `format`: `html`,
`markdown`, or `pdf`. The server returns HTTP 400 for unsupported inputs.
