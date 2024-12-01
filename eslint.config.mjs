import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        plugins: {
            jest: jestPlugin,
        },
        rules: {
            'no-await-in-loop': 'error',
            'no-useless-escape': 'error',
            'no-constant-condition': ['error', { checkLoops: false }],
            'no-alert': 'error',
            eqeqeq: ['error', 'always', { null: 'ignore' }],
            'default-case': 'error',
            'array-callback-return': 'error',
            'require-atomic-updates': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-namespace': 'off',
            'node/no-missing-import': 'off',
            'node/no-unpublished-import': 'off',
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
];
