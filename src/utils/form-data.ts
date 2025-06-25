export interface FormDataEntryValue {
  filename?: string;
  mimetype?: string;
  name: string;
  isFile: boolean;
  value: string | Blob;
}

export class FormData {
  private fields: Map<string, FormDataEntryValue[]>;

  constructor(defaultData: Map<string, FormDataEntryValue[]> = new Map()) {
    this.fields = defaultData;
  }

  delete(name: string): void {
    this.fields.delete(name);
  }

  get(name: string): FormDataEntryValue | null {
    const values = this.fields.get(name);
    return values ? values[0] || null : null;
  }

  getAll(name: string): FormDataEntryValue[] {
    return this.fields.get(name) || [];
  }

  has(name: string): boolean {
    return this.fields.has(name);
  }

  set(name: string, value: FormDataEntryValue) {
    if (this.has(name)) {
      const values = this.fields.get(name)!;
      this.fields.set(name, [...values, value]);
    }
    this.fields.set(name, [value]);
  }

  setAll(name: string, values: FormDataEntryValue[]) {
    if (this.has(name)) {
      const _values = this.fields.get(name)!;
      this.fields.set(name, [..._values, ...values]);
    }
    this.fields.set(name, values);
  }

  entries(): IterableIterator<[string, FormDataEntryValue]> {
    const flattenedEntries: [string, FormDataEntryValue][] = [];
    for (const [name, values] of this.fields.entries()) {
      values.forEach((value) => flattenedEntries.push([name, value]));
    }
    return flattenedEntries[Symbol.iterator]();
  }

  keys(): IterableIterator<string> {
    return this.fields.keys();
  }

  values(): IterableIterator<FormDataEntryValue> {
    const flattenedValues: FormDataEntryValue[] = [];
    for (const values of this.fields.values()) {
      flattenedValues.push(...values);
    }
    return flattenedValues[Symbol.iterator]();
  }
}
