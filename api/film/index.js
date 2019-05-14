import 'url'
import qs from 'qs'
import axios from 'axios'
import env from '../../env.js'
export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    if (query.pin && req.headers.cookie.indexOf('vote_share_down') < 0) {
        axios
            .get(`${env.apiURL}voting/v1/token`, {
                headers: {
                    token:
                        'eyJhbGciOiJIUzUxMiJ9.eyJhcHAiOjEsInVpZCI6MTIzNSwiY2NvZGUiOiJUWiIsInJvbGUiOjIsImRldiI6ImFuZG9yaWRfNERBQ0ZBQzYtNUM5OS00NUY0LUI0NzEtQjNDRTY1MEIwRUNDIiwiY3JlYXRlZCI6MTUyNDczNDI4MTAyNiwiZXhwIjoxODQwMDk0MjgxLCJjaWQiOjN9.hl9TS3duu8A0dUKas2UhKZewGEda2K-3fppPRuIgOxsM0F4dB0EqlocifN53Xawqn0AhUgpriwdglZkHxaVzQA'
                }
            })
            .then(res => {
                req.headers.vote_sign = res.data.data
                next()
            })
            .catch(err => {
                console.log(err)
                next()
            })
    } else {
        next()
    }
}
