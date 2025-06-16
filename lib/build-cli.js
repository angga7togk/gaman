import esbuild from "esbuild";

esbuild.build({
  entryPoints: ['./src/cli/dev.ts'], // Entry file utama
  bundle: true, // Semua file akan di-bundle
  platform: 'node', // Target environment Node.js
  target: 'es2020', // Target versi ECMAScript
  outfile: './dist/cli.cjs', // Lokasi output file
  external: ["nodemon"], // Kosongkan untuk memastikan semua dependensi di-bundle
}).catch(() => process.exit(1));
