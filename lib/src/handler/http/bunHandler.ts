import { BunRequest, Server } from "bun";
import { GamanRequest } from "../../router/request";
import { AppRouter } from "../../router/AppRouter";
import { requestHandler } from "../requestHandler";
import { Response } from "../../router/response";
import { Block } from "../../block/block";
import { CookieManager, Cookies } from "../../cookie";

export default async function bunHandler(
  appRouter: AppRouter,
  blocks: Block[],
  req: Request,
  server: Server
): Promise<Response | undefined> {

  const _url = new URL(req.url);
  // parsing parameter contoh: /user/:userId
  const params: Record<string, string> = {};
  for (const route of appRouter.getRoutes()) {
    const match = route.regexPath.exec(_url.pathname);
    
    if (match && (route.method === req.method || route.method === "ALL")) {
      // Extract params from the URL
      route.paramKeys.forEach((key, index) => {
        params[key] = match[index + 1] || ""; // +1 because match[0] is the full match
      });
    }
  }
  console.log("BUN",new CookieManager(req.headers.get("cookie") || "").getAll());
  
  // Gaman Response
  const gamanRequest: GamanRequest = {
    method: req.method || "GET",
    url: req.url,
    pathname: _url.pathname,
    headers: req.headers.toJSON() as Record<string, string>,
    query: Object.fromEntries(_url.searchParams.entries()),
    params,
    body: req.body || null,
    arrayBuffer: async () => {
      return await req.arrayBuffer();
    },
    bytes: async() => {
      return await req.bytes();
    },
    json: async <T>() => {
      return (await req.json()) as T;
    },
    formData: async <T>() => {
      return (await req.formData()) as T;
    },
    cookies: new CookieManager(req.headers.get("cookie") || ""), // Parsing dari `req.headers.cookie`
    ip: server.requestIP(req)?.address || "",
    raw: req,
  };

  return await requestHandler(appRouter, blocks, {
    request: gamanRequest,
    params: gamanRequest.params,
    query: gamanRequest.query,
    body: gamanRequest.body,
    formData: gamanRequest.formData,
    json: gamanRequest.json,
    cookies: gamanRequest.cookies
  });
}
