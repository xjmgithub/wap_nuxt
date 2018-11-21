
import {setCookie} from '~/functions/utils'
export default ({ app, store }) => {

    // 5.5.3 开始客户端开始传国家信息
    if(!store.state.country.code){
        app.$axios.get('/vup/v1/ums/user/area',{
            headers:{
                token:store.state.token
            }
        }).then(res=>{
            if(res.status==200){
                store.commit('SET_AREA_INFO',res.data)
            }
        })
    }
}
