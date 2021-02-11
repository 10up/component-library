module.exports = {
	extends: ['@10up/eslint-config', '@10up/eslint-config/jest'],
	plugins: ['eslint-plugin-cypress'],
	globals: {
		'cypress/globals': true,
	},
	rules: {
		'no-new': 0,
	},
	overrides: [
		{
			files: ['e2e/cypress/**/*.js'],
			extends: ['plugin:cypress/recommended'],
			rules: {
				'no-unused-expressions': 0,
				'jest/expect-expect': 0,
				'import/no-extraneous-dependencies': [2, { devDependencies: true }],
			},
		},
	],
};
