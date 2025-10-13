import { defineConfig } from 'eslint/config';
import parserTs from '@typescript-eslint/parser';
import pluginStylistic from '@stylistic/eslint-plugin';
import pluginTsLint from '@typescript-eslint/eslint-plugin';

const baseConfig = {
    rules: {
        'arrow-body-style': 'off',
        'no-bitwise':       'off',
        'no-plusplus':      'off',
    },
};

const stylisticConfig = {
    plugins: {
        '@stylistic': pluginStylistic,
    },

    rules: {
        '@stylistic/arrow-parens': ['error', 'always'],
        '@stylistic/brace-style':  ['error', '1tbs'],
        '@stylistic/comma-dangle': ['error', 'always-multiline'],
        '@stylistic/comma-spacing': 'error',
        '@stylistic/indent':       ['error', 4],

        '@stylistic/key-spacing': ['error', {
            'afterColon':  true,
            'beforeColon': false,
            'mode':        'minimum',
        }],

        '@stylistic/max-len': ['warn', {
            'code':     120,
            'tabWidth': 4,

            'ignoreComments':         true,
            'ignoreUrls':             true,
            'ignoreStrings':          true,
            'ignoreTemplateLiterals': true,
            'ignoreRegExpLiterals':   true,
            'ignorePattern':          '(d="([\\s\\S]*?)"|data:image/[^;]+;base64)',
        }],

        '@stylistic/member-delimiter-style': ['error', {
            'multiline': {
                'delimiter': 'semi',
                'requireLast': true,
            },

            'singleline': {
                'delimiter': 'semi',
                'requireLast': true,
            },

            'multilineDetection': 'brackets',
        }],

        '@stylistic/no-multiple-empty-lines': ['error', {
            max:    1,
            maxEOF: 1,
            maxBOF: 0,
        }],

        '@stylistic/no-multi-spaces': ['error', {
            'exceptions': {
                'ArrayExpression':      true,
                'AssignmentExpression': true,
                'TSTypeAnnotation':     true,
                'TSEnumMember':         true,
                'VariableDeclarator':   true,
            },
        }],

        '@stylistic/no-whitespace-before-property': 'error',

        '@stylistic/object-curly-newline': ['error', {
            'ObjectExpression': {
                'minProperties': 3,
                'multiline':     true,
                'consistent':    true,
            },

            'ObjectPattern': {
                'minProperties': 3,
                'multiline':     true,
                'consistent':    true,
            },

            'ImportDeclaration': {
                'minProperties': 4,
                'multiline':     true,
                'consistent':    true,
            },

            'ExportDeclaration': {
                'minProperties': 4,
                'multiline':     true,
                'consistent':    true,
            },
        }],

        '@stylistic/padded-blocks': ['error', 'never'],

        '@stylistic/quotes': ['error', 'single', {
            'allowTemplateLiterals': 'always',
        }],

        '@stylistic/semi':   ['error', 'always'],

        '@stylistic/semi-spacing': 'error',

        '@stylistic/space-before-function-paren': ['error', {
            'anonymous':  'always',
            'named':      'never',
            'asyncArrow': 'always',
        }],

        '@stylistic/no-trailing-spaces': 'error',
    },
};

const tsConfig = {
    files: ['**/*.ts'],

    languageOptions: {
        parser: parserTs,
        parserOptions: {
            ecmaVersion: 2023,
            sourceType: 'module',
            project: ['./tsconfig.json'],
        },
    },

    plugins: {
        '@typescript-eslint': pluginTsLint,
    },

    rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',

        '@typescript-eslint/consistent-type-imports': ['error', {
            'disallowTypeAnnotations': false,
            'prefer':                  'type-imports',
        }],

        '@typescript-eslint/no-unused-vars': ['warn', {
            'vars': 'all',
            'args': 'after-used',

            'ignoreRestSiblings':        true,
            'argsIgnorePattern':         '^_',
            'caughtErrorsIgnorePattern': '^_',
        }],

        '@typescript-eslint/no-import-type-side-effects': 'error',
    },
};

const ignoresConfig = {
    ignores: [
        '**/dist',
        '**/node_modules',
    ],
};

export default defineConfig([
    pluginTsLint.configs['flat/eslint-recommended'],
    pluginTsLint.configs['flat/recommended'],
    baseConfig,
    stylisticConfig,
    tsConfig,
    ignoresConfig,
]);
