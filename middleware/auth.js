import { toNativePage } from '~/functions/utils'
const auth_ignore = [
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
    /^\/hybrid\/packet/,
    /^\/hybrid\/lands/,
    /^\/hybrid\/tools/,
    /^\/hybrid\/vote/,
    /^\/browser/,
    /^\/hybrid\/questionNaire/,
    /^\/hybrid\/dvb/
]
const inIgnore = url => {
    let result = false
    auth_ignore.forEach(item => {
        if (item.test(url)) {
            result = true
        }
    })
    return result
}

export default ({ app, store, route, redirect,$axios }) => {
    let user = store.state.user
    let isLogin = user.roleName && user.roleName.toUpperCase() != 'ANONYMOUS'
    if (!inIgnore(route.fullPath)) {
        if (!isLogin) {
            if (store.state.appType > 0) {
                store.commit('SET_NEED_LOGIN', true)
            } else {
                redirect('/hybrid/account/login?pre=' + encodeURIComponent(route.fullPath))
            }
        }
    }
    
}
