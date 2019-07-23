import axios from 'axios'

export default function(req, res, next) {
    axios
        .get('http://upms.startimestv.com/cms/public/app')
        .then(data => {
            const url = data.data.apkUrl
            const direct = url.indexOf('google') > 0 ? url.replace('google', 'officialWap') : url
            res.writeHead(301, {
                Location: direct
            })
            res.end()
            return false
        })
        .catch(err => {
            console.log(err)
            res.end(
                JSON.stringify({
                    code: 101,
                    message: 'get apk url error',
                    data: ''
                })
            )
        })
}
