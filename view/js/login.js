// 前端的登录功能
$("#loginBtn").on("click",function(){
    let uname = $("#user-name").val();
    let pwd = $("#user-pwd").val();

    let rootPath='http://127.0.0.1:3000';

    let url = rootPath + "/user/userLogin";
    console.log(url)
    let data = {uname:uname,pwd:pwd};
    console.log(data)
    $.post(url,data,function(res){
        console.log(res)
        if(res.err == 0){
            alert("登录成功");
            let storage=window.localStorage;
            storage.setItem("uname",uname);
            location.href = "index.html";
        }else{
            //提示重新填写
            alert("失败请重试")
        }
    })

});