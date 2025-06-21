import { BunRequest, Server } from "bun";
import { GamanRequest } from "../../router/request";
import { AppRouter } from "../../router/AppRouter";
import { requestHandler } from "../requestHandler";
import { Response } from "../../router/response";
import { Block } from "../../block/block";
import { CookieManager } from "../../cookie";
import { GamanFormData } from "../../formdata";

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

  // Gaman Response
  const gamanRequest: GamanRequest = {
    method: req.method || "GET",
    url: req.url,
    pathname: _url.pathname,
    headers: req.headers.toJSON() as Record<string, string>,
    query: Object.fromEntries(_url.searchParams.entries()),
    params,
    body: req.body || null,
    json: async <T>() => {
      return (await req.json()) as T;
    },
    formData: async () => {
      const gamanFormData = new GamanFormData();
      const bunFormData = await req.formData();
      bunFormData.forEach(async (value, key, parent) => {
        if (value instanceof File) {
          const arrayBuffer = await value.arrayBuffer();
          gamanFormData.set(key, {
            isFile: true,
            name: key,
            mimetype: value.type,
            filename: value.name,
            value: new Blob([arrayBuffer], {
              type: value.type,
            }),
          });
        } else {
          gamanFormData.set(key, {
            isFile: false,
            name: key,
            value,
          });
        }
      });
      return gamanFormData;
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
    locals: {},
    formData: gamanRequest.formData,
    json: gamanRequest.json,
    cookies: gamanRequest.cookies,
  });
}
