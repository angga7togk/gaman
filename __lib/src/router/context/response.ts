import express from "express";

export interface MydResponse extends express.Response {}

export function middlewareMydResponse(
  req: express.Request,
  res: any,
  next: express.NextFunction
) {
  next();
}