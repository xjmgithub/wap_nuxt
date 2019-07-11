// 参考 https://github.com/suanmei/callapp-lib/blob/master/index.js
import { Base64 } from 'js-base64'
import { getBrowser, getCookie } from '~/functions/utils'
import axios from 'axios'
import qs from 'qs'



const host = 'platformapi'
const path = 'webtoapp'
const packageName = 'com.star.mobile.video'
const appleStore = 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'

const getApkUrl = async function() {
    const { data } = await axios.get('/cms/public/app')
    const url = data.apkUrl
    return url.indexOf('google') > 0 ? url.replace('google', 'officialWap') : ''
}

const envokeByIntent = function(page) {
    const browser = getBrowser()
    const scheme = browser.isIos ? 'startimes' : 'starvideo'
    const target = Base64.encode(page.replace(/&/g, '**'))
    const url = getApkUrl()
    window.location.href = `intent://${host}/${path}#Intent;scheme=${scheme};package=${packageName};S.target=${target};S.browser_fallback_url=${url};end`
}

const invokeByIframe = function(page, failback) {
    const browser = getBrowser()
    const scheme = browser.isIos ? 'startimes' : 'starvideo'
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

export const callApp = function(page, failback) {
    const browser = getBrowser()
    console.log(123)
    if (browser.isIos && browser.version >= 9) {
        // TODO unival link
        invokeByIframe(page, failback)
    } else if (browser.isOriginalChrome && browser.isAndroid) {
        console.log(123)
        envokeByIntent(page)
    } else {
        invokeByIframe(page, failback)
    }
}

export const downApk = function(callback) {
    const browser = getBrowser()
    if (browser.isIos) {
        window.location.href = appleStore
    } else {
        const url = getApkUrl()
        if (url) {
            window.location.href = url
        } else {
            window.alert('Download error.Please retry.')
        }
    }
    callback && callback()
}

export const callMarket = function() {
    const browser = getBrowser()
    const voteDownTag = getCookie('vote_share_down')
    const user = getCookie('vote_share_user')

    let source = ''
    if (location.href.indexOf('referrer') > 0) {
        source = location.search
    } else if (location.href.indexOf('utm_source') > 0) {
        source = '&referrer=' + encodeURIComponent(location.search.substr(1))
    } else {
        source = '&' + location.search.substr(1)
    }

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
        label: window.location.href,
        Value: 1
    })
    window.location.href = browser.isIos ? appleStore : 'market://details?id=com.star.mobile.video' + source
}

// !important discard
export const toAppStore = function(page) {
    callApp(page, () => {
        this.$confirm(
            this.$store.state.lang.mrright_download_android,
            () => {
                this.sendEvLog({
                    category: 'callup_app',
                    action: 'to_googleplay',
                    label: window.location.href,
                    Value: 1
                })
                callMarket()
            },
            () => {
                this.sendEvLog({
                    category: this.vote_name,
                    action: 'downloadpopup_click',
                    label: 'not now',
                    Value: 1
                })
            },
            this.$store.state.lang.mrright_go,
            this.$store.state.lang.mrright_not_now
        )
    })
}

export const normalToAppStore = function(page) {
    console.log(page)
    callApp(page, () => {
        downApk.call(this)
    })
}
