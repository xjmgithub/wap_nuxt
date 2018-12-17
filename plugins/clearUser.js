import { setCookie, toNativePage } from '~/functions/utils'
export default ({ app: { router }, store,redirect }) => {
    router.beforeEach((to, from, next) => {
        // 清除计时器
        if (store.state.intervalTimer) {
            clearInterval(store.state.intervalTimer)
        }
        if (store.state.user) {
            next()
        } else {
            // 如果是app里
            if (store.state.appType == 1 || store.state.appType == 2) {
                console.log(123)
                redirect('/hybrid/account/tokenfail')
            } else {
                setCookie('token', '') // 清除失效的token
                location.reload()
            }
        }
    })
}
