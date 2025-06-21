export default class HttpError extends Error {
  public status: number;
  public details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;

    // Maintain proper stack trace (only works on V8 environments like Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      details: this.details,
    };
  }
}
