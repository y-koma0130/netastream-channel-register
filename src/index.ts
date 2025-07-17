import { Hono } from "hono";
import type { KVNamespace } from "@cloudflare/workers-types";

type Env = {
  Bindings: {
    CHANNELS: KVNamespace;
  };
};

const app = new Hono<Env>();

app.post("/webhook", async (c) => {
  const body = await c.req.json<{ userId: string; channelUrl: string }>();

  const { userId, channelUrl } = body;

  if (!userId || !channelUrl) {
    return c.json({ error: "Missing userId or channelUrl" }, 400);
  }

  await c.env.CHANNELS.put(userId, channelUrl);

  return c.json({ status: "ok", saved: { userId, channelUrl } });
});

export default app;
