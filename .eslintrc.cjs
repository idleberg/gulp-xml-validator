module.exports = {
  env: {
		es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:json/recommended'
  ],
	parserOptions: {
    ecmaVersion: 11,
    sourceType: "module"
	},
  plugins: [
  ],
  root: true
};
