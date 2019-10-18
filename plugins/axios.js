export default ({ app, $axios, redirect, store, route, $nuxt }) => {
    $axios.onError(error => {
        const code = parseInt(error.response && error.response.status)
        if (code === 401) {
            if (store.state.appType > 0) {
                store.commit('SET_NEED_LOGIN', true)
            } else {
                redirect('/hybrid/account/signIn?pre=' + encodeURIComponent(route.fullPath))
            }
        }
    })
}
