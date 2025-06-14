import express from "express";

export interface MydNextFunction extends express.NextFunction {}

export function middlewareMydNextFunction(
  req: express.Request,
  res: express.Response,
  next: any
) {
  next();
}
