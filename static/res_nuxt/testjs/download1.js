function download(link,ref){
    window.location.href=link;
    // ga('send', 'event', 'APK_DOWNLOAD', 'GOOGLEPLAY',ref ,1);
}
function down(alert,ref){
    if(alert!=""){
        alert(alert);
    }
    window.open("./DownloadAPP.php");
    // ga('send', 'event', 'APK_DOWNLOAD', 'DIRECT',ref,1);
}