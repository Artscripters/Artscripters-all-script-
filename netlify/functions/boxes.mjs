import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("vault");

  if (req.method === "GET") {
    const data = (await store.get("boxes", { type: "json" })) || [];
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  if (req.method === "POST") {
    const pw = req.headers.get("x-admin-password");
    if (!process.env.ADMIN_PASSWORD || pw !== process.env.ADMIN_PASSWORD) {
      return new Response("Unauthorized", { status: 401 });
    }
    let body;
    try { body = await req.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
    if (!Array.isArray(body) || body.length > 200) {
      return new Response("Bad data", { status: 400 });
    }
    const clean = body.map((b) => ({
      title: String((b && b.title) || "").slice(0, 200),
      text: String((b && b.text) || "").slice(0, 50000),
      link: String((b && b.link) || "").slice(0, 2000),
    }));
    await store.setJSON("boxes", clean);
    return new Response("OK");
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/boxes" };
