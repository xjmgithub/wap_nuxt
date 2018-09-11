let env = require('./env.js')
module.exports = {
    head: {
        title: 'wap_nuxt',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: 'Nuxt.js project'
            }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },
    /*
  ** Customize the progress bar color
  */
    loading: { color: '#3B8070' },
    /*
  ** Build configuration
  */
    build: {
        /*
    ** Run ESLint on save
    */
        extend(config, { isDev, isClient }) {
            if (isDev && isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        }
    },

    modules: ['@nuxtjs/axios'],

    axios: {
        // proxyHeaders: false
        proxy: true, // Can be also an object with default options
        retry: { retries: 0 }
    },
    proxy: {
        '/ums/': env.ms_host,
        '/cms/': env.ms_host,
        '/ocs/': env.ms_host,
        '/mobilewallet/': env.ms_host
    },
    plugins: [{ src: '~plugins/analysis.js', ssr: false }]
}
