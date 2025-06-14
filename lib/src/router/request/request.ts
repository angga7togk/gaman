export interface Request {
  method: string;
  url: string;
  pathname: string;
  headers: Record<any, any>;
  params: any;
  query: any;
  body: any;
  json: any;
  form: any;
  getJson: <T = any>() => T;
  getForm: <T = any>() => T;
  ip: string;
  cookies: any;
  raw: any;
}
