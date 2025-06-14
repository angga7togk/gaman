import esbuild from "esbuild";

esbuild.build({
  entryPoints: ['./src/index.ts'], // Entry file utama
  bundle: true, // Semua file akan di-bundle
  platform: 'node', // Target environment Node.js
  target: 'es2020', // Target versi ECMAScript
  outfile: './dist/index.js', // Lokasi output file
  external: [], // Kosongkan untuk memastikan semua dependensi di-bundle
}).catch(() => process.exit(1));
