// 参考 https://github.com/suanmei/callapp-lib/blob/master/index.js
// 仅在客户端执行

import { Base64 } from 'js-base64'
import axios from 'axios'
import { getBrowser } from '~/functions/utils'

const browser = getBrowser()
const appleStore = 'https://itunes.apple.com/us/app/startimes/id1168518958?l=zh&ls=1&mt=8'

export const base64Page = function(page) {
    let target = ''
    if (page) {
        target = '?target=' + Base64.encode(page.replace(/&/g, '**'))
    }
    return target
}

export const createIntent = function(page, host, path, scheme) {
    const target = page ? base64Page(page) : ''
    host = host || 'platformapi'
    path = path || 'webtoapp'
    scheme = scheme || (browser.isIos ? 'startimes' : 'starvideo')
    return `intent://${host}/${path}${target}#Intent;scheme=${scheme};end`
}

export const createScheme = function(page, host, path, scheme) {
    const target = page ? base64Page(page) : ''
    host = host || 'platformapi'
    path = path || 'webtoapp'
    scheme = scheme || (browser.isIos ? 'startimes' : 'starvideo')
    return `${scheme}://${host}/${path}${target}`
}

export const pageDlay = function(callback, second) {
    const timeout = second || 5000 // 手机卡顿的情况会比较慢
    const timerStart = new Date().getTime()
    let lastFired = new Date().getTime()
    if (browser.browserVer > 40) {
        const exam = () => {
            const now = new Date().getTime()
            if (now - lastFired < 100) {
                // 健康状态
                if (now - timerStart > timeout) {
                    if (!document.hidden) callback && callback()
                } else {
                    lastFired = now
                    window.requestAnimationFrame(exam)
                }
            }
        }
        window.requestAnimationFrame(exam)
    } else {
        const interval = 200
        const deviation = 20
        const timer = setInterval(() => {
            const now = new Date().getTime()
            if (now - lastFired < deviation + interval) {
                // 浏览器健康状态
                if (now - timerStart > timeout) {
                    if (!document.hidden) callback && callback()
                    clearInterval(timer)
                }
            } else {
                // 不健康,代表浏览器进入后台，则不做操作
                clearInterval(timer)
            }
            lastFired = now
        }, 200)
        // 如果chrome唤醒app时间较短则不会触发视图窗口可视状态的变化
        // 进入我们apphome页就算唤起成功，只有跳过了广告页面才会改变进程的前后状态
        document.onvisibilitychange = function() {
            clearInterval(timer)
        }
    }
}

export const invokeByHref = function(target, failback) {
    window.location.href = target
    pageDlay.call(this, failback)
}

export const invokeByIframe = function(target, failback) {
    const iframe = document.createElement('iframe')
    iframe.frameborder = '0'
    iframe.style.cssText = 'display:none;border:0;width:0;height:0;'
    document.body.appendChild(iframe)
    iframe.src = target
    pageDlay.call(this, failback)
}

export const callApp = function(page, failback) {
    const utmParam = getUtmParam.call(this)
    this.sendEvLog(
        Object.assign(
            {
                category: 'callup_app',
                action: 'callup',
                label: this.$route.path,
                value: 1
            },
            utmParam.map
        )
    )

    if (browser.isIos) {
        invokeByHref.call(this, createScheme(page), failback)
        return false
    }

    if (browser.browserVer > 40) {
        if (browser.ua.indexOf('UCBrowser') > 0) {
            if (browser.androidVer >= 4.4) {
                invokeByHref.call(this, createScheme(page), failback)
            } else {
                invokeByHref.call(this, createIntent(page), failback)
            }
        } else {
            invokeByHref.call(this, createScheme(page), failback)
        }
    } else {
        invokeByIframe.call(this, createScheme(page), failback)
    }
}

