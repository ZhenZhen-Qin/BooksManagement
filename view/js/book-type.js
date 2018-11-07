let storage = window.localStorage;
let uname = storage.getItem("uname");
let rootPath='http://127.0.0.1:3000';
getUserInfo();
function getUserInfo(){
    let  url = rootPath+"/user/findUserInfo";
    $.post(url,{uname},function (res) {
        console.log(res);
        if(res.err == 0){
            if(res.data[0].status == "2"){
                $(".uname").html(res.data[0].uname + "(超级管理员)")
            }
            $(".uname").html(res.data[0].uname + "(管理员)")

        }else{
            console.log("失败请重试")
        }
    })
}

getBookType();
function getBookType(){
    let url = rootPath + "/booktype/findBookType";
    $.post(url,{pagesize:10000,page:1},function (res) {
        console.log(res);
        if(res.err == 0){
            //    渲染页面
            var str = "";
            let resultArr = res.data.booklist;
            resultArr.forEach(function (item,idx) {
                str+=`<option value="${item.typeid}">${item.typeName}</option> `;
            })
            $(".alreadyType").html(str);

        }else{
            console.log("失败请重试")
        }

    })

}


$(".addTypeBtn").on("click",function(){
    let typeName = $("#user-name").val();
    let typeid = $("#user-name1").val();

    let url = rootPath + "/booktype/addBookType";
    $.post(url,{typeid,typeName},function (res) {
        console.log(res);
        if(res.err == 0){
            alert("添加成功");
            getBookType();

        }else{
            alert("已存在该类型ID");
        }
    })
});

//图书类别修改
let bookTypeId = location.search.split("?")[1].split("=")[1]? location.search.split("?")[1].split("=")[1] : "";
if(bookTypeId  != ""){
    let url = rootPath + "/booktype/findUnitBookType";
    $.post(url,{unitTypeId:bookTypeId},function (res) {
        let resObj =  res.data.booklist[0];  //对象
        if(res.err == 0){
            $("#user-name2").val(resObj.typeName);
            $("#user-name3").html(resObj.typeid);
        }else{
            console.log("失败请重试")
        }

    });

    $(".updateTypeBtn").on("click",function(){
        let typeName = $("#user-name2").val();
        let typeid = $("#user-name13").html();

        let url = rootPath + "/booktype/updateBookType";
        $.post(url,{typeid:typeid,typeName:typeName},function (res) {
            console.log(res);
            if(res.err == 0){
                alert("更新成功");
            }else{
                alert("更新失败");
            }
        })
    });
}

