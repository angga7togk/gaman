export class Headers {
  private setterHeaders: Record<string, any> = {};

  constructor(private readonly headers: Record<string, any>) {}

  /**
   * Override `get` method to ensure case-insensitive key lookup.
   * @param key - The key to look up in the Map.
   * @returns The value associated with the key, or undefined if not found.
   */
  get(key: string): any {
    // Normalize the key to lowercase before performing the lookup
    return this.headers[key.toLowerCase()];
  }

  /**
   * Override `set` method to ensure keys are stored in lowercase.
   * @param key - The key to set in the Map.
   * @param value - The value to associate with the key.
   * @returns The Headers instance, to allow method chaining.
   */
  set(key: string, value: any): this {
    this.setterHeaders[key.toLowerCase()] = value;
    return this;
  }

  has(key: string): boolean {
    return key in this.headers || key in this.setterHeaders;
  }

  delete(key: string): boolean {
    if (!(key in this.setterHeaders)) return false;
    delete this.setterHeaders[key];
    return true;
  }

  __getSetterData(): Record<string, any> {
    return this.setterHeaders;
  }
}
