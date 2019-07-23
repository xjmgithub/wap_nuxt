// 参考 https://github.com/suanmei/callapp-lib/blob/master/index.js
// 仅在客户端执行

import { Base64 } from 'js-base64'
import qs from 'qs'
import { getBrowser, getCookie } from '~/functions/utils'

const browser = getBrowser()
const scheme = browser.isIos ? 'startimes' : 'starvideo'
const host = 'platformapi'
const path = 'webtoapp'
const appleStore = 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'

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
    if (window.navigator.userAgent.indexOf('SamsungBrowser/2.1') > 0 || (browser.isOriginalChrome && browser.isAndroid)) {
        envokeByIntent.call(this, page, failback)
    } else {
        invokeByIframe.call(this, page, failback)
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
        window.location.href = '/hybrid/api/app/getApk'
    }
    this.$nuxt.$loading.finish()
    callback && callback()
}

export const callMarket = function(failback) {
    const query = this.$route.query
    const referrer = query.referrer
    let source = '&referrer='

    if (query.referrer) {
        source = source + encodeURIComponent(referrer)
    } else if (query.utm_source) {
        let str = `utm_source=${query.utm_source}`
        if (query.utm_medium) str += `&utm_medium=${query.utm_medium}`
        if (query.utm_campaign) str += `&utm_campaign=${query.utm_campaign}`
        source = source + encodeURIComponent(str)
    } else if (query.utms) {
        let str = `utm_source=${query.utms}`
        if (query.utmm) str += `&utm_medium=${query.utmm}`
        if (query.utmc) str += `&utm_campaign=${query.utmc}`
        source = source + encodeURIComponent(str)
    } else {
        source = source + encodeURIComponent('utm_source=officeWap')
    }

    const voteDownTag = getCookie('vote_share_down')
    const user = getCookie('vote_share_user')
    if (voteDownTag && voteDownTag != -1) {
        this.$axios({
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                token: this.$store.state.token,
                'X-Secret': voteDownTag
            },
            data: qs.stringify({
                vote_id: 8,
                target: user,
                action: 'SHARE_DOWNLOAD'
            }),
            url: '/voting/v1/ticket'
        })
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
