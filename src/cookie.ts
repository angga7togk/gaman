import cookie, { type SerializeOptions } from "cookie";

export interface CookieOptions extends Omit<SerializeOptions, "expires"> {
  expires?: Date | string | number; // Override properti `expires`
}

export class CookieManager {
  private cookies: Record<string, string | undefined> = {};

  constructor(cookieString: string = "") {
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

    this.cookies[name] = value;

    const serialized = cookie.serialize(name, value, {
      ...options,
      expires,
    });

    // Menyimpan cookie yang diserialisasi sebagai string (untuk penggunaan `serializeAll`)
    this.cookies[`${name}_serialized`] = serialized;
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
   * @returns All cookies
   */
  getAll(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(this.cookies)) {
      if (!key.endsWith("_serialized")) {
        result[key] = value || "";
      }
    }
    return result;
  }

  /**
   * Serialize all cookies into a string
   * @returns Serialized cookies string
   */
  serializeAll(): string {
    return Object.entries(this.cookies)
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
  }

  private parseExpires(expires: string | number): Date {
    if (typeof expires === "number") {
      // Jika berupa angka, anggap sebagai milidetik dari sekarang
      return new Date(Date.now() + expires);
    }

    if (typeof expires === "string") {
      // Parsing string seperti "1h", "2d", dll.
      const match = expires.match(/^(\d+)([smhdw])$/i);
      if (!match) {
        throw new Error("Invalid expires format. Use '1h', '2d', or a number.");
      }

      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();

      const multiplier: Record<string, number> = {
        s: 1000, // seconds
        m: 1000 * 60, // minutes
        h: 1000 * 60 * 60, // hours
        d: 1000 * 60 * 60 * 24, // days
        w: 1000 * 60 * 60 * 24 * 7, // weeks
      };

      return new Date(Date.now() + value * (multiplier[unit] || 0));
    }

    throw new Error(
      "Invalid expires format. Use a number or a string like '1h'."
    );
  }
}

export const Cookies = new CookieManager();
