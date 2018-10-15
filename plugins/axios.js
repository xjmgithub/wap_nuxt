import { setCookie } from '~/functions/utils'
export default ({ $axios, redirect }) => {
    $axios.onError(error => {
        const code = parseInt(error.response && error.response.status)
        if (code === 401) {
            setCookie('token','')
            setCookie('userid','')
            window.location.reload()
        }
    })
}