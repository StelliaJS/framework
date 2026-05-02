import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  platform: "node",
  dts: true,
  format: "esm",
  alias: {
    "@client": "./src/client",
    "@constants": "./src/constants",
    "@managers": "./src/managers",
    "@structures": "./src/structures",
    "@typescript": "./src/typescript",
    "@utils": "./src/utils",
  }
});
