import stylisticPlugin from '@stylistic/eslint-plugin';
import tslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const jsConfig = {
    plugins: {
        '@stylistic': stylisticPlugin,
    },

    rules: {
        '@stylistic/arrow-parens': ['error', 'always'],
        '@stylistic/brace-style':  ['error', '1tbs'],
        '@stylistic/comma-dangle': ['error', 'always-multiline'],
        '@stylistic/indent':       ['error', 4],

        '@stylistic/key-spacing': ['error', {
            'afterColon':  true,
            'beforeColon': false,
            'mode':        'minimum',
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

        '@stylistic/no-multi-spaces': ['error', {
            'exceptions': {
                'ArrayExpression':      true,
                'AssignmentExpression': true,
                'TSTypeAnnotation':     true,
                'TSEnumMember':         true,
                'VariableDeclarator':   true,
            },
        }],

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

        '@stylistic/quotes': ['error', 'single', {
            'allowTemplateLiterals': 'always',
        }],

        '@stylistic/semi':   ['error', 'always'],

        '@stylistic/space-before-function-paren': ['error', {
            'anonymous':  'always',
            'named':      'never',
            'asyncArrow': 'always',
        }],

        'arrow-body-style': 'off',
        'no-bitwise':       'off',
        'no-plusplus':      'off',
    },
};

const tsConfig = {
    files: ['**/*.ts'],

    languageOptions: {
        parser: tsParser,
        parserOptions: {
            ecmaVersion: 2023,
            sourceType: 'module',
            project: ['./tsconfig.json'],
        },
    },

    plugins: {
        '@typescript-eslint': tslintPlugin,
    },

    rules: {
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

        '@typescript-eslint/no-unused-vars': ['warn', {
            'vars': 'all',
            'args': 'after-used',
            'ignoreRestSiblings': true,
            'argsIgnorePattern': '^_',
            'caughtErrorsIgnorePattern': '^_',
        }],
    },
};

export default [jsConfig, tsConfig];
