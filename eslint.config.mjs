import typescriptEslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const tsRules = {
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
};

export default typescriptEslint.config(
    {
        ignores: ['dist/**', 'out/**', 'node_modules/**', 'esbuild.js'],
    },
    ...typescriptEslint.configs.recommendedTypeChecked.map((config) => ({
        ...config,
        files: ['**/*.ts'],
    })),
    {
        files: ['src/backend/**/*.ts', 'src/shared/**/*.ts'],
        plugins: {
            prettier,
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: tsRules,
    },
    {
        files: ['src/frontend/**/*.ts'],
        plugins: {
            prettier,
        },
        languageOptions: {
            parserOptions: {
                projectService: false,
            },
        },
        rules: {
            ...typescriptEslint.configs.disableTypeChecked.rules,
            'curly': 'error',
            'eqeqeq': 'error',
            'prefer-const': 'error',
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },
    prettierConfig,
);
