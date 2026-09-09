import { realpath } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { serve } from "bun";

const reportsDirectory = await realpath(resolve(import.meta.dir, "../reports"));
const formats = new Map([
  ["html", "text/html; charset=utf-8"],
  ["markdown", "text/markdown; charset=utf-8"],
]);

serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    const report = url.searchParams.get("report");
    const format = url.searchParams.get("format") ?? "html";
    const contentType = formats.get(format);

    if (!report) {
      return new Response("Missing report parameter", { status: 400 });
    }
    if (!contentType) {
      return new Response("Unsupported format", { status: 400 });
    }

    let input;
    try {
      input = await realpath(resolve(reportsDirectory, report));
    } catch {
      return new Response("Report not found", { status: 404 });
    }
    const relativePath = relative(reportsDirectory, input);
    if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
      return new Response("Invalid report path", { status: 400 });
    }

    let process;
    try {
      process = Bun.spawn(["pandoc", input, "-t", format], {
        stdout: "pipe",
        stderr: "pipe",
      });
    } catch (error) {
      console.error("Could not start pandoc", { error });
      return new Response("Report conversion unavailable", { status: 500 });
    }

    const [exitCode, error] = await Promise.all([
      process.exited,
      new Response(process.stderr).text(),
    ]);
    if (exitCode !== 0) {
      console.error("pandoc failed", { exitCode, error });
      return new Response("Report conversion failed", { status: 500 });
    }

    return new Response(process.stdout, {
      headers: { "content-type": contentType },
    });
  },
});
