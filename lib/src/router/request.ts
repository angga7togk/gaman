import { CookieManager } from "../cookie";

export interface GamanRequest {
  method: string;
  url: string;
  pathname: string;
  headers: Record<string, string>;
  params: any;
  query: any;
  body: any;
  arrayBuffer: () => Promise<ArrayBuffer>
  bytes: () => Promise<Uint8Array<ArrayBuffer>>
  json: <T = any>() => Promise<T>;
  formData: <T = any>() => Promise<T>;
  ip: string;
  cookies: CookieManager;
  raw: any;
}
