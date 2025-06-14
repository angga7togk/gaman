import http from "http";

import formidable from "formidable";

export async function parseMultipartForm(
  req: http.IncomingMessage
): Promise<{
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
