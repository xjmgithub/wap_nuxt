module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'plugin:prettier/recommended'],
    plugins: ['prettier'],
    // add your custom rules here
    rules: {
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': [
            2,
            {
                singleline: 10
            }
        ],
        'import/order': 'off',
        eqeqeq: 'off',
        'import/order': 'off',
        'vue/mustache-interpolation-spacing': 'off',
        'prettier/prettier': 0,
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/html-closing-bracket-spacing': 'off',
        'vue/no-v-html': 'off',
        'vue/html-self-closing': 'off',
        'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
}