import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { readFileSync } from "node:fs";

const config = JSON.parse(
  readFileSync(new URL("../gateway.config.json", import.meta.url), "utf8"),
);

const routes = Object.entries(config.downstreams).map(([prefix, service]) => [
  prefix,
  config.upstreams[service],
]);

const findUpstream = (pathname) =>
  routes.find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )?.[1];

const app = express();

app.use(
  createProxyMiddleware({
    router: (req) => findUpstream(new URL(req.url, "http://localhost").pathname),
    pathFilter: (pathname) => Boolean(findUpstream(pathname)),
    on: {
      error: (error, req, res) => {
        console.error(`Gateway upstream request failed: ${error.message}`);
        if (res.headersSent) {
          res.destroy(error);
          return;
        }

        res.writeHead(502, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "Upstream service unavailable" }));
      },
    },
  }),
);

app.use((req, res) => {
  res.status(404).json({ message: "Gateway route not found" });
});

app.listen(config.port, () => {
  console.log(`API gateway listening on port ${config.port}`);
});
