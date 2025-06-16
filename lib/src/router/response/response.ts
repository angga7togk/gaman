import http from "http";

export interface ResponseOptions {
  status?: number;
  headers?: Record<string, string>;
}

export class Response {
  private _status: number;
  private _headers: Record<string, string>;
  private _body: any;
  private static _res: http.ServerResponse;

  constructor(body?: any, options?: ResponseOptions) {
    this._status = options?.status || 200;
    this._headers = options?.headers || {};
    this._body = body;
    
  }

  public status(code: number): this {
    this._status = code;
    return this;
  }

  public header(key: string, value: string): this {
    this._headers[key] = value;
    return this;
  }

  public headers(headers: Record<string, string>): this {
    Object.assign(this._headers, headers);
    return this;
  }

  public json(data: any, options?: ResponseOptions): void {
    this._headers["Content-Type"] = "application/json";
    this._body = JSON.stringify(data);
    this.applyOptions(options);
    this.send();
  }

  public text(data: string, options?: ResponseOptions): void {
    this._headers["Content-Type"] = "text/plain";
    this._body = data;
    this.applyOptions(options);
    this.send();
  }

  public html(data: string, options?: ResponseOptions): void {
    this._headers["Content-Type"] = "text/html";
    this._body = data;
    this.applyOptions(options);
    this.send();
  }

  public buffer(buffer: Buffer, contentType: string, options?: ResponseOptions): void {
    this._headers["Content-Type"] = contentType;
    this._headers["Content-Length"] = buffer.length.toString();
    this.applyOptions(options);
    this.send(buffer);
  }

  public redirect(location: string, status: number = 302): void {
    this._status = status;
    this._headers["Location"] = location;
    this.send();
  }

  private applyOptions(options?: ResponseOptions): void {
    if (options?.status) this.status(options.status);
    if (options?.headers) this.headers(options.headers);
  }

  public send(data?: any): void {
    if (!Response._res) {
      throw new Error("Server response object is not set. Call __createHttpResponse first.");
    }
    if (Response._res.finished) return;

    const finalBody = data || this._body;
    Response._res.writeHead(this._status, this._headers);
    Response._res.end(finalBody);
  }

  /**
   * Static methods for quick response
   */
  static json(data: any, options?: ResponseOptions): void {
    new Response(data, options).json(data, options);
  }

  static text(data: string, options?: ResponseOptions): void {
    new Response(data, options).text(data, options);
  }

  static html(data: string, options?: ResponseOptions): void {
    new Response(data, options).html(data, options);
  }

  static buffer(buffer: Buffer, contentType: string, options?: ResponseOptions): void {
    new Response().buffer(buffer, contentType, options);
  }

  static redirect(location: string, status: number = 302): void {
    new Response().redirect(location, status);
  }

  /**
   * Set the global response object
   */
  static __createHttpResponse(res: http.ServerResponse): void {
    this._res = res;
  }
}
