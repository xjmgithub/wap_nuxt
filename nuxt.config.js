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
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
        script: [
            {
                src: '/res_nuxt/sdk.js'
            },
            {
                src: '/res_nuxt/api_client.js'
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
        '/ocs/v1/service': 'http://localhost:9001',
        '/ocs/v1/service-list': 'http://localhost:9001',
        '/ocs/v1/moreFaqs': 'http://localhost:9001',
        '/ocs/v1/faqs/Tags': 'http://localhost:9001',
        '/ocs/v1/faqs/byTag': 'http://localhost:9001',
        '/csms-service': 'http://localhost:9001',
        '/ocs/': env.ms_host,
        '/css/': 'http://localhost:9001'
    },
    plugins: [
        { src: '~plugins/analysis.js', ssr: false },
        { src: '~plugins/auth.js', ssr: false },
        { src: '~plugins/deviceid.js', ssr: false },
        { src: '~plugins/axios.js', ssr: false },
    ]
}
