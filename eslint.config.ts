import js from "@eslint/js";
import globals from "globals";
import ts from "typescript-eslint";
import importPlugin from "eslint-plugin-import-x";
import prettierConfig from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: {
			globals: globals.node
		}
	},
	ts.configs.recommended,
	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.typescript,
	prettierConfig,
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		plugins: {
			import: importPlugin
		},
		languageOptions: {
			parserOptions: {
				project: "./tsconfig.json",
				sourceType: "module",
				ecmaVersion: "latest"
			}
		},
		rules: {
			"import/namespace": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			"import/order": [
				"error",
				{
					groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "object", "type"],
					pathGroups: [
						{
							pattern: "@/**",
							group: "internal"
						}
					],
					pathGroupsExcludedImportTypes: ["builtin"],
					alphabetize: {
						order: "asc",
						caseInsensitive: true
					}
				}
			],
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					prefer: "type-imports",
					fixStyle: "inline-type-imports"
				}
			],
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					ignoreRestSiblings: true
				}
			],
			"sort-imports": [
				"error",
				{
					ignoreCase: true,
					ignoreDeclarationSort: true,
					ignoreMemberSort: false,
					memberSyntaxSortOrder: ["none", "all", "multiple", "single"]
				}
			],
			"import/newline-after-import": ["error", { count: 1 }],
			"import/no-unresolved": "error",
			"import/no-duplicates": "error",
			"no-console": "off",
			"no-var": "error",
			"prefer-const": "error"
		},
		settings: {
			"import/resolver": {
				typescript: {
					alwaysTryTypes: true,
					project: "./tsconfig.json"
				},
				node: {
					extensions: [".js", ".ts"]
				}
			}
		}
	}
]);
