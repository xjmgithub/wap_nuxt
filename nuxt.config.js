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
            },
            { name: 'format-detection', content: 'email=no' },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
        script: [
            // {
            //     src:
            //         'https://cdnjs.cloudflare.com/ajax/libs/hellojs/1.17.1/hello.all.min.js'
            // },
            {
                src: 'https://connect.facebook.net/en_US/sdk.js'
            },
            {
                src: 'https://apis.google.com/js/api:client.js'
            }
        ]
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
        '/vup/': env.ms_host,
        '/cms/': env.ms_host,
        '/ocs/': env.ms_host,
        '/membership/': env.ms_host,
        '/mobilewallet/': env.ms_host,
        '/payment/api': env.ms_host,
        '/payment/platform/v1':'http://10.0.63.5:8010',
        
        // '/mobilewallet/': 'http://localhost:9001',
        // '/payment/': 'http://localhost:9001',
    },
    plugins: [
        // { src: '~plugins/analysis.js', ssr: false },
        { src: '~plugins/auth.js', ssr: false },
        { src: '~plugins/deviceid.js', ssr: false },
    ]
}
