module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: ['plugin:vue/strongly-recommended', 'plugin:prettier/recommended'],
    // required to lint *.vue files
    plugins: ['vue', 'prettier'],
    // add your custom rules here
    rules: {
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': [
            2,
            {
                singleline: 10
            }
        ],
        'vue/mustache-interpolation-spacing': 'off',
        'prettier/prettier': 0,
        'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
}
