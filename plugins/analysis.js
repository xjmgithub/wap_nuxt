import env from '~/env.js'
import Vue from 'vue'
// ga
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
// countly
function sendMsg(url) {
    let s = document.createElement('img')
    s.height = 1
    s.width = 1
    s.src = url
}

export default ({ app: { router, $axios }, store, query }) => {
    const appType = store.state.appType
    const ua = navigator.userAgent
    let deviceInfo = ua.match(/\(([^)]*)\)/)[1].split(';')
    let swidth = screen.width * window.devicePixelRatio
    let sheight = screen.height * window.devicePixelRatio
    let os = (appType == 1 && 'Android') || (appType == 2 && 'IOS') || (ua.includes('iPhone') && 'IOS') || (ua.includes('iPad') && 'IOS') || 'Android'
    let ga_key = (appType == 1 && env.ga_android_key) || (appType == 2 && env.ga_ios_key) || env.ga_wap_key
    let utm_source = ''
    let utm_medium = ''
    let utm_campaign = ''
    let referrer = query.referrer
    let now = new Date().getTime()

    if (referrer) {
        // TODO COMMONT
        let t1 = referrer.match(new RegExp('(^|&)utm_source=([^&]*)(&|$)', 'i'))
        let t2 = referrer.match(new RegExp('(^|&)utm_medium=([^&]*)(&|$)', 'i'))
        let t3 = referrer.match(new RegExp('(^|&)utm_campaign=([^&]*)(&|$)', 'i'))
        utm_source = t1 ? t1[2] : ''
        utm_medium = t2 ? t2[2] : ''
        utm_campaign = t3 ? t3[2] : ''
    } else {
        if (query.utm_source) {
            utm_source = query.utm_source
            utm_medium = query.utm_medium
            utm_campaign = query.utm_campaign
        }
    }

    if (store.state.gaClientId) {
        ga('create', ga_key, 'auto', {
            clientId: store.state.gaClientId
        })
    } else {
        ga('create', ga_key, 'auto')
    }

    let commonLog = {
        al: store.state.langType, // App语言
        bst: store.state.user && store.state.user.smartCartCount, // 用户绑卡状态
        car: store.state.carrier,
        curp: document.title, // 当前页面
        cr: store.state.country.name,
        ct: '',
        dch: '', // 安装渠道标识
        dd: '' + window.devicePixelRatio, // 屏幕密度
        desp: '', // 跳转页面
        durp: 0,
        di: store.state.phoneModel || deviceInfo[deviceInfo.length - 1].split('like')[0], // 设备信息
        did: store.state.deviceId, // 设备唯一标识
        dr: swidth + 'x' + sheight, // 屏幕分辨率
        iid: store.state.gaClientId, // 安装唯一标识
        lst: store.state.user && store.state.user.roleName != 'ANONYMOUS' ? 'l' : 'a', // 用户登录状态
        lt: 'pv', // 报数类型
        lv: '1.0.0',
        nt: '', // 网络类型
        os: os,
        osl: navigator.language, // 系统语言
        osv: '', // 系统版本
        pid: '', //	播放ID
        pro: utm_source + '/' + utm_medium + '_' + utm_campaign, // 推广渠道标识
        pst: '', // 用户付费状态
        sid: '', // Session ID
        sim: store.state.carrier, // 手机卡运营商
        srcp: document.referrer,
        ver: store.state.appVersion,
        tt: now,
        uid: parseInt(store.state.user.id) || 0
    }

    const serializeMsg = (msg, type) => {
        for (let i in msg) {
            msg[i] = '' + msg[i]
        }
        let param = {
            msg: msg
        }
        for (let i in commonLog) {
            param[i] = commonLog[i]
        }
        param.lt = type || 'event' || 'pv'
        return JSON.stringify([param])
    }

    let sendPvLog = msg => {
        let result = serializeMsg(msg, 'pv')
        sendMsg(
            env.pv_countly_server +
                '/i?logtype=pv&app_key=' +
                env.countly_appKey +
                '&events=' +
                result +
                '&device_id=' +
                store.state.deviceId +
                '&timestamp=' +
                now
        )
    }

    let sendEvLog = msg => {
        let result = serializeMsg(msg, 'event')
        sendMsg(
            env.ev_countly_server +
                '/i?logtype=event&app_key=' +
                env.countly_appKey +
                '&events=' +
                result +
                '&device_id=' +
                store.state.deviceId +
                '&timestamp=' +
                now
        )

        ga('send', {
            hitType: 'event',
            eventCategory: msg.category,
            eventAction: msg.action,
            eventLabel: msg.label,
            eventValue: 1
        })
    }

    Vue.prototype.sendEvLog = sendEvLog

    sendEvLog({
        category: 'h5_open',
        action: 'page_init_start',
        label: location.pathname,
        value: now - store.state.appInitTime,
        native_time: store.state.appInitTime,
        browser_time: now
    })

    router.afterEach((to, from) => {
        ga('send', 'pageview')
        sendEvLog({
            category: 'page_view',
            action: 'show',
            label: location.pathname
        })
    })
}
