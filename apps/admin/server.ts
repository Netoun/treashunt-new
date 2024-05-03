import { resolve } from "node:path";
import type { ServerBuild } from "@remix-run/node";
import { createRequestHandler } from "@remix-run/server-runtime";
import { serve } from "bun";

process.env.REMIX_DEV_ORIGIN = "https://localhost";

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
          appType: "custom",
        }),
      );      

const BUILD_PATH = "./build/server/index.js";

const build: ServerBuild = viteDevServer
  ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
  : await import(BUILD_PATH);
  
const remix = createRequestHandler(build, process.env.NODE_ENV);

serve({
  development: process.env.NODE_ENV !== "production",
  port: process.env.PORT || 3000,
  hostname: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
  async fetch(request: Request) {
    const url = new URL(request.url);
    const file = Bun.file(
      resolve(
        __dirname,
        process.env.NODE_ENV === "production" ? "build/client" : "./public",
        `.${url.pathname}`,
      ),
    );

    if (await file.exists()) {
      return new Response(file);
    }

    const loadContext = {};

    const response = await remix(request, loadContext);

    return response;
  },
});
