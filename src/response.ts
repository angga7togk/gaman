import type { AppConfig, Context } from "./types";

export interface ResponseOptions<A extends AppConfig> {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  context?: Context<A>;
}

export type RenderResponse<A extends AppConfig> = {
  viewName: string;
  viewData: Record<string, any>;
  responseOptions?: ResponseOptions<A>;
};

export class Response<A extends AppConfig> {
  public status: number;
  public statusText: string;
  public headers: Record<string, string>;
  public body: any;
  public context?: Context<A>;

  constructor(body?: any, options?: ResponseOptions<A>) {
    this.status = options?.status || 200;
    this.statusText = options?.statusText || "";
    this.headers = options?.headers || {};
    this.body = body;
    if (options?.context) {
      this.context = options.context;
      const serialized = options.context.cookies.serializeAll();
      this.headers["Set-Cookie"] = serialized;
    }
  }

  public getOptions(): ResponseOptions<A> {
    return {
      context: this.context,
      headers: this.headers,
      status: this.status,
      statusText: this.statusText,
    };
  }

  public static json<A extends AppConfig>(
    body: any,
    options?: ResponseOptions<A>
  ): Response<A> {
    const defaultOptions: ResponseOptions<A> = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const expandedOptions = this.expandOptions(defaultOptions, options);
    return new Response(JSON.stringify(body), expandedOptions);
  }

  public static text<A extends AppConfig>(
    body: string,
    options?: ResponseOptions<A>
  ): Response<A> {
    const defaultOptions: ResponseOptions<A> = {
      headers: {
        "Content-Type": "text/plain",
      },
    };
    const expandedOptions = this.expandOptions(defaultOptions, options);
    return new Response(body, expandedOptions);
  }

  public static html<A extends AppConfig>(
    body: string,
    options?: ResponseOptions<A>
  ): Response<A> {
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

  public static redirect<A extends AppConfig>(
    location: string,
    status: number = 302
  ): Response<A> {
    const defaultOptions: ResponseOptions<A> = {
      status,
      headers: {
        Location: location,
      },
    };
    const expandedOptions = this.expandOptions(defaultOptions, {});
    return new Response("", expandedOptions);
  }

  public static render<A extends AppConfig>(
    viewName: string,
    viewData: Record<string, any> = {},
    responseOptions?: ResponseOptions<A>
  ): RenderResponse<A> {
    return {
      viewName,
      viewData,
      responseOptions,
    };
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
