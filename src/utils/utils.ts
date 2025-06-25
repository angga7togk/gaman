export function formatPath(path: string): string {
  let formattedPath = path
    // Pastikan tidak ada duplikasi slash
    .replace(/\/+/g, "/")
    // Hapus wildcard di tengah selain yang diawali atau diakhiri
    .replace(/\/\*(?!\/|$)/g, "/")
    .replace(/(?!^|\/)\*(?=\/)/g, "/")
    // Hapus trailing slash kecuali hanya "/"
    .replace(/\/$/, "");

  // Tambahkan "/" di awal jika hilang
  if (!formattedPath.startsWith("/")) {
    formattedPath = `/${formattedPath}`;
  }

  // Jika kosong, tetap kembalikan "/"
  if (formattedPath === "") {
    formattedPath = "/";
  }
  
  return formattedPath;
}


/**
 * Validates if a string contains valid HTML.
 * @param str - The string to validate.
 * @returns True if the string is HTML, otherwise false.
 */
export function isHtmlString(str: string): boolean {
  if (typeof str !== "string") return false;

  // Regular expression to match basic HTML tags
  const htmlRegex = /<\/?[a-z][\s\S]*>/i;

  return htmlRegex.test(str.trim());
}

/**
 * Sorts an array of objects based on a specified key.
 * 
 * @param array - The array to sort.
 * @param key - The key to sort by.
 * @param order - Sorting order: 'asc' (ascending) or 'desc' (descending). Default is 'asc'.
 * @returns A sorted array.
 */
export function sortArray<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === bValue) return 0;

    const comparison = aValue > bValue ? 1 : -1;

    return order === 'asc' ? comparison : -comparison;
  });
}


/**
 * Encode data to Base64URL format
 * @param data - Data to encode
 */
export function base64UrlEncode(data: string): string {
  return Buffer.from(data)
    .toString('base64')
    .replace(/=/g, '') // Remove padding
    .replace(/\+/g, '-') // Replace "+" with "-"
    .replace(/\//g, '_'); // Replace "/" with "_"
}
