

function downloadGoogle(link,ref){
    window.location.href=link;
    ga('send', 'event', 'landingpage', 'googleplay_click',ref ,1);
}


function downloadPull(ref){
    window.open("./DownloadAPP.php");
    ga('send', 'event', 'landingpage', 'apk_click',ref,1);
}
function downloadAppStore(link,ref){
    window.location.href=link;
    ga('send', 'event', 'landingpage', 'appstore_click',ref ,1);
}
function goWeb(link,ref){
    window.location.href=link;
    ga('send', 'event', 'landingpage', 'website_click',ref ,1);
}


// 新landingpage调用
function downloadNewGoogle(link,ref){
    window.location.href=link;
    _mm.sendEvent({
        category: "langingpage",
        action: "show",
        label: window.location.href
    });
}
function downloadNewPull(link){
    window.open("./DownloadAPP.php");
    _mm.sendEvent({
        category: "langingpage",
        action: "download_click",
        label: window.location.hostname + window.location.pathname + window.location.search
    });
}
function downloadNewAppStore(link,ref){
    _mm.sendEvent({
        category: "langingpage",
        action: "appstore_click",
        label: window.location.hostname + window.location.pathname + window.location.search
    });
    window.location.href=link;
}
