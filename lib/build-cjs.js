import esbuild from "esbuild";

// Konfigurasi untuk membangun proyek menggunakan esbuild
esbuild
  .build({
    entryPoints: ["./src/index.ts"], // File utama (entry point) untuk memulai proses build
    bundle: true, // Menggabungkan semua dependensi menjadi satu file output
    platform: "node", // Menentukan target platform sebagai Node.js
    target: "esnext", // Target fitur ECMAScript modern (ESNext)
    outdir: "./dist/cjs", // Direktori output untuk hasil build (dalam format CommonJS)
    external: [], // Kosongkan untuk memastikan semua dependensi di-bundle (jika diperlukan)
    format: "cjs", // Output dalam format CommonJS (CJS)
  })
  .catch(() => process.exit(1)); // Menangani error jika build gagal
