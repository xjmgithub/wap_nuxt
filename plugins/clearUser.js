import { setCookie, toNativePage } from '~/functions/utils'
export default ({ app: { router }, store }) => {
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
                document.querySelector('body').innerHTML =
                    '<div style="height:100%;width:100%;background:#ccc">\
                    <div class="dialog" style="transform: translate(-50%, -50%);">\
                        <div class="dialog-body">\
                            <div class="pop-default">\
                                <p>\
                                    <span>Your account is signed in elsewhere</span>\
                                </p>\
                            </div>\
                        </div>\
                        <div class="dialog-footer">\
                        <div class="btn" id="mis">OK</div>\
                    </div>\
                    </div>\
                </div>'
                document.getElementById('mis').onclick = function() {
                    if (store.state.appType == 1) {
                        toNativePage('com.star.mobile.video.account.LoginActivity')
                    } else {
                        toNativePage('startimes://login')
                    }
                }
            } else {
                setCookie('token', '') // 清除失效的token
                location.reload()
            }
        }
    })
}
