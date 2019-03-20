import { setCookie } from '~/functions/utils'
export default ({ app: { router }, store }) => {
    
    // 缓存登录状态
    setCookie('deviceId', store.state.deviceId)
    setCookie('token', store.state.token)
    setCookie('gtoken', store.state.gtoken)
    setCookie('lang', store.state.langType)
    setCookie('country', store.state.country.country)

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
