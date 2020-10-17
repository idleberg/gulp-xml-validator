module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2020: true
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: 11
    },
    ignorePatterns: [
      './test/*.js'
    ]
};
