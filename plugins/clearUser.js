
import {setCookie} from '~/functions/utils'
export default ({ app: { router }, store }) => {
    router.beforeEach((to, from, next) => {
        if (store.state.user) {
            next()
        } else {
            setCookie('token','') // 清除失效的token
            location.reload()
        }
    })
}
