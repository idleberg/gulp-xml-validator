module.exports = {
  env: {
		es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
    'plugin:json/recommended'
  ],
	parser: '@typescript-eslint/parser',
	parserOptions: {
    ecmaVersion: 11,
    sourceType: "module"
	},
  plugins: [
		'@typescript-eslint'
	],
  root: true
};
