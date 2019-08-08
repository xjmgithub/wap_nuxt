function skip(type,page,ownid,plat) {
    if(plat=="app"){
        window.getChannelId.toAppPage(type,page,ownid);
    }else if(plat=="app_ios"){

    }

}
function skipchatroom(type,page,ownid,plat,name,url){
    if(plat=="app"){
        window.getChannelId.toAppPage(type,page,ownid);
        clickChatRoom(name);
    }else if(plat=="app_ios"){

    }else{
        window.location.href=url;
        clickChatRoom(name);
    }
}
function skipBranner(category,action,name,url){
    window.location.href=url;
    clickproject(category,action,name)
}
function skipOpenWeekChannel(name,url,plat){
    window.location.href=url;
    if(plat=="app"){
        ga('send', 'event', "Open Week", "main page","channel click,"+ name,1);
    }else{
        ga('send', 'event', "Open Week", "main page","channel click,"+ name,1);
    }
}
function skipChatRoom(type,page,ownid,plat,category,action,name,url) {
    if(plat=="app"){
        window.getChannelId.toAppPage(type,page,ownid);
        clickproject(category,action,name)
    }else if(plat=="app_ios"){

    }else{
        window.location.href=url;
        clickproject(category,action,name)
    }
}
function clickproject(category,action,name){
    ga('send', 'event', category, action, name,1);
}
function skipCopa(type,page,ownid,plat,name) {
    if(plat=="app"){
        window.getChannelId.toAppPage(type,page,ownid);
        clickVideo(name);
    }else if(plat=="android"){
        swal({
            title: "",
            text: "Live streaming available only on Startimes App, click on 'Download' to get the Android app for free access to International Champions Cup.",
            imageUrl: "resource/img/tips.png",
            confirmButtonColor: "#FF5C05",
            confirmButtonText:"Download",
            showCancelButton: true,
            closeOnConfirm: true,
            showLoaderOnConfirm: true
        }, function(){
            window.location.href="http://cdn.startimestv.com/release/startimes.apk";
        });
    }else{
        swal({
            title: "",
            text: "Live streaming not supported on your device, access International Champions Cup free by downloading the StarTimes App with an Android enabled device.",
            imageUrl: "resource/img/tips.png",
            confirmButtonColor: "#FF5C05",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        });
    }

}
function skipRecharge(type,page,ownid,plat,name){
    if(plat=="app"){
        window.getChannelId.toAppPage(type,page,ownid);
        clickproject("Open Week","Recharge",name);
    }else if(plat=="android"){
        swal({
            title: "",
            text: "Live streaming available only on Startimes App, click on 'Download' to get the Android app for free access to Open Week.",
            imageUrl: "resource/img/tips.png",
            confirmButtonColor: "#FF5C05",
            confirmButtonText:"Download",
            showCancelButton: true,
            closeOnConfirm: true,
            showLoaderOnConfirm: true
        }, function(){
            window.location.href="http://cdn.startimestv.com/release/startimes.apk";
        });
        clickproject("Open Week","Recharge",name);
    }else{
        clickproject("Open Week","Recharge",name);
        swal({
            title: "",
            text: "Live streaming not supported on your device, downloading the StarTimes App with an Android enabled device.",
            imageUrl: "resource/img/tips.png",
            confirmButtonColor: "#FF5C05",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        });
    }
}
function skipBigImage(type,page,ownid,plat,name) {
    if(plat=="app"){
        window.getChannelId.toAppPage(type,page,ownid);
        clickproject("Open Week","channel page","live click,"+name);
    }else if(plat=="app_ios"){
        page = page.replace('org.libsdl.app.Player?','startimes://player')
        window.location.href = page
        clickproject("Open Week","channel page","live click,"+name);
    }else if(plat=="android"){
        var pa=page.replace(/&/g, "**");
        var base64=BASE64.encoder(pa);
        var url="starvideo://platformapi/webtoapp?target="+base64;
        window.location.href=url;
        setTimeout(function(){window.location='market://details?id=com.star.mobile.video';}, 30);
        //swal({
        //    title: "",
        //    text: "Live streaming available only on Startimes App, click on 'Download' to get the Android app for free access to Open Week.",
        //    imageUrl: "resource/img/tips.png",
        //    confirmButtonColor: "#FF5C05",
        //    confirmButtonText:"Download",
        //    showCancelButton: true,
        //    closeOnConfirm: true,
        //    showLoaderOnConfirm: true
        //}, function(){
        //    window.location.href="http://cdn.startimestv.com/release/startimes.apk";
        //});
        clickproject("Open Week","channel page","live click,"+name);
    }else{
        clickproject("Open Week","channel page","live click,"+name);
        swal({
            title: "",
            text: "Live streaming not supported on your device, downloading the StarTimes App with an Android enabled device.",
            imageUrl: "resource/img/tips.png",
            confirmButtonColor: "#FF5C05",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        });
    }
}
function skipCopaCategoryopenweek(category,type,page,ownid,plat,name) {
    if(plat=="app"){
        window.getChannelId.toAppPage(type,page,ownid);
        clickproject(category,"Channel page","Video click,"+name);
        clickVideoCategory(category,name);
    }else if(plat=="app_ios"){
        page = page.replace('org.libsdl.app.Player?','startimes://player')
        window.location.href = page
        clickproject(category,"Channel page","Video click,"+name);
    }else if(plat=="android"){
        var pa=page.replace(/&/g, "**");
        var base64=BASE64.encoder(pa);
        var url="starvideo://platformapi/webtoapp?target="+base64;
        window.location.href=url;
        setTimeout(function(){window.location='market://details?id=com.star.mobile.video';}, 30);
        clickproject(category,"Channel page","Video click,"+name);
            //swal({
            //    title: "",
            //    text: "Live streaming available only on Startimes App, click on 'Download' to get the Android app for free access to Open Week.",
            //    imageUrl: "resource/img/tips.png",
            //    confirmButtonColor: "#FF5C05",
            //    confirmButtonText:"Download",
            //    showCancelButton: true,
            //    closeOnConfirm: true,
            //    showLoaderOnConfirm: true
            //}, function(){
            //    window.location.href="http://cdn.startimestv.com/release/startimes.apk";
            //});
    }else{
        clickproject(category,"Channel page","Video click,"+name);
        swal({
            title: "",
            text: "Live streaming not supported on your device,  downloading the StarTimes App with an Android enabled device.",
            imageUrl: "resource/img/tips.png",
            confirmButtonColor: "#FF5C05",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        });
    }

}
function skipCopaCategory(category,type,page,ownid,plat,name) {
    if(plat=="app"){
        window.getChannelId.toAppPage(type,page,ownid);
        clickVideoCategory(category,name);
    }else if(plat=="app_ios"){
        page = page.replace('org.libsdl.app.Player?','startimes://player')
        window.location.href = page
        clickVideoCategory(category,name);
    }else if(plat=="android"){
        var pa=page.replace(/&/g, "**");
        var base64=BASE64.encoder(pa);
        var url="starvideo://platformapi/webtoapp?target="+base64;
        window.location.href=url;
        setTimeout(function(){window.location='market://details?id=com.star.mobile.video';}, 30);
    }else{
        swal({
            title: "",
            text: "Live streaming not supported on your device,  downloading the StarTimes App with an Android enabled device.",
            imageUrl: "resource/img/tips.png",
            confirmButtonColor: "#FF5C05",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        });
    }
}
function skipChannel(category,type,page,ownid,plat,name) {
    if(plat=="app"){
        window.getChannelId.toAppPage(type,page,ownid);
        clickproject(category,"info_watch_click",name);
    }else if(plat=="app_ios"){
        page = page.replace('org.libsdl.app.Player?','startimes://player')
        window.location.href = page
        clickproject(category,"info_watch_click",name);
    }else if(plat=="android"){
        var pa=page.replace(/&/g, "**");
        var base64=BASE64.encoder(pa);
        var url="starvideo://platformapi/webtoapp?target="+base64;
        window.location.href=url;
        setTimeout(function(){window.location='market://details?id=com.star.mobile.video';}, 30);
        clickproject(category,"info_watch_click",name);
    }
}
function skipCopaCategoryLiveChannel(category,type,page,ownid,plat,name) {
    if(plat=="app"){
        window.getChannelId.toAppPage(type,page,ownid);
        clickproject(category,"Live Click",name);
    }else if(plat=="app_ios"){
        page = page.replace('org.libsdl.app.Player?','startimes://player')
        window.location.href = page
        clickproject(category,"Live Click",name);
    }else if(plat=="android"){
        var pa=page.replace(/&/g, "**");
        var base64=BASE64.encoder(pa);
        var url="starvideo://platformapi/webtoapp?target="+base64;
        window.location.href=url;
        setTimeout(function(){window.location='market://details?id=com.star.mobile.video';}, 30);
        clickproject(category,"Live Click",name);
    }else{
        swal({
            title: "",
            text: "Live streaming not supported on your device,  downloading the StarTimes App with an Android enabled device.",
            imageUrl: "resource/img/tips.png",
            confirmButtonColor: "#FF5C05",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        });
    }
}
function skipBoss(type,page_type) {
    if(type == 1){
        if(page_type == 1){
            ga('send', 'event', 'Self_service', 'Recharge', 'Bundesliga',1);
        }else{
            ga('send', 'event', 'Self_service', 'Recharge', 'SerieA',1);
        }
    }else{
        if(page_type == 1){
            ga('send', 'event', 'Self_service', 'Bouquet', 'Bundesliga',1);
        }else{
            ga('send', 'event', 'Self_service', 'Bouquet', 'SerieA',1);
        }

    }
    window.getChannelId.showAlertPromptIfMatchNotLogin();
}
function clickVideo(name){
    ga('send', 'event', 'icc', 'VIDEO', name,1);
}
function clickChatRoom(name){
    ga('send', 'event', 'Commentary', 'Commentary_chat', name,1);
}
function clickTab(tab){
    ga('send', 'event', 'icc', 'Tab', tab,1);
}
function clickVideoCategory(category,name){
    ga('send', 'event', category, 'VIDEO', name,1);
}
function clickTabCategory(category,tab){
    ga('send', 'event', category, 'Tab', tab,1);
}
function clickBrannerCategory(category,tab){
    ga('send', 'event', category, 'Banner', tab,1);
}
function SkipEpg(programId,type,isSubscribe,plat){
    if(plat=="app"){
        if(type==1 && isSubscribe==1){
            window.getChannelId.showAlertPrompt(programId);
        }
    }else if(plat=="app_ios"){

    }
}
function showAlert(title,content,cancel,confirm,plat){
    if(plat=="app"){
        window.getChannelId.alertLive(title,content,cancel,confirm);
    }else if(plat=="app_ios"){

    }else if(plat=="android"){
        swal({
            title: "",
            text: "Live streaming available only on Startimes App, click on 'Download' to get the Android app for free access to International Champions Cup.",
            imageUrl: "resource/img/tips.png",
            confirmButtonColor: "#FF5C05",
            confirmButtonText:"Download",
            showCancelButton: true,
            closeOnConfirm: true,
            showLoaderOnConfirm: true
        }, function(){
            window.location.href="http://cdn.startimestv.com/release/startimes.apk";
        });
    }else{
        swal({
            title: "",
            text: "Live streaming not supported on your device,  downloading the StarTimes App with an Android enabled device.",
            imageUrl: "resource/img/tips.png",
            confirmButtonColor: "#FF5C05",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        });
    }

}
function showShareCustorm(content){
    window.getChannelId.shareContentCustorm(content+" %1$s ","","","","","","","https://bnc.lt/Facebook_ICC_Share", "https://bnc.lt/Twitter_ICC_Share", "https://bnc.lt/Whatsapp_ICC_Share",
        "https://bnc.lt/Email_ICC_Share", "https://bnc.lt/SMS_ICC_Share", "https://bnc.lt/BBM_ICC_Share", "http://m.startimestv.com/resource/img/icc_banner_detial.png", "icc");
}
function showShareCustormContent(content,url,imageurl,match,plat){
    if(plat=="app"&&window.getChannelId.shareContentCustorm){
        window.getChannelId.shareContentCustorm(content+" %1$s ","","","","","","",url, url, url,
            url, url, url, imageurl, match);
    }
}
function showShareContentopen(content,url,imageurl,match,plat,name,category){
    if(plat=="app"){
        window.getChannelId.showCustorm(content+" %1$s ",url, url, url,
            url, url, url, imageurl, match);
        clickproject(category,"Share",name);
    }else {
        clickproject(category,"Share",name);
    }
}
function showShareContent(content,url,imageurl,match,plat){
    if(plat=="app"){
        window.getChannelId.showCustorm(content+" %1$s ",url, url, url,
            url, url, url, imageurl, match);
    }else if(plat=="app_ios"){

    }

}
function showShare(content){
    window.getChannelId.showCustorm(content+" %1$s ","https://bnc.lt/FB_ICC_Fixture", "https://bnc.lt/Twitter_ICC_Fixture", "https://bnc.lt/Whatsapp_ICC_Fixture",
        "https://bnc.lt/Email_ICC_Fixture", "https://bnc.lt/SMS_ICC_Fixture", "https://bnc.lt/BBM_ICC_Fixture", "http://m.startimestv.com/startimes_php/resource/img/icc_banner_detial.png", "icc");
}
function finish(){
        window.getChannelId.finish();
}
function Toast(msg,duration){
    duration=isNaN(duration)?3000:duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText="width:60%; min-width:150px; background:#000; opacity:0.5; height:40px; color:#fff; line-height:40px; text-align:center; border-radius:5px; position:fixed; top:40%; left:20%; z-index:999999; font-weight:bold;";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}