export const downApk = function(callback) {
    const utmParam = getUtmParam.call(this)
    this.sendEvLog(
        Object.assign(
            {
                category: 'callup_app',
                action: 'down_apk',
                label: this.$route.path,
                value: 1
            },
            utmParam.map
        )
    )
    if (browser.isIos) {
        window.location.href = appleStore
    } else {
        window.location.href = 'http://cdn.startimestv.com/dl/ol/StarTimesON-production-officialWap-5.21.3.1-develop-5.21.3.1-inappupgrade-27700.apk'
        // axios.get('/hybrid/api/app/getApk').then(data => {
        //     window.location.href = data.data.data
        // })
    }
    this.$nuxt.$loading.finish()
    callback && callback()
}

export const callMarket = function(failback) {
    const utmParam = getUtmParam.call(this)
    const source = utmParam.str

    this.sendEvLog(
        Object.assign(
            {
                category: 'callup_app',
                action: 'to_googleplay',
                label: this.$route.path,
                value: 1
            },
            utmParam.map
        )
    )
    if (browser.isIos) {
        window.location.href = appleStore
    } else if (
        browser.ua.indexOf('MuMu') >= 0 ||
        browser.ua.indexOf('I9502') > 0 ||
        browser.ua.indexOf('I9268') > 0 ||
        browser.ua.indexOf('Firefox') > 0
    ) {
        // android 6+
        invokeByIframe.call(this, `market://details?id=com.star.mobile.video${source}`, failback)
    } else {
        invokeByHref.call(this, `market://details?id=com.star.mobile.video${source}`, failback)
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

export const shareInApp = function(link, content, shareImg) {
    if (window.getChannelId && window.getChannelId.showCustorm) {
        const mainText = content + ' ' + link
        window.getChannelId.showCustorm(mainText, link, link, link, link, link, link, shareImg || '', mainText)
    }
}

export const callupFlow = function(page) {
    callApp.call(this, page, () => {
        callMarket.call(this, () => {
            downApk.call(this)
        })
    })
}

export const getUtmParam = function() {
    const query = this.$route.query
    const referrer = query.referrer
    let source = '&referrer='
    let utmSource = ''
    let utmCampaign = ''
    let utmMedium = ''

    if (query.referrer) {
        source = source + encodeURIComponent(referrer)
        utmSource = getQueryVariable(decodeURIComponent(referrer), 'utm_source') || ''
        utmMedium = getQueryVariable(decodeURIComponent(referrer), 'utm_medium') || ''
        utmCampaign = getQueryVariable(decodeURIComponent(referrer), 'utm_campaign') || ''
    } else if (query.utm_source) {
        let str = `utm_source=${query.utm_source}`
        if (query.utm_medium) str += `&utm_medium=${query.utm_medium}`
        if (query.utm_campaign) str += `&utm_campaign=${query.utm_campaign}`
        source = source + encodeURIComponent(str)
        utmSource = query.utm_source || ''
        utmMedium = query.utm_medium || ''
        utmCampaign = query.utm_campaign || ''
    } else if (query.utms) {
        let str = `utm_source=${query.utms}`
        if (query.utmm) str += `&utm_medium=${query.utmm}`
        if (query.utmc) str += `&utm_campaign=${query.utmc}`
        source = source + encodeURIComponent(str)
        utmSource = query.utms || ''
        utmMedium = query.utmm || ''
        utmCampaign = query.utmc || ''
    } else {
        const utmCache = sessionStorage.getItem('utm_str')
        if (utmCache) {
            source = source + utmCache
            utmSource = getQueryVariable(decodeURIComponent(utmCache), 'utm_source') || ''
            utmMedium = getQueryVariable(decodeURIComponent(utmCache), 'utm_medium') || ''
            utmCampaign = getQueryVariable(decodeURIComponent(utmCache), 'utm_campaign') || ''
        } else {
            source = source + encodeURIComponent('utm_source=officeWap')
            utmSource = 'officeWap'
            utmMedium = 'officeWap'
            utmCampaign = 'officeWap'
        }
    }
    return {
        str: source,
        map: {
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign
        }
    }
}

export const getQueryVariable = function(query, key) {
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=')
        if (decodeURIComponent(pair[0]) == key) {
            return decodeURIComponent(pair[1])
        }
    }
}
