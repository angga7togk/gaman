import type { AppConfig, Handler, NextResponse } from "../types";

export function defineMiddleware<A extends AppConfig = AppConfig>(
  handler: Handler<A>
): Handler<A> {
  return handler;
}