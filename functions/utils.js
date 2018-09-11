export const setCookie = (name, value, end, path, domain, secure) => {
    if (!name) {
        return false
    }
    let expires = ""
    if (end) {
        switch (end.constructor) {
            case Number:
                expires = end === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + end
                break
            case String:
                expires = "; expires=" + end
                break
            case Date:
                expires = "; expires=" + end.toUTCString()
                break
        }
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value)
        + expires
        + (domain ? "; domain=" + domain : "")
        + (path ? "; path=" + path : ";path=/")
        + (secure ? "; secure" : "")
    return true
}

export const getCookie = (name) => {
    let value = document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")
    return decodeURIComponent(value) || null
}