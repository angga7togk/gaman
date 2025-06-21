import type { AppConfig, Context} from "./types";

export interface ResponseOptions<A extends AppConfig> {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  context?: Context<A>
}

export class Response<A extends AppConfig> {
  private _status: number;
  private _statusText: string;
  private _headers: Record<string, string>;
  private _body: any;
  private _context?: Context<A>

  constructor(body?: any, options?: ResponseOptions<A>) {
    this._status = options?.status || 200;
    this._statusText = options?.statusText || "";
    this._headers = options?.headers || {};
    this._body = body;
    if (options?.context) {
      this._context = options.context;
      const serialized = options.context.cookies.serializeAll();
      this._headers["Set-Cookie"] = serialized;
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
  public getContext(): Context<A> | undefined{
    return this._context
  }

  public getOptions(): ResponseOptions<A> {
    return {
      context: this._context,
      headers: this._headers,
      status: this._status,
      statusText: this._statusText,
    };
  }

  public static json<A extends AppConfig>(body: any, options?: ResponseOptions<A>): Response<A> {
    const defaultOptions: ResponseOptions<A> = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const expandedOptions = this.expandOptions(defaultOptions, options);
    return new Response(JSON.stringify(body), expandedOptions);
  }

  public static text<A extends AppConfig>(body: string, options?: ResponseOptions<A>): Response<A> {
    const defaultOptions: ResponseOptions<A> = {
      headers: {
        "Content-Type": "text/plain",
      },
    };
    const expandedOptions = this.expandOptions(defaultOptions, options);
    return new Response(body, expandedOptions);
  }

  public static html<A extends AppConfig>(body: string, options?: ResponseOptions<A>): Response<A> {
    const defaultOptions: ResponseOptions<A> = {
      headers: {
        "Content-Type": "text/html",
      },
    };
    const expandedOptions = this.expandOptions(defaultOptions, options);
    return new Response(body, expandedOptions);
  }

  public static buffer<A extends AppConfig>(
    buffer: Buffer,
    contentType: string,
    options?: ResponseOptions<A>
  ): Response<A> {
    const defaultOptions: ResponseOptions<A> = {
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
      },
    };
    const expandedOptions = this.expandOptions(defaultOptions, options);
    return new Response(buffer, expandedOptions);
  }

  public static redirect<A extends AppConfig>(location: string, status: number = 302): Response<A> {
    const defaultOptions: ResponseOptions<A> = {
      status,
      headers: {
        Location: location,
      },
    };
    const expandedOptions = this.expandOptions(defaultOptions, {});
    return new Response("", expandedOptions);
  }

  private static expandOptions<A extends AppConfig>(
    defaults: ResponseOptions<A>,
    options?: ResponseOptions<A>
  ): ResponseOptions<A> {
    const expandedOptions: ResponseOptions<A> = {
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
