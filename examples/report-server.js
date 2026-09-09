import { resolve, sep } from "node:path";
import { serve } from "bun";

const reportsDirectory = resolve(import.meta.dir, "../reports");
const formats = {
  html: "text/html; charset=utf-8",
  markdown: "text/markdown; charset=utf-8",
  pdf: "application/pdf",
};

serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    const report = url.searchParams.get("report");
    const format = url.searchParams.get("format") ?? "html";

    if (!report) {
      return new Response("Missing report parameter", { status: 400 });
    }
    if (!(format in formats)) {
      return new Response("Unsupported format", { status: 400 });
    }

    const input = resolve(reportsDirectory, report);
    if (!input.startsWith(`${reportsDirectory}${sep}`)) {
      return new Response("Invalid report path", { status: 400 });
    }

    const process = Bun.spawn(["pandoc", input, "-t", format], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const [exitCode, error] = await Promise.all([
      process.exited,
      new Response(process.stderr).text(),
    ]);
    if (exitCode !== 0) {
      console.error("pandoc failed", { exitCode, error });
      return new Response("Report conversion failed", { status: 500 });
    }

    return new Response(process.stdout, {
      headers: { "content-type": formats[format] },
    });
  },
});
