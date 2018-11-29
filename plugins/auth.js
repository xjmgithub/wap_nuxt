import { getCookie } from '~/functions/utils'
let auth_ignore = [
    /^\/hybrid\/account\/login/,
    /^\/hybrid\/account\/logout/,
    /^\/hybrid\/account\/signin/,
    /^\/hybrid\/account\/register/,
    /^\/hybrid\/account\/setpass/,
    /^\/hybrid\/account\/resetpass/,
    /^\/hybrid\/payment\/channelDesc/,
    /^\/hybrid\/payment\/payResult/,
    /^\/hybrid\/payment\/form/,
    /^\/hybrid\/payment\/methods/,
    /^\/hybrid\/faq/,
    /^\/hybrid\/packet/
]
function inIgnore(url) {
    let result = false
    auth_ignore.forEach(item => {
        if (item.test(url)) {
            result = true
        }
    })
    return result
}
export default ({ app: { router }, store }) => {
    var loginUser = getCookie('userid')
    router.beforeEach((to, from, next) => {
        if (!inIgnore(to.path)) {
            if (loginUser) {
                next()
            } else {
                next('/hybrid/account/login?pre=' + encodeURIComponent(to.fullPath))
            }
        } else {
            next()
        }
    })
}
