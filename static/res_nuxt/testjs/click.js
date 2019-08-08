/**
 * Created by dery on 2016/4/7.
 */
function clickEgg(link,ref,isanonymous){
    window.location.href=link;
    ga('send', 'event', 'Click_egg', isanonymous,ref ,1);
}

function clickShareRegister(link,value){
    if(link!=''){
        window.location.href=link;
    }
    ga('send', 'event', 'Share', 'Register',value ,1);
}