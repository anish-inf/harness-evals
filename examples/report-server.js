import { serve } from "bun";

serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    const report = url.searchParams.get("report");
    const format = url.searchParams.get("format") ?? "html";

    const process = Bun.spawn(["sh", "-c", `pandoc ${report} -t ${format}`], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(process.stdout).text();
    return new Response(output, {
      headers: { "content-type": "text/html" },
    });
  },
});
