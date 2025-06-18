import http from "node:http";
import querystring from "node:querystring";
import { AppRouter } from "../../router/AppRouter";
import { Response } from "../../router/response";
import { GamanRequest } from "../../router/request";
import { Block } from "../../block/block";
import { CookieManager } from "../../cookie";
// Hapus import dari '@mjackson/multipart-parser'
// import { getMultipartBoundary, MultipartParseError, MultipartPart, parseMultipartStream } from "@mjackson/multipart-parser";
import { requestHandler } from "../requestHandler";
import Busboy from "busboy"; // Import Busboy
import { FormDataEntryValue, GamanFormData } from "../../formdata";

export default async function nodeHandler(
  appRouter: AppRouter,
  blocks: Block[],
  req: http.IncomingMessage
): Promise<Response | undefined> {
  const urlString = req.url || "/";
  const method = req.method || "GET";
  const url = new URL(urlString, `http://${req.headers.host}`);
  const contentType = req.headers["content-type"] || "";

  let parsedBody: {
    json?: any;
    raw?: Buffer;
  } = {};

  // Perubahan di sini: Hanya bufferize jika BUKAN multipart/form-data
  if (!(contentType.includes("multipart/form-data") && method !== "HEAD")) {
    const bodyBuffer = await getRequestBodyBuffer(req);
    parsedBody = parseRequestBody(bodyBuffer, contentType, method);
  }

  const params: Record<string, string> = {};
  for (const route of appRouter.getRoutes()) {
    const match = route.regexPath.exec(url.pathname);
    if (match && (route.method === method || route.method === "ALL")) {
      route.paramKeys.forEach((key, index) => {
        params[key] = match[index + 1] || "";
      });
    }
  }

  const gamanRequest: GamanRequest = {
    method,
    url: urlString,
    pathname: url.pathname,
    headers: req.headers as Record<string, string>,
    query: Object.fromEntries(url.searchParams.entries()),
    params,
    // body akan menjadi raw buffer untuk non-multipart, atau null/undefined untuk multipart
    body: parsedBody.raw || null,
    json: async <T>() => {
      return parsedBody.json ? (parsedBody.json as T) : ({} as T);
    },
    formData: async () => {
      if (
        contentType.includes("application/x-www-form-urlencoded") &&
        method !== "HEAD"
      ) {
        return parseFormUrlEncoded(parsedBody.raw?.toString() || "{}");
      } else if (
        contentType.includes("multipart/form-data") &&
        method !== "HEAD"
      ) {
        const formData = await parseMultipartFormWithBusboy(req);
        return formData;
      } else {
        return new GamanFormData();
      }
    },
    cookies: new CookieManager(req.headers.cookie || ""),
    ip: req.socket.remoteAddress || "",
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

// Fungsi ini tetap sama, hanya digunakan untuk non-multipart requests
async function getRequestBodyBuffer(
  req: http.IncomingMessage
): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Fungsi ini tetap sama, mem-parse body buffer untuk JSON dan URL-encoded
function parseRequestBody(
  bodyBuffer: Buffer,
  contentType: string,
  method: string
): {
  json?: any;
  raw?: Buffer;
} {
  if (contentType.includes("application/json") && method !== "HEAD") {
    try {
      return { json: JSON.parse(bodyBuffer.toString()), raw: bodyBuffer };
    } catch {
      return { raw: bodyBuffer };
    }
  }

  // Penting: Bagian ini DIHAPUS karena multipart ditangani langsung di nodeHandler
  // if (contentType.includes("multipart/form-data") && method !== "HEAD") {
  //   const boundary = getMultipartBoundary(contentType);
  //   if (!boundary) throw new MultipartParseError("Missing multipart boundary");
  //   const stream = parseMultipartForm(bodyBuffer, boundary); // Ini akan dihapus
  //   return { formData: stream };
  // }

  return { raw: bodyBuffer };
}

function parseFormUrlEncoded(body: string): GamanFormData {
  const data = querystring.parse(body);
  const result = new GamanFormData();
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      const _values: FormDataEntryValue[] = value.map((v) => ({
        isFile: false,
        name: key,
        value: v as string, // Cast to string since querystring.parse returns string | string[]
      }));
      result.setAll(key, _values);
    } else {
      result.set(key, {
        isFile: false,
        name: key,
        value: (value as string) || "",
      });
    }
  }
  return result;
}

// --- Fungsi Baru untuk Busboy ---
async function parseMultipartFormWithBusboy(
  req: http.IncomingMessage
): Promise<GamanFormData> {
  const formData = new GamanFormData();

  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });

    busboy.on("file", (name, fileStream, info) => {
      const { filename, encoding, mimeType } = info;
      const fileChunks: Buffer[] = [];
      fileStream.on("data", (chunk) => {
        fileChunks.push(chunk);
      });
      fileStream.on("end", () => {
        const fileBuffer = Buffer.concat(fileChunks);
        formData.set(name, {
          isFile: true,
          name: name,
          filename: filename,
          mimetype: mimeType,
          // Menggunakan Blob karena GamanFormData.value menerima Blob
          value: new Blob([fileBuffer], { type: mimeType }),
        });
      });
      fileStream.on("error", reject);
    });

    busboy.on("field", (name, val, info) => {
      formData.set(name, {
        isFile: false,
        name,
        value: val,
      });
    });

    busboy.on("finish", () => {
      resolve(formData);
    });

    busboy.on("error", reject);

    // Sangat penting: Alirkan request stream ke busboy
    req.pipe(busboy);
  });
}
