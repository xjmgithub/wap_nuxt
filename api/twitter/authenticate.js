let axios = require('axios')
let url = require('url')
let queryString = require('querystring')

export default function(req, res, next) {
    let args = url.parse(req.url).query
    let query = queryString.parse(args)

    if (query.oauth_token) {
        axios({
            url: 'https://api.twitter.com/oauth/authenticate?oauth_token=' + query.oauth_token,
            method: 'GET',
            headers:{
                'Accept-Language':'en-US,en;q=0.5'
            }
        })
            .then(res1 => {
                res.end(res1.data)
            })
            .catch(err => {
                res.end(
                    JSON.stringify({
                        code: 103,
                        message: 'oauth_token invalid'
                    })
                )
            })
    } else {
        res.end(
            JSON.stringify({
                code: 102,
                message: 'param oauth_token can not be null'
            })
        )
    }
}
