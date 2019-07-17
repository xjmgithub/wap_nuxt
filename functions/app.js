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

export const envokeByIntent = function(page, failback) {
    let target = ''
    if (page) {
        target = '?target=' + Base64.encode(page.replace(/&/g, '**'))
    }
    window.location.href = `intent://${host}/${path}${target}#Intent;scheme=starvideo;package=com.star.mobile.video;end`
    const s = setTimeout(() => {
        if (!document.hidden) failback && failback()
        clearTimeout(s)
    }, 2000)
    document.addEventListener('visibilitychange', () => {
        clearTimeout(s)
        this.$nuxt.$loading.finish()
    })
}

export const invokeByIframe = function(page, failback) {
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
        this.$nuxt.$loading.finish()
    })
}

export const callApp = function(page, failback) {
    this.sendEvLog({
        category: 'callup_app',
        action: 'callup',
        label: this.$route.path,
        value: 1
    })
    if (window.navigator.userAgent.indexOf('SamsungBrowser/2.1') > 0) {
        envokeByIntent(page, failback)
    } else {
        invokeByIframe(page, failback)
    }
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
    this.$nuxt.$loading.finish()
    callback && callback()
}

export const callMarket = function(failback) {
    let source = ''
    if (location.href.indexOf('referrer') > 0) {
        source = location.search
    } else if (location.href.indexOf('utm_source') > 0) {
        source = '&referrer=' + encodeURIComponent(location.search.substr(1))
    } else {
        source = '&referrer=' + encodeURIComponent('utm_source=officeWap')
    }

    this.sendEvLog({
        category: 'callup_app',
        action: 'to_googleplay',
        label: this.$route.path,
        value: 1
    })

    if (browser.isIos) {
        window.location.href = appleStore
    } else {
        const iframe = document.createElement('iframe')
        iframe.frameborder = '0'
        iframe.style.cssText = 'display:none;border:0;width:0;height:0;'
        document.body.appendChild(iframe)

        iframe.src = `market://details?id=com.star.mobile.video${source}`

        const s = setTimeout(() => {
            if (!document.hidden) failback && failback()
            clearTimeout(s)
        }, 2000)
        document.addEventListener('visibilitychange', () => {
            clearTimeout(s)
            this.$nuxt.$loading.finish()
        })
    }
}

export const playVodinApp = function(appType, vod) {
    if (appType == 1) {
        toNativePage('com.star.mobile.video.player.PlayerVodActivity?vodId=' + vod)
    } else if (appType == 2) {
        window.location.href = 'startimes://player?vodId=' + vod
    } else {
        this.$nuxt.$loading.start()
        callApp.call(this, 'com.star.mobile.video.player.PlayerVodActivity?vodId=' + vod, () => {
            callMarket.call(this, () => {
                downApk.call(this)
            })
        })
    }
}

export const toNativePage = function(page) {
    if (page.indexOf('com.star.mobile.video') >= 0) {
        window.getChannelId && window.getChannelId.toAppPage(3, page, '')
    } else {
        window.location.href = page
    }
}

// TODO 待优化
export const shareInvite = (link, shareTitle, shareContent, shareImg) => {
    if (window.getChannelId && window.getChannelId.showCustorm) {
        const content = '【' + shareTitle + '】' + shareContent + ' ' + link
        window.getChannelId.showCustorm(content, link, link, link, link, link, link, shareImg || '', shareTitle)
    }
}

export const callupFlow = function(page) {
    callApp.call(this, page, () => {
        callMarket.call(this, () => {
            downApk.call(this)
        })
    })
}
