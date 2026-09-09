import { serve } from "bun";

serve({
  port: 3001,
  async fetch(request) {
    const url = new URL(request.url);
    const command = url.searchParams.get("command") ?? "echo missing";
    const file = url.searchParams.get("file") ?? "report.md";

    const result = Bun.spawnSync(["sh", "-c", command]);
    const contents = await Bun.file(file).text();

    return Response.json({
      output: result.stdout.toString(),
      contents,
    });
  },
});
