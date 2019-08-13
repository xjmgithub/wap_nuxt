function historyLotteryCode_1(){
    $.ajax({
        type: 'GET',
        url : 'test_reload.php',
        data: "time=",
        success: function(data){
            //alert(data);
           /* var partn = /<script.*>.*<\/script>/;
            if( data == 'empty' && partn.test(data) ){return;}
            eval_r("data="+data);*/
            document.getElementById("chat_msg").innerHTML=data;
            setTimeout(historyLotteryCode_1,5000);
        }
    });
}

setTimeout(historyLotteryCode_1,5000);

