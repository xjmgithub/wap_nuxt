import { setCookie, toNativePage } from '~/functions/utils'
export default ({ app: { router }, store }) => {
    router.beforeEach((to, from, next) => {
        // 路由切换侧边栏导航收回
        store.commit('SET_NAV_STATE', false)

        // 清除计时器
        if (store.state.intervalTimer) {
            clearInterval(store.state.intervalTimer)
        }
        next()
    })
}
