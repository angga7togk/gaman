import { CookieManager } from "../cookie";
import { GamanFormData } from "../formdata";

export interface GamanRequest {
  method: string;
  url: string;
  pathname: string;
  headers: Record<string, string>;
  params: any;
  query: any;
  body: any;
  json: <T = any>() => Promise<T>;
  formData: () => Promise<GamanFormData>;
  ip: string;
  cookies: CookieManager;
  raw: any;
}
