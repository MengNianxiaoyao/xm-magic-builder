import typescriptEslint from "typescript-eslint";

export default [
    {
        ignores: ["dist/**", "out/**", "node_modules/**", "*.js"],
    },
    {
        files: ["**/*.ts"],
        plugins: {
            "@typescript-eslint": typescriptEslint.plugin,
        },
        languageOptions: {
            parser: typescriptEslint.parser,
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/naming-convention": ["warn", {
                selector: "import",
                format: ["camelCase", "PascalCase"],
            }],
            curly: "error",
            eqeqeq: "error",
            "no-throw-literal": "error",
            semi: "warn",
            "prefer-const": "error",
        },
    },
];