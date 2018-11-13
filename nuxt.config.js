let env = require('./env.js')
module.exports = {
    head: {
        title: 'StarTimesTV',
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
            },
            { name: 'format-detection', content: 'email=no' },
            { name: 'format-detection', content: 'telephone=no' },
            { name: 'google-signin-client_id', content: '461626275431-sngbv2nv2bmecefaiu01r67cu1n88rja.apps.googleusercontent.com' }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
        script: [
            {
                src: '/res_nuxt/sdk.js'
            }
        ]
    },
    loading: { color: '#3B8070' },
    build: {
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
        // proxyHeaders: false,
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
        '/css/': env.ms_host
    },
    plugins: [
        { src: '~plugins/analysis.js', ssr: false },
        { src: '~plugins/auth.js', ssr: false },
        { src: '~plugins/clearUser.js', ssr: false },
        { src: '~plugins/deviceid.js', ssr: false },
        { src: '~plugins/axios.js', ssr: false },
        { src: '~plugins/getCountryInfo.js', ssr: false }
    ]
}
