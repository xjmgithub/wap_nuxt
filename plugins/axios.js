import { setCookie } from '~/functions/utils'
export default ({ $axios, redirect, store }) => {
    $axios.onError(error => {
        const code = parseInt(error.response && error.response.status)
        if (code === 401) {
            if (store.state.appType > 0) {
                store.commit('SET_NEED_LOGIN', true)
            } else {
                redirect('/hybrid/account/login?pre=' + encodeURIComponent(route.fullPath))
            }
        }
    })
}
