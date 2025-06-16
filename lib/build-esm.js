import esbuild from "esbuild";

// Konfigurasi untuk membangun proyek menggunakan esbuild
esbuild.build({
  entryPoints: ["./src/index.ts"], // File utama (entry point) untuk memulai proses build
  bundle: true, // Menggabungkan semua dependensi menjadi satu file output
  platform: "node", // Menentukan target platform sebagai Node.js
  target: "esnext", // Target fitur ECMAScript modern (ESNext)
  outdir: "./dist/esm", // Direktori output untuk hasil build
  external: [], // Kosongkan untuk memastikan semua dependensi di-bundle (jika diperlukan)
  format: "esm", // Output dalam format ESM (ECMAScript Module)
  banner: {
    // Menambahkan kode JavaScript di awal file output
    js: 'import { createRequire as _createRequire } from "module"; const require = _createRequire(import.meta.url);',
    // Penjelasan:
    // Banner ini memungkinkan penggunaan `require` dalam file ESM,
    // dengan memanfaatkan fungsi `createRequire` dari modul "module".
  },
}).catch(() => process.exit(1)); // Menangani error jika build gagal
