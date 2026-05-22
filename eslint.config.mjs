import typescriptEslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default typescriptEslint.config(
    {
        ignores: ['dist/**', 'out/**', 'node_modules/**', 'esbuild.js'],
    },
    ...typescriptEslint.configs.recommendedTypeChecked,
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
    prettierConfig,
);
