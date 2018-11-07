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


$(".typeManage").hide();
$("#typeManage").on("mouseenter",function(){
    $(".typeManage").show(500);
})
$(".typeManage").on("mouseleave",function(){
    $(this).hide(500);
})

//新增类别
$(".addType").on("click",function(){
    console.log(666)
    location.href = "book-type.html#addType";
})
$(".updateType").on("click",function(){
    console.log(77)
    location.href = "index.html#updateType";
});


//获取图书类别信息
getBookType();
function getBookType(){


    let url = rootPath + "/booktype/findBookType";
    console.log(url);

    $.post(url,{pagesize:10,page:1},function(res){
        console.log(res);
        if(res.err == 0){
        //    渲染页面
            var str = "";
            let resultArr = res.data.booklist;
            resultArr.forEach(function (item,idx) {
                let trStyle = idx%2==0? "gradeX":"even gradeC";
                str+=`
                     <tr class=${trStyle}>
                                    <td>${idx+1}</td>
                                    <td>${item.typeName}</td>
                                    <td>${item.typeid}</td>
                                    <td>
                                        <div class="tpl-table-black-operation">
                                            <a class="manageBookType" onclick="getBookTypeId(${item.typeid})">
                                                <i class="am-icon-pencil"></i> 管理
                                            </a>
                                            <a onclick="delBookType(${item.typeid},'${item.typeName}')"  class="tpl-table-black-operation-del">
                                                <i class="am-icon-trash"></i> 删除
                                            </a>

                                        </div>
                                    </td>
                                </tr>
                `;
            });
            $(".setBookType").html(str);



        }else{
            console.log("失败请重试")
        }
    })
}


//图书类别编辑
function getBookTypeId(id){
    let typeid = id;
    location.href = "book-type.html?bookTypeId="+typeid;
}

//类别的删除
function delBookType(id,name){
    if(confirm("您确定要删除  "+name+"  这个类别吗？")){
    //    单个商品的删除
        let url = rootPath + "/booktype/removeBookType";
        $.post(url,{typeid:id},function(res){
            console.log(res);
            if(res.err == 0){
                alert("删除成功");
                getBookType();

            }else{
                console.log("失败请重试")
            }
        })

    }
}

//模糊查询
$("#byKWbtn").on("click",function () {
    let keyword = $("#keyW").val();
    let url = rootPath + "/booktype/findBookTypeByKw";
    $.post(url,{keyword},function (res) {
        console.log(res);
        if(res.err == 0){
            $("#findKW").html("查询结果").css("color","#58bc58");
            var str = "";
            let resultArr = res.data;
            resultArr.forEach(function (item,idx) {
                let trStyle = idx%2==0? "gradeX":"even gradeC";
                str+=`
                     <tr class=${trStyle}>
                                    <td>${idx+1}</td>
                                    <td>${item.typeName}</td>
                                    <td>${item.typeid}</td>
                                    <td>
                                        <div class="tpl-table-black-operation">
                                            <a class="manageBookType" onclick="getBookTypeId(${item.typeid})">
                                                <i class="am-icon-pencil"></i> 管理
                                            </a>
                                            <a onclick="delBookType(${item.typeid},'${item.typeName}')"  class="tpl-table-black-operation-del">
                                                <i class="am-icon-trash"></i> 删除
                                            </a>

                                        </div>
                                    </td>
                                </tr>
                `;
            });
            $("#showFindKW").html(str);

        }else{
            console.log("失败请重试")
        }

    })
})