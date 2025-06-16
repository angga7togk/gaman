import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["./src/cli/dev.ts"], // Entry file utama
    bundle: true, // Semua file akan di-bundle
    platform: "node", // Target environment Node.js
    target: "es2020", // Target versi ECMAScript
    format: "esm", // Output dalam format ESM
    outfile: "./dist/dev.js", // Lokasi output file
    banner: {
      js: `
        import { createRequire as _createRequire } from "module";
        const require = _createRequire(import.meta.url);
        import { fileURLToPath } from "url";
        import path from "path";
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
      `,
    },
  })
  .catch(() => process.exit(1));
