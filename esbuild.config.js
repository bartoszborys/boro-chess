const esbuild = require("esbuild");
const path = require("path");

esbuild
  .build({
    entryPoints: [path.join(__dirname, "src/index.ts")],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile: path.join(__dirname, "dist/index.js"),
    sourcemap: true,
    alias: {
      "@": path.join(__dirname, "src"),
    },
  })
  .catch(() => process.exit(1));
