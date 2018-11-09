let rootPath = "http://127.0.0.1:3000";

$("#sendYzCode").on("click",function(){
    let mail = $("#email").val();
    if(mail == ""){
        alert("请输入正确的邮箱");
    }else{
        let url = rootPath + "/sendMail/getCode";
        $.post(url,{mail},(res)=>{
            console.log(res);
            if(res.err == 0){

                var timer = "";
                clearInterval(timer);

                $(".tipYzCode").html("验证码发送成功").css("color","#58bc58");
                let i = 60;
                timer = setInterval(function () {
                    if(i<=0){
                        $(".tipYzCode").html("验证码已经失效").css("color","#c40000");
                        clearInterval(timer);
                    }else{
                        i--;
                        $(".tipYzCode").html("验证码有效时间（"+i+"）").css("color","#58bc58");
                    }

                },1000)

            }else{
                $(".tipYzCode").html("验证码发送失败").css("color","#c40000");
            }


        })


    }
});