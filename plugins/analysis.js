import env from '~/env.js'
;(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r
    ;(i[r] =
        i[r] ||
        function() {
            ;(i[r].q = i[r].q || []).push(arguments)
        }),
        (i[r].l = 1 * new Date())
    ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
    a.async = 1
    a.src = g
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga')

window.Countly = window.Countly || {}
window.Countly.app_key = env.countly_appKey
window.Countly.url = env.countly_host
;(function() {
    var cly = document.createElement('script')
    cly.type = 'text/javascript'
    cly.async = true
    cly.src = 'https://cdn.jsdelivr.net/countly-sdk-web/latest/countly.min.js'
    cly.onload = function() {
        window.Countly.init()
    }
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(cly, s)
})()

export default ({ app: { router }, store }) => {
    let ga_key = env.ga_wap_key
    if (store.state.appType == 1) {
        ga_key = env.ga_android_key
    } else if (store.state.appType == 2) {
        ga_key = env.ga_ios_key
    } else {
        ga_key = env.ga_wap_key
    }

    if (store.state.gaClientId) {
        ga('create', ga_key, 'auto', {
            clientId: store.state.gaClientId
        })
    } else {
        ga('create', ga_key, 'auto')
    }

    window.Countly.app_version = store.state.appVersion

    if (store.state.deviceId) {
        Countly.device_id = store.state.deviceId
    }

    router.afterEach((to, from) => {
        ga('set', 'page', to.fullPath)
        ga('send', 'pageview')

        window.Countly.q = Countly.q || []
        window.Countly.q.push(['track_sessions'])
        window.Countly.q.push(['track_pageview'])
        window.Countly.q.push(['track_sessions'])
        window.Countly.q.push(['track_clicks'])
        window.Countly.q.push(['track_links'])
    })
}
