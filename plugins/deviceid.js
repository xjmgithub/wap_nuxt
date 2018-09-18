import { setCookie, getCookie } from '~/functions/utils'
export default ({ app: { router }, store }) => {
    if (!getCookie('deviceId')) setCookie('deviceId', store.state.deviceId)
    if (!getCookie('token')) setCookie('token', store.state.token)
}
