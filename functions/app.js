// 参考 https://github.com/suanmei/callapp-lib/blob/master/index.js
// 仅在客户端执行

import { Base64 } from 'js-base64'
import { getBrowser } from '~/functions/utils'
import axios from 'axios'

const browser = getBrowser()
const scheme = browser.isIos ? 'startimes' : 'starvideo'
const host = 'platformapi'
const path = 'webtoapp'
const appleStore = 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'

/* 获取apk地址 */
const getApkUrl = function(callback) {
    axios.get('/cms/public/app').then(data => {
        const url = data.data.apkUrl
        callback && callback(url.indexOf('google') > 0 ? url.replace('google', 'officialWap') : '')
    })
}

const invokeByIframe = function(page, failback) {
    const iframe = document.createElement('iframe')
    iframe.frameborder = '0'
    iframe.style.cssText = 'display:none;border:0;width:0;height:0;'
    document.body.appendChild(iframe)

    const target = page ? '?target=' + Base64.encode(page.replace(/&/g, '**')) : ''

    iframe.src = `${scheme}://${host}/${path}${target}`

    const s = setTimeout(() => {
        if (!document.hidden) failback && failback()
        clearTimeout(s)
    }, 2000)
    document.addEventListener('visibilitychange', () => {
        clearTimeout(s)
    })
}

// for universal link
// const invokeByLocation = function(page, failback) {
//     console.log(page)
// }

export const callApp = function(page, failback) {
    this.sendEvLog({
        category: 'callup_app',
        action: 'callup',
        label: this.$route.path,
        value: 1
    })
    invokeByIframe(page, failback)
}

export const downApk = function(callback) {
    this.sendEvLog({
        category: 'callup_app',
        action: 'down_apk',
        label: this.$route.path,
        value: 1
    })
    if (browser.isIos) {
        window.location.href = appleStore
    } else {
        getApkUrl(url => {
            if (url) {
                window.location.href = url
            } else {
                window.alert('Download error.Please retry.')
            }
        })
    }
    callback && callback()
}

export const callMarket = function() {
    let source = ''
    if (location.href.indexOf('referrer') > 0) {
        source = location.search
    } else if (location.href.indexOf('utm_source') > 0) {
        source = '&referrer=' + encodeURIComponent(location.search.substr(1))
    } else {
        source = '&' + location.search.substr(1)
    }

    this.sendEvLog({
        category: 'callup_app',
        action: 'to_googleplay',
        label: this.$route.path,
        value: 1
    })
    window.location.href = browser.isIos ? appleStore : 'market://details?id=com.star.mobile.video' + source
}
