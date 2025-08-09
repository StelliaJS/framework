import js from "@eslint/js";
import ts from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";

export default ts.config(
    js.configs.recommended,
    ts.configs.recommended,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    prettierConfig,
    {
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
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/no-explicit-any": "warn",
            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        ["parent", "sibling", "index"],
                        "object",
                        "type"
                    ],
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
);
