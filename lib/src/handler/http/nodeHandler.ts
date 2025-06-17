import http from "node:http";
import querystring from "node:querystring";
import { requestHandler } from "../requestHandler";
import { AppRouter } from "../../router/AppRouter";
import { Response } from "../../router/response";
import { GamanRequest } from "../../router/request";
import formidable from "formidable";
import { Block } from "../../block/block";
import { CookieManager, Cookies } from "../../cookie";

export default async function nodeHandler(
  appRouter: AppRouter,
  blocks: Block[],
  req: http.IncomingMessage
): Promise<Response | undefined> {
  const urlString = req.url || "";
  const method = req.method;
  const url = new URL(urlString, `http://${req.headers.host}`);
  const contentType = req.headers["content-type"] || "";

  const rawBytesPromise = getRawBytes(req); // Dapatkan Promise untuk Buffer

  let body: any;
  if (contentType.includes("multipart/form-data") && method !== "HEAD") {
    body = await parseMultipartForm(req);
  } else {
    const rawBytes = await rawBytesPromise; // Tunggu Buffer untuk body parsing
    body = rawBytes.toString();
  }

  const params: Record<string, string> = {};
  for (const route of appRouter.getRoutes()) {
    const match = route.regexPath.exec(urlString);
    if (match && (route.method === method || route.method === "ALL")) {
      route.paramKeys.forEach((key, index) => {
        params[key] = match[index + 1] || "";
      });
    }
  }

  const gamanRequest: GamanRequest = {
    method: req.method || "GET",
    url: urlString,
    pathname: url.pathname,
    headers: req.headers as Record<string, string>,
    query: Object.fromEntries(url.searchParams.entries()),
    params,
    body: body || null,
    arrayBuffer: async () => {
      const rawBytes = await rawBytesPromise;
      return rawBytes.buffer.slice(
        rawBytes.byteOffset,
        rawBytes.byteOffset + rawBytes.byteLength
      ) as ArrayBuffer; 
    },
    bytes: async () => {
      const rawBytes = await rawBytesPromise;
      return new Uint8Array(
        rawBytes.buffer.slice(
          rawBytes.byteOffset,
          rawBytes.byteOffset + rawBytes.byteLength
        ) as ArrayBuffer 
      );
    },
    json: <T>() => {
      try {
        return body ? (JSON.parse(body) as T) : ({} as T);
      } catch (error) {
        return {} as T;
      }
    },
    formData: <T>() => getFormData<T>(contentType, body),
    cookies: new CookieManager(req.headers.cookie || ""), // Parsing dari `req.headers.cookie`
    ip: req.socket.remoteAddress || "",
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

function getFormData<T>(contentType: string, body: any): T {
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return querystring.parse(body) as T;
  }
  if (contentType.includes("multipart/form-data")) {
    return body as T;
  }
  return "" as T;
}

export async function parseMultipartForm(req: http.IncomingMessage): Promise<{
  fields: formidable.Fields<string>;
  files: formidable.Files<string>;
}> {
  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10 MB
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export function parseBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let rawData = "";
    req.on("data", (chunk) => {
      rawData += chunk;
    });
    req.on("end", () => resolve(rawData));
    req.on("error", reject);
  });
}

async function getRawBytes(req: http.IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
