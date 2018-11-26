
import {setCookie,toNativePage} from '~/functions/utils'
export default ({ app: { router }, store }) => {
    router.beforeEach((to, from, next) => {
        // 清除计时器
        if(store.state.intervalTimer){
            clearInterval(store.state.intervalTimer)
        }
        if (store.state.user) {
            next()
        } else {
            // 如果是app里
            if(store.state.appType==1||store.state.appType==2){
                window.alert('your account is signed in elsewhere')
                if (store.state.appType == 1) {
                    toNativePage('com.star.mobile.video.account.LoginActivity')
                } else {
                    toNativePage('startimes://login')
                }
            }else{
                setCookie('token','') // 清除失效的token
                location.reload()
            }
            
        }
        
    })
}
