export const getCookieFromReq = function(headers) {
    if (headers && headers.cookie) {
        const _COOKIE = {}
        headers.cookie.split(';').forEach(Cookie => {
            const parts = Cookie.split('=')
            _COOKIE[parts[0].trim()] = (parts[1] || '').trim()
        })
        return _COOKIE
    } else {
        return {}
    }
}
