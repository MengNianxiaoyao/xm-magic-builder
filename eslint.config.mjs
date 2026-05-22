import typescriptEslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default typescriptEslint.config(
    {
        ignores: ['dist/**', 'out/**', 'node_modules/**', 'esbuild.js'],
    },
    ...typescriptEslint.configs.recommendedTypeChecked.map((config) => ({
        ...config,
        files: ['**/*.ts'],
    })),
    {
        files: ['**/*.ts'],
        plugins: {
            prettier,
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/naming-convention': [
                'warn',
                {
                    selector: 'import',
                    format: ['camelCase', 'PascalCase'],
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                },
            ],
            '@typescript-eslint/only-throw-error': 'error',
            'curly': 'error',
            'eqeqeq': 'error',
            'prefer-const': 'error',
            'prettier/prettier': 'error',
        },
    },
    {
        files: ['resources/js/**/*.js'],
        plugins: {
            prettier,
        },
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'script',
            globals: {
                acquireVsCodeApi: 'readonly',
                console: 'readonly',
                window: 'readonly',
                document: 'readonly',
                FileReader: 'readonly',
                Uint8Array: 'readonly',
            },
        },
        rules: {
            'curly': 'error',
            'eqeqeq': 'error',
            'no-var': 'error',
            'no-undef': 'error',
            'prefer-const': 'error',
            'prettier/prettier': 'error',
        },
    },
    prettierConfig,
);
