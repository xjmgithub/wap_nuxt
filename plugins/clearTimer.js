import { setCookie, toNativePage } from '~/functions/utils'
export default ({ app: { router }, store }) => {
    router.beforeEach((to, from, next) => {
        // 清除计时器
        if (store.state.intervalTimer) {
            clearInterval(store.state.intervalTimer)
        }
        next()
    })
}
