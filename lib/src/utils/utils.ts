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
