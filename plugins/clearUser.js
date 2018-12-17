import { setCookie, toNativePage } from '~/functions/utils'
export default ({ app: { router }, store }) => {
    router.beforeEach((to, from, next) => {
        // 清除计时器
        if (store.state.intervalTimer) {
            clearInterval(store.state.intervalTimer)
        }
        console.log(store.state.user)
        if (store.state.user) {
            next()
        } else {
            // 如果是app里
            next('/hybrid/account/tokenfail')
            // if (store.state.appType == 1 || store.state.appType == 2) {
            //     next('/hybrid/account/tokenfail')
            // } else {
            //     setCookie('token', '') // 清除失效的token
            //     location.reload()
            // }
        }
    })
}
