// 前端的登录功能
$("#login").on("click",function(){
    let uname = $("#uname").val();
    let pwd = $("#pwd").val();

    let rootPath='http://127.0.0.1:3000';

    let url = rootPath + "/user/userLogin";
    console.log(url)
    let data = {uname:uname,pwd:pwd};
    console.log(data)
    $.post(url,data,function(res){
        if(res == "loginOk"){
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