import { CookieManager } from "../cookie";

export interface ResponseOptions {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  cookies?: CookieManager;
}

export class Response {
  private _status: number;
  private _statusText: string;
  private _headers: Record<string, string>;
  private _body: any;
  private _cookies?: CookieManager;

  constructor(body?: any, options?: ResponseOptions) {
    this._status = options?.status || 200;
    this._statusText = options?.statusText || "";
    this._headers = options?.headers || {};
    this._body = body;
    if (options?.cookies) {
      this._cookies = options.cookies
      const serialized = options.cookies.serializeAll();
      this._headers["Set-Cookie"] = serialized
    }
    
  }

  public getStatus(): number {
    return this._status;
  }

  public getStatusText(): string {
    return this._statusText;
  }

  public getBody(): any {
    return this._body;
  }

  public getHeaders(): Record<string, string> {
    return this._headers;
  }

  public getOptions(): ResponseOptions {
    return {
      cookies: this._cookies,
      headers: this._headers,
      status: this._status,
      statusText: this._statusText,
    };
  }

  public static json(body: any, options?: ResponseOptions): Response {
    const defaultOptions: ResponseOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const expandedOptions = this.expandOptions(defaultOptions, options);
    return new Response(JSON.stringify(body), expandedOptions);
  }

  public static text(body: string, options?: ResponseOptions): Response {
    const defaultOptions: ResponseOptions = {
      headers: {
        "Content-Type": "text/plain",
      },
    };
    const expandedOptions = this.expandOptions(defaultOptions, options);
    return new Response(body, expandedOptions);
  }

  public static html(body: string, options?: ResponseOptions): Response {
    const defaultOptions: ResponseOptions = {
      headers: {
        "Content-Type": "text/html",
      },
    };
    const expandedOptions = this.expandOptions(defaultOptions, options);
    return new Response(body, expandedOptions);
  }

  public static buffer(
    buffer: Buffer,
    contentType: string,
    options?: ResponseOptions
  ): Response {
    const defaultOptions: ResponseOptions = {
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
      },
    };
    const expandedOptions = this.expandOptions(defaultOptions, options);
    return new Response(buffer, expandedOptions);
  }

  public static redirect(location: string, status: number = 302): Response {
    const defaultOptions: ResponseOptions = {
      status,
      headers: {
        Location: location,
      },
    };
    const expandedOptions = this.expandOptions(defaultOptions, {});
    return new Response("", expandedOptions);
  }

  private static expandOptions(
    defaults: ResponseOptions,
    options?: ResponseOptions
  ): ResponseOptions {
    const expandedOptions: ResponseOptions = {
      ...defaults,
      ...options,
      headers: {
        ...defaults.headers,
        ...options?.headers,
      },
    };
    return expandedOptions;
  }
}
