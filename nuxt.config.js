const pkg = require('./package')
const env = require('./env.js')

module.exports = {
    mode: 'universal',

    head: {
        title: 'StarTimes ON',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: pkg.description },
            { name: 'format-detection', content: 'email=no' },
            { name: 'format-detection', content: 'telephone=no' },
            {
                name: 'google-signin-client_id',
                content: '461626275431-sngbv2nv2bmecefaiu01r67cu1n88rja.apps.googleusercontent.com'
            }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
        script: [
            {
                src: '/res_nuxt/open.min.js',
                async: true
            },
            {
                src: '/res_nuxt/sdk.js',
                async: true
            }
        ]
    },

    loading: '~/components/loading.vue',

    /*
    ** Global CSS
    */
    css: ['~assets/css/normalize.css'],
    transition: {
        name: 'page',
        mode: 'out-in'
    },

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [{ src: '~plugins/analysis.js', ssr: false }, { src: '~plugins/axios.js', ssr: false }, { src: '~plugins/others.js', ssr: false }],

    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://github.com/nuxt-community/axios-module#usage
        '@nuxtjs/axios'
    ],
    /*
    ** Axios module configuration
    */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
        proxy: true, // Can be also an object with default options
        retry: { retries: 0 }
    },
    proxy: {
        '/ums/': env.ms_host,
        '/vup/': env.ms_host,
        '/cms/': env.ms_host,
        '/genesys-proxy/v1/chats': env.ms_host,
        '/membership/': env.ms_host,
        '/mobilewallet/': env.ms_host,
        '/payment/api': env.ms_host,
        '/payment/v2': env.ms_host,
        '/payment/platform/v1': env.mechant_request_url,
        '/csms-service': env.ms_host,
        '/ocs/': env.ms_host,
        '/css/': env.ms_host,
        '/voting/': env.ms_host,
        '/adm/': env.ms_host,
        '/self/': env.ms_host,
        '/channel/': env.ms_host,
        '/wxorder/': env.ms_host
    },
    router: {
        middleware: 'auth'
    },
    serverMiddleware: [
        { path: '/hybrid/api/twitter/oauth/request_token', handler: '~/api/twitter/request_token.js' },
        { path: '/hybrid/api/twitter/callback', handler: '~/api/twitter/callback.js' }
    ],

    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {
            // Run ESLint on save
            config.node = {
                fs: 'empty',
                net: 'empty'
            }
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        }
    }
}
