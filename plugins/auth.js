import { getCookie } from '~/functions/utils'
export default ({ app: { router }, store }) => {
    var loginUser = getCookie('userId')
    router.beforeEach((to, from, next) => {
        if (to.path.indexOf('payment/') >= 0) {
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
