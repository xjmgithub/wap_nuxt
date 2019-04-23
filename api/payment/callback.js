import 'url'
import qs from 'qs'
import axios from 'axios'
import env from '../../env.js'

export default function(req, res, next) {
    let data = ''
    const urlobj = new URL('http://localhost' + req.url)

    req.on('data', function(d) {
        data += d
    })

    req.on('end', function() {
        const formType = req.headers['content-type'] && req.headers['content-type'].indexOf('json') >= 0
        const getBodyData = getPostData(data, formType)
        const sendData = Object.assign({}, getBodyData, qs.parse(urlobj.search.substr(1)))

        // 如果没有paytype的
        if (urlobj.pathname.length <= 1) {
            res.writeHead(301, {
                Location: `/hybrid/payment/payResult?result=0&money=0&currency=&seqNo=${sendData.seqNo || ''}`
            })
            res.end()
            return false
        }

        axios
            .post(`${env.apiURL}payment/v2/third-party-payment-web-notify${urlobj.pathname}`, sendData, {
                headers: {
                    token:
                        'eyJhbGciOiJIUzUxMiJ9.eyJhcHAiOjEsInVpZCI6MTIzNSwiY2NvZGUiOiJUWiIsInJvbGUiOjIsImRldiI6ImFuZG9yaWRfNERBQ0ZBQzYtNUM5OS00NUY0LUI0NzEtQjNDRTY1MEIwRUNDIiwiY3JlYXRlZCI6MTUyNDczNDI4MTAyNiwiZXhwIjoxODQwMDk0MjgxLCJjaWQiOjN9.hl9TS3duu8A0dUKas2UhKZewGEda2K-3fppPRuIgOxsM0F4dB0EqlocifN53Xawqn0AhUgpriwdglZkHxaVzQA'
                }
            })
            .then(response => {
                const d = response.data
                if (d && d.seqNo) {
                    res.writeHead(301, {
                        Location: encodeURI(
                            '/hybrid/payment/payResult?result=' +
                                (d.state == 3 ? 1 : 2) +
                                '&money=' +
                                d.amount +
                                '&currency=' +
                                d.currencySymbol +
                                '&seqNo=' +
                                d.seqNo
                        )
                    })
                    res.end()
                } else {
                    res.writeHead(301, {
                        Location: encodeURI(`/hybrid/payment/payResult?result=2&money=0&currency=&seqNo=`)
                    })
                    res.end()
                }
            })
            .catch(() => {
                res.writeHead(301, {
                    Location: encodeURI(`/hybrid/payment/payResult?result=2&money=0&currency=&seqNo=`)
                })
                res.end()
            })
    })
}

function getPostData(data, isjson) {
    if (isjson) {
        return JSON.parse(data)
    } else {
        return qs.parse(data)
    }
}
