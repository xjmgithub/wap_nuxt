import { setCookie } from '~/functions/utils'
export default ({ $axios, redirect }) => {
    $axios.onError(error => {
        const code = parseInt(error.response && error.response.status)
        // TODO 401 的时候要跳转登录
        if (code === 401) {
            setCookie('token', '')
            setCookie('userid', '')
            redirect('/hybrid/account/tokenfail')
        }
    })
}
