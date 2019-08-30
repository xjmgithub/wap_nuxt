import axios from 'axios'
import qs from 'qs'

export default function(req, res, next) {
    const urlobj = new URL('http://localhost' + req.url)
    const query = qs.parse(urlobj.search.substr(1))
    const areaID = query.areaID
    axios
        .get(`http://pc.startimestv.com/home/home/faq?areaID=${areaID}`)
        .then(data => {
            res.end(
                JSON.stringify({
                    code: 200,
                    message: 'success',
                    data: data.data
                })
            )
            return false
        })
        .catch(err => {
            console.log(err)
            res.end(
                JSON.stringify({
                    code: 101,
                    message: 'get faq error',
                    data: ''
                })
            )
        })
}