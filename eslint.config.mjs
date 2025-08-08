import path from "node:path";
import { fileURLToPath } from "node:url";
import _import from "eslint-plugin-import";
import { defineConfig } from "eslint/config";
import globals from "globals";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default defineConfig([
	{
		languageOptions: {
			globals: {
				...globals.node
			},

			ecmaVersion: "latest",
			sourceType: "module",
			parserOptions: {}
		},

		plugins: {
			import: fixupPluginRules(_import)
		},

		extends: fixupConfigRules(
			compat.extends(
				"eslint:recommended",
				"plugin:import/recommended",
				"plugin:n/recommended",
				"prettier"
			)
		),

		rules: {
			"import/order": [
				"error",
				{
					groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
					"newlines-between": "always",

					alphabetize: {
						order: "asc",
						caseInsensitive: true
					}
				}
			],

			"no-console": "off"
		},

		settings: {
			"import/resolver": {
				node: {
					extensions: [".js"]
				}
			}
		}
	}
]);
