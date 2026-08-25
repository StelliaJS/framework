import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["./src/index.ts"],
	platform: "node",
	format: ["esm"],
	target: "es2025",
	clean: true,
	dts: {
		oxc: true
	},
	unused: false
});
