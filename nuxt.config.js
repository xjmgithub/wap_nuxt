import pkg from './package'
import env from './env.js'

export default {
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
        // ['@nuxtjs/pwa', { icon: false }],
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
        '/ums/': env.msHost,
        '/vup/': env.msHost,
        '/cms/': env.msHost,
        '/genesys-proxy/v1/chats': env.msHost,
        '/membership/': env.msHost,
        '/mobilewallet/': env.msHost,
        '/payment/api': env.msHost,
        '/payment/v2': env.msHost,
        '/payment/platform/v1': env.mechantRequestUrl,
        '/csms-service': env.msHost,
        '/ocs/': env.msHost,
        '/css/': env.msHost,
        '/voting/': env.msHost,
        '/adm/': env.msHost,
        '/self/': env.msHost,
        '/channel/': env.msHost,
        '/wxorder/': env.msHost
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
