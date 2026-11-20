export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/boxes") return env.ASSETS.fetch(request);

    const json = (d) =>
      new Response(JSON.stringify(d), {
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      });

    if (request.method === "GET") {
      return json((await env.VAULT.get("boxes", { type: "json" })) || []);
    }
    if (request.method === "POST") {
      const pw = request.headers.get("x-admin-password");
      if (!env.ADMIN_PASSWORD || pw !== env.ADMIN_PASSWORD) {
        return new Response("Unauthorized", { status: 401 });
      }
      let body;
      try { body = await request.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
      if (!Array.isArray(body) || body.length > 200) return new Response("Bad data", { status: 400 });
      const clean = body.map((b) => {
        let img = String((b && b.img) || "");
        if (!img.startsWith("data:image/") || img.length > 200000) img = "";
        return {
          title: String((b && b.title) || "").slice(0, 200),
          text: String((b && b.text) || "").slice(0, 50000),
          link: String((b && b.link) || "").slice(0, 2000),
          img: img,
        };
      });
      await env.VAULT.put("boxes", JSON.stringify(clean));
      return new Response("OK");
    }
    return new Response("Method not allowed", { status: 405 });
  },
};
