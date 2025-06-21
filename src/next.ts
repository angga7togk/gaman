import type { AppConfig, NextResponse } from "./types";

export function next<A extends AppConfig>(): NextResponse<A> {
  return undefined;
}
