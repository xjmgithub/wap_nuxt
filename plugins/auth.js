import { getCookie } from '~/functions/utils'
let auth_ignore = [
    /^\/c\/account\/login/,
    /^\/c\/account\/signin/,
    /^\/c\/account\/register/,
    /^\/c\/account\/setpass/,
    /^\/c\/account\/resetpass/,
    /^\/c\/payment\/channelDesc/,
    /^\/c\/payment\/payResult/,
    /^\/c\/payment\/test/,
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
    var loginUser = getCookie('userId')
    router.beforeEach((to, from, next) => {
        if (!inIgnore(to.path)) {
            if (loginUser) {
                next()
            } else {
                next('/c/account/login')
            }
        } else {
            next()
        }
    })
}
