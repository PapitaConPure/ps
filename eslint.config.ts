import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
	{
		files: [ "**/*.{js,ts}" ],
		plugins: {
			js,
			'@stylistic': stylistic
		},
		extends: [ "js/recommended" ],
		languageOptions: {
			globals: {...globals.browser, ...globals.node}
		}
	},
	tseslint.configs.recommended,
	{
		rules: {
			'no-unused-expressions': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'no-sparse-arrays': 'off',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'indent': [ 'error', 'tab' ],
			'no-trailing-spaces': 'error',
			'no-mixed-spaces-and-tabs': [ 'error', 'smart-tabs' ],
			'no-extra-semi': 'error',
			'semi': [ 'error', 'always', {
				'omitLastInOneLineBlock': true,
				'omitLastInOneLineClassBody': true,
			} ],
			'semi-spacing': [ 'error', {'before': false, 'after': true} ],
			'block-spacing': 'error',
			'@stylistic/block-spacing': 'error',
			'space-before-blocks': 'error',
			'@stylistic/space-before-blocks': 'error',
			'@stylistic/brace-style': [ 'error', '1tbs', {
				'allowSingleLine': true,
			} ],
			'array-bracket-spacing': [ 'error', 'always' ],
			'space-in-parens': 'error',
			'@stylistic/keyword-spacing': [ 'error', {
				'before': true,
				'after': false,
				'overrides': {
					'else': {
						'after': true,
					},
					'import': {
						'after': true,
					},
					'export': {
						'after': true,
					},
					'from': {
						'after': true,
					},
					'as': {
						'after': true,
					},
					'return': {
						'after': true,
					},
					'var': {
						'after': true,
					},
					'let': {
						'after': true,
					},
					'const': {
						'after': true,
					},
					'get': {
						'after': true,
					},
					'try': {
						'after': true,
					},
					'catch': {
						'after': true,
					},
					'finally': {
						'after': true,
					},
					'throw': {
						'after': true,
					},
				},
			} ],
			'@stylistic/eol-last': 'error',
		},
	},
]);
