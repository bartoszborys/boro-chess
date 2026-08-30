const esbuild = require("esbuild");
const path = require("path");

esbuild
  .build({
    entryPoints: [path.join(__dirname, "ConsoleMain.ts")],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile: path.join(__dirname, "dist/index.js"),
    sourcemap: true,
    alias: {
      "@": path.join(__dirname, "../.."),
    },
  })
  .catch(() => process.exit(1));
