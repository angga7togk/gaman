import querystring from "node:querystring";
import type { Request } from "./request";
import http from "http";
import { parseBody, parseMultipartForm } from "./requestParsing";
import type AppRouter from "../AppRouter";

export async function createRequest(
  appRouter: AppRouter,
  req: http.IncomingMessage
): Promise<Request> {
  const urlString = req.url || "";
  const method = req.method;
  const url = new URL(urlString, `http://${req.headers.host}`);
  const contentType = req.headers["content-type"] || "";

  // ini harus salah satu dijalanin soalnya 2 2 nya pakai anu yang sama :V
  let body: any;
  if (contentType.includes("multipart/form-data") && method !== 'HEAD') {
    // tidak di proses ketika method head
    // karna head tidak mebawa body
    body = await parseMultipartForm(req);
  } else {
    body = await parseBody(req);
  }

  // parsing parameter contoh: /user/:userId
  const params: Record<string, string> = {};
  for (const route of appRouter.getRoutes()) {
    const match = route.regexPath.exec(urlString);
    if (match && route.method === method) {
      // Extract params from the URL
      route.paramKeys.forEach((key, index) => {
        params[key] = match[index + 1] || ""; // +1 because match[0] is the full match
      });
    }
  }

  return {
    method: req.method || "GET",
    url: urlString,
    pathname: url.pathname,
    headers: req.headers as Record<string, string>,
    query: Object.fromEntries(url.searchParams.entries()),
    params,
    body: body || null,
    json: () => {
      try {
        return body ? JSON.parse(body) : {};
      } catch (error) {
        return {};
      }
    },
    form: getFormData(contentType, body),
    getJson: <T>() => {
      try {
        return body ? (JSON.parse(body) as T) : ({} as T);
      } catch (error) {
        return {} as T;
      }
    },
    getForm: <T>() => getFormData<T>(contentType, body),
    cookies: {}, // Parsing dari `req.headers.cookie`
    ip: req.socket.remoteAddress || "",
    raw: req,
  };
}

function getFormData<T>(contentType: string, body: any): T {
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return querystring.parse(body) as T;
  }
  if (contentType.includes("multipart/form-data")) {
    return body as T;
  }
  return "" as T;
}
