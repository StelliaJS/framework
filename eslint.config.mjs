import _import from "eslint-plugin-import";
import nPlugin from "eslint-plugin-n";
import prettierPlugin from "eslint-plugin-prettier";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
    js.configs.recommended,
    {
        languageOptions: {
            globals: { ...globals.node },
            ecmaVersion: "latest",
            sourceType: "module",
        },
        plugins: {
            import: _import,
            n: nPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            "import/order": [
                "error",
                {
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                    "newlines-between": "always",
                    alphabetize: { order: "asc", caseInsensitive: true },
                },
            ],
            "no-console": "off",
            "prettier/prettier": "error",
        },
        settings: {
            "import/resolver": {
                node: { extensions: [".js", ".ts"] },
            },
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: typescriptParser,
            ecmaVersion: "latest",
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": typescriptPlugin,
        },
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
            "no-console": "off",
            "prettier/prettier": [
                "error",
                {
                    endOfLine: "lf",
                }
            ],
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
