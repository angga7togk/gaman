import cookie, { type SerializeOptions } from "cookie";
import crypto from "crypto";
import { base64UrlEncode } from "./utils";

export interface CookieOptions extends Omit<SerializeOptions, "expires"> {
  expires?: Date | string | number; // Override properti `expires`
}

export class Cookie {
  private cookies: Record<string, string | undefined> = {};
  private cookiesSetted: Record<string, string> = {}; // Hanya menyimpan cookie yang di-set

  constructor(cookieString: string = "", private secret: string = "") {
    this.cookies = cookie.parse(cookieString); // Parse cookies dari string
  }

  /**
   * Set a cookie
   * @param name Cookie name
   * @param value Cookie value
   * @param options Cookie options
   */
  set(name: string, value: string, options?: CookieOptions): void {
    let expires: Date | undefined;

    if (options?.expires) {
      expires =
        typeof options.expires === "string" ||
        typeof options.expires === "number"
          ? this.parseExpires(options.expires)
          : options.expires;
    }

    const serialized = cookie.serialize(name, value, {
      ...options,
      expires,
    });

    // Menyimpan cookie yang di-set ke cookixsSetted
    this.cookiesSetted[name] = serialized;

    // Menyimpan nilai plain cookie ke cookies biasa
    this.cookies[name] = value;
  }

  /**
   * Get a cookie by name
   * @param name Cookie name
   * @returns The cookie value, or undefined if not found
   */
  get(name: string): string | undefined {
    return this.cookies[name];
  }

  /**
   * Check if a cookie exists
   * @param name Cookie name
   * @returns True if the cookie exists, false otherwise
   */
  has(name: string): boolean {
    return this.cookies.hasOwnProperty(name);
  }

  /**
   * Get all cookies as an object
   * Combines cookies parsed and cookies set explicitly.
   * @returns All cookies
   */
  getAll(): Record<string, string | undefined> {
    return { ...this.cookies };
  }

  /**
   * Serialize all cookies into a string
   * @returns Serialized cookies string (only from `cookiesSetted`)
   */
  serializeAll(): string {
    return Object.entries(this.cookiesSetted)
      .filter(([key]) => key.endsWith("_serialized"))
      .map(([, value]) => value)
      .join("; ");
  }

  /**
   * Remove a cookie by setting it to an empty value and an expired date
   * @param name Cookie name
   * @param options Cookie options
   */
  remove(name: string, options: CookieOptions = {}): void {
    this.set(name, "", { ...options, expires: new Date(0) });
    delete this.cookiesSetted[name]; // Hapus dari cookiesSetted
    delete this.cookies[name]; // Hapus dari cookies biasa
  }

  private parseExpires(expires: string | number): Date {
    if (typeof expires === "number") {
      return new Date(Date.now() + expires);
    }

    if (typeof expires === "string") {
      const match = expires.match(/^(\d+)([smhdw])$/i);
      if (!match) {
        throw new Error("Invalid expires format. Use '1h', '2d', or a number.");
      }

      const value = parseInt(match[1]!, 10);
      const unit = match[2]!.toLowerCase();

      const multiplier: Record<string, number> = {
        s: 1000,
        m: 1000 * 60,
        h: 1000 * 60 * 60,
        d: 1000 * 60 * 60 * 24,
        w: 1000 * 60 * 60 * 24 * 7,
      };

      return new Date(Date.now() + value * (multiplier[unit] || 0));
    }

    throw new Error(
      "Invalid expires format. Use a number or a string like '1h'."
    );
  }

  /**
   * Create a JWT token
   * @param payload - Data to include in the token
   * @param secret - Secret key for signing the token
   * @param alg - Algorithm (default: HS256)
   */
  private createSignature(payload: object): string {
    // Encode Payload
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    const signature = crypto
      .createHmac("sha256", this.secret) // Use HMAC-SHA256 (HS256)
      .update(encodedPayload)
      .digest("base64");

    const encodedSignature = base64UrlEncode(signature);

    // Combine all parts
    return `${encodedPayload}.${encodedSignature}`;
  }

  /**
   * Verify a JWT token
   * @param token - JWT token
   * @param secret - Secret key for verification
   */
  private verifySignature(token: string): boolean {
    const [payload, signature] = token.split(".");
    const expectedSignature = crypto
      .createHmac("sha256", this.secret)
      .update(payload)
      .digest("base64");
    return base64UrlEncode(expectedSignature) === signature;
  }
}
