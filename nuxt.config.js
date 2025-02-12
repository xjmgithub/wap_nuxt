import env from './env'
import accesslog from './functions/accesslog'
export default {
    mode: 'universal',
    server: {
        timing: {
            total: true // https://www.w3.org/TR/server-timing/
        }
    },
    head: {
        title: 'StarTimes ON',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'StarTimes | Movies | Sport | Series | Music | TV Guide | Entertainment' },
            { name: 'format-detection', content: 'email=no' },
            { name: 'format-detection', content: 'telephone=no' },
            {
                name: 'google-signin-client_id',
                content: '461626275431-sngbv2nv2bmecefaiu01r67cu1n88rja.apps.googleusercontent.com'
            }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },

    loading: '~/components/loading.vue',

    // global css
    css: ['~assets/css/normalize.css'],
    transition: {
        name: 'page',
        mode: 'out-in'
    },

    // Plugins to load before mounting the App
    plugins: [{ src: '~plugins/analysis.js', ssr: false }, { src: '~plugins/axios.js', ssr: false }, { src: '~plugins/others.js', ssr: false }],

    modules: [
        // Doc: https://github.com/nuxt-community/axios-module#usage
        '@nuxtjs/axios'
    ],

    axios: {
        // See https://github.com/nuxt-community/axios-module#options
        baseURL: process.env.NODE_ENV !== 'production' ? env.apiURL : env.proxyHost,
        browserBaseURL: '/',
        proxy: process.env.NODE_ENV !== 'production'
    },
    proxy: {
        '/ums/': env.proxyHost,
        '/vup/': env.proxyHost,
        '/cms/': env.proxyHost,
        '/genesys-proxy/v1/chats': env.proxyHost,
        '/membership/': env.proxyHost,
        '/mobilewallet/': env.proxyHost,
        '/payment/api': env.proxyHost,
        '/payment/v2': env.proxyHost,
        '/payment/platform/v1': env.mechantRequestUrl,
        '/csms-service': env.proxyHost,
        '/ocs/': env.proxyHost,
        '/css/': env.proxyHost,
        '/voting/': env.proxyHost,
        '/adm/': env.proxyHost,
        '/self/': env.proxyHost,
        '/channel/': env.proxyHost,
        '/search-service/': env.proxyHost,
        '/wxorder/': env.proxyHost,
        '/like/': env.proxyHost,
        '/feed/': env.proxyHost,
        '/sports/': env.proxyHost,
        '/lottery/': env.proxyHost,
        '/promotion-coupon/': env.proxyHost,
        '/processtoken/': 'http://op-test1.startimes.me/'
    },
    router: {
        middleware: 'auth' // middleware before all pages render
    },
    serverMiddleware: [
        { path: '/hybrid/api/twitter/oauth/request_token', handler: '~/api/twitter/request_token.js' },
        { path: '/hybrid/api/twitter/callback', handler: '~/api/twitter/callback.js' },
        { path: '/hybrid/api/payment/callback', handler: '~/api/payment/callback' },
        { path: '/hybrid/vote/FilmFestival', handler: '~/api/film/index.js' },
        { path: '/hybrid/vote/voiceToFame', handler: '~/api/film/index.js' },
        { path: '/hybrid/vote/BSSVote', handler: '~/api/film/index.js' },
        { path: '/hybrid/vote/BSSVoteDetail', handler: '~/api/film/index.js' },
        { path: '/hybrid/vote/BSSVote2', handler: '~/api/film/index.js' },
        { path: '/hybrid/vote/getTicketAward', handler: '~/api/film/getTicketAward.js' },
        { path: '/hybrid/api/episode/submit', handler: '~/api/episode/submit.js' },
        { path: '/hybrid/api/episode/result', handler: '~/api/episode/result.js' },
        { path: '/hybrid/api/quiz/list', handler: '~/api/quiz/list.js' },
        { path: '/hybrid/api/quiz/bet', handler: '~/api/quiz/bet.js' },
        { path: '/hybrid/api/app/getApk', handler: '~/api/app/getApk.js' },
        { path: '/hybrid/api/games/getAward', handler: '~/api/games/getAward.js' },
        { path: '/hybrid/api/games/getRanks', handler: '~/api/games/getRanks.js' },
        { path: '/hybrid/api/games/getTaskByGame', handler: '~/api/games/getTaskByGame.js' },
        { path: '/hybrid/api/games/setGoal', handler: '~/api/games/setGoal.js' },
        { path: '/hybrid/api/games/startGame', handler: '~/api/games/startGame.js' },
        { path: '/hybrid/api/games/taskOver', handler: '~/api/games/taskOver.js' },
        { path: '/hybrid/api/payment/createPayment', handler: '~/api/payment/createPayment.js' },
        { path: '/hybrid/api/app/getFaq', handler: '~/api/app/getFaq.js' },
        { path: '/hybrid/api/sign', handler: '~/api/film/sign_api.js' }
    ],
    hooks: {
        listen(server) {
            if (process.env.NODE_ENV === 'production') {
                server.on('request', function(req, res) {
                    accesslog(req, res)
                })
            }
        }
    },
    build: {
        /*
         ** You can extend webpack config here
         */
        // parallel: true, 和下边的两个属性同时用会得到warning
        // cache: true,
        // hardSource: true,
        extend(config, ctx) {
            config.node = {
                fs: 'empty',
                net: 'empty',
                url: 'empty'
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
