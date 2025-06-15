import http from "http";

export interface ResponseOptions {
  status?: number;
  headers?: Record<string, string>;
}

export class Response {
  private static _status: number = 200;
  private static _headers: Record<string, string> = {};
  private static _body: any = null;
  private static _res: http.ServerResponse;

  public static status(code: number): typeof Response {
    this._status = code;
    return this;
  }

  public static header(key: string, value: string): typeof Response {
    this._headers[key] = value;
    return this;
  }

  public static headers(headers: Record<string, string>): typeof Response {
    Object.entries(headers).forEach(([key, value]) => {
      this._headers[key] = value;
    });
    return this;
  }

  public static json(data: any, options?: ResponseOptions) {
    this.applyOptions(options);
    this._headers["Content-Type"] = "application/json";
    this._body = JSON.stringify(data);
    this.send();
    return true;
  }

  public static text(data: string, options?: ResponseOptions) {
    this.applyOptions(options);
    this._headers["Content-Type"] = "text/plain";
    this._body = data;
    this.send();
    return true;
  }

  public static html(data: string, options?: ResponseOptions) {
    this.applyOptions(options);
    this._headers["Content-Type"] = "text/html";
    this._body = data;
    this.send();
    return true;
  }

  public static buffer(
    buffer: Buffer,
    contentType: string,
    options?: ResponseOptions
  ) {
    if (!this._res) {
      throw new Error(
        "Server response object is not set. Call __setServerResponse first."
      );
    }
    this.applyOptions(options);

    this._headers["Content-Type"] = contentType;
    this._headers["Content-Length"] = buffer.length.toString();
    this._res.writeHead(this._status, this._headers);
    this._res.end(buffer);
    return true;
  }

  public static redirect(location: string, status: number = 302) {
    if (!this._res) {
      throw new Error(
        "Server response object is not set. Call __setServerResponse first."
      );
    }

    this._status = status;
    this._headers["Location"] = location;
    this.send();
    return true;
  }

  private static applyOptions(options?: ResponseOptions) {
    if (options) {
      if (options.status) {
        this.status(options.status);
      }
      if (options.headers) {
        this.headers(options.headers);
      }
    }
  }

  public static send(data?: any) {
    if (!this._res) {
      throw new Error(
        "Server response object is not set. Call __setServerResponse first."
      );
    }
    this._res.writeHead(this._status, this._headers);
    this._res.end(data || this._body);
    return true;
  }

  static __setServerResponse(res: http.ServerResponse) {
    this._res = res;
  }
}
declare global {
  var Res: typeof Response;
}
global.Res = Response as any;
