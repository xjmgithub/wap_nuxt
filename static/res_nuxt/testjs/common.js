
/* 
    param caseobj vue组件实例
    opt ajax参数
*/
function mAjax(caseobj,opt){
    $.ajax({
        url: opt.url,
        method: opt.method||'get',
        dataType: 'json',
        data: opt.data,
        success:function(data){
            if(data.code){
                if(data.code==401||data.code==204){
                    if(window.location.href.indexOf('/wap/')>0){
                        window.location.href = '/wap/users/login.php?pre=' + encodeURI(window.location.href)
                    }else{
                        window.location.href = '/users/login.php?pre=' + encodeURI(window.location.href)
                    }
                }else{
                    opt.success(data)
                }
            }else{
                opt.success(data)
            }
        },
        error:function(err){
            console.log(err)
            caseobj.$toast('unknown error')
        }
    })
}