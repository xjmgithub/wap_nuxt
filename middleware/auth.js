const authIgnore = [
    /^\/hybrid\/account\/login/,
    /^\/hybrid\/account\/logout/,
    /^\/hybrid\/account\/signIn/,
    /^\/hybrid\/account\/register/,
    /^\/hybrid\/account\/toGooglePlay/,
    /^\/hybrid\/account\/setpass/,
    /^\/hybrid\/account\/resetpass/,
    /^\/hybrid\/account\/resetTelPass/,
    /^\/hybrid\/account\/resetEmailPass/,
    /^\/hybrid\/account\/resetTelPassSubmit/,
    /^\/hybrid\/payment\/channels/,
    /^\/hybrid\/payment\/payResult/,
    /^\/hybrid\/payment\/form/,
    /^\/hybrid\/payment\/methods/,
    /^\/hybrid\/faq/,
    /^\/hybrid\/packet/,
    /^\/hybrid\/lands/,
    /^\/hybrid\/sports/,
    /^\/hybrid\/tools/,
    /^\/hybrid\/vote/,
    /^\/browser/,
    /^\/hybrid\/questionNaire/,
    /^\/hybrid\/dvb\/bind/,
    /^\/hybrid\/dvb\/order/,
    /^\/hybrid\/post/,
    /^\/hybrid\/api/
]
const inIgnore = url => {
    let result = false
    authIgnore.forEach(item => {
        if (item.test(url)) {
            result = true
        }
    })
    return result
}

export default ({ app, store, route, redirect, $axios }) => {
    const user = store.state.user
    const isLogin = user.roleName && user.roleName.toUpperCase() !== 'ANONYMOUS'
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
