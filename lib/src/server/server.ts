import http from "http";
import https from "https";
import http2 from "http2";
import fs from "fs";

const NODE_ENV = process.env.NODE_ENV || "development";

interface ServerOptions {
  http?: boolean;
  https?: {
    key: string;
    cert: string;
  };
  http2?: boolean;
}

export function createServer(
  handler: http.RequestListener,
  options: ServerOptions = { http: true }
) {
  if (options.http2) {
    return http2.createServer({
      
    }, (req, res) => {
      if (req instanceof http2.Http2ServerRequest && res instanceof http2.Http2ServerResponse) {
        handler(req as any, res as any); // Cast to `http` types for compatibility
      }
    });
  }

  if (options.https) {
    const { key, cert } = options.https;
    if (!key || !cert) {
      throw new Error("HTTPS requires both `key` and `cert` to be specified.");
    }
    return https.createServer(
      {
        key: fs.readFileSync(key, "utf8"),
        cert: fs.readFileSync(cert, "utf8"),
      },
      handler
    );
  }

  if (options.http) {
    return http.createServer(handler);
  }

  throw new Error("No server type specified in options.");
}
