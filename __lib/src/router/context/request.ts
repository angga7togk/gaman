import express from "express";

export interface MydRequest extends express.Request {
  json: <T = any>() => T;
}

export function middlewareTiyRequest(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let rawData = "";

  req.on("data", (chunk) => {
    rawData += chunk;
  });

  req.on("end", () => {
    try {
      (req as MydRequest).json = function <T = any>(): T {
        return rawData ? JSON.parse(rawData) : ({} as T);
      };
    } catch (error) {
      return req.body;
    }
    next();
  });

  req.on("error", () => {
    res.status(500).json({ error: "Error reading request body" });
  });
}
