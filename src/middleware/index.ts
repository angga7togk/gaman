import type { AppConfig, Handler, NextResponse } from "../types";

export function defineMiddleware<A extends AppConfig = AppConfig>(
  handler: Handler<A>
): NextResponse<A> {
  return handler;
}

export { basicAuth } from "./basic-auth";
export { cors } from "./cors";
