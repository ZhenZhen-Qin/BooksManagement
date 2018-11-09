let storage = window.localStorage;
let uname = storage.getItem("uname");
let rootPath='http://127.0.0.1:3000';

getUserInfo();
function getUserInfo(){
    let  url = rootPath+"/user/findUserInfo";
    $.post(url,{uname},function (res) {
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


$("#newBook").hide();
$("#addBook").on("click",function(){
    $("#newBook").show();
    location.href = "#newBook";
    $("#addBookBtn").show().next().hide();
});


//获取类别id
getBookType();
function getBookType(){
    let url = rootPath + "/booktype/findBookType";
    $.post(url,{pagesize:10000,page:1},function (res) {
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


//上传代码
var OL_Action_Root = "http://127.0.0.1:3000";
function Req_ajax() {

    var formData = new FormData()//创建一个formdata对象

    formData.append("test", $("#imagelist")[0].files[0]);


    $.ajax({
        url: OL_Action_Root + '/uploads/img',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            var res = data;
            if (res.err == 0) {
                document.getElementById("status").innerHTML = "<span style='color:#58bc58'>上传成功！</span>";
                $('.uploadImg').attr('src', OL_Action_Root + "/public" + res.data).attr("imgurl", res.data)
            }
            else {
                document.getElementById("status").innerHTML = "<span style='color:#EF0000'>文件上传失败！<br>原因是：" + res.msg + "</span>";
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            document.getElementById("status").innerHTML = "<span style='color:#EF0000'>连接不到服务器，请检查网络！</span>";
        }
    });
}

//添加图书
$("#addBookBtn").on("click",function () {
    let bookObj = {
        bookname:$("#book-name").val(),
        typeid:$(".alreadyType").val(),
        author:$("#author").val(),
        publish:$("#publish").val(),
        unitprice:$("#unitprice").val(),
        bookimg:$(".uploadImg").attr("imgurl"),
        bookdesc:$("#user-intro").val(),
        stock:$(".stock").val(),
    };

    let url = rootPath +"/book/addBookInfo";

    $.post(url,bookObj,function (res) {
        if(res.err == 0){
            alert("添加成功");

        }else{
            console.log("失败请重试")
        }

    })

});


//显示所有图书

showBooks(6,1);
function showBooks(pagesize,page){
    let url = rootPath + "/book/findBooksInfo";

    $.post(url,{pagesize:pagesize,page:page},function (res) {
        if(res.err == 0){

            render(res,pagesize,page);

            //生成页码
            let PageNum = Math.ceil(res.data.total/pagesize);
            var strPage = `
                <li class=""><span  onclick="setPage(${pagesize},${page-1})">«</span></li>
            `
            for(let i=1;i<=PageNum;i++){
                strPage += `<li><span onclick="setPage(${pagesize},${i})">${i}</span></li>`;
            }
            strPage+=` <li><span onclick="setPage(${pagesize},${page+1})">»</span></li>`;

            $(".page").html(strPage);
            var thisli = $(".page li").eq(page);
            thisli.addClass("am-active").siblings().removeClass("am-active");


        }else{
            console.log("失败请重试")
        }

    })

}


//渲染页面
function render(res,pagesize,page) {
    //    渲染页面
    var str = "";
    let imgRootPath = "http://127.0.0.1:3000";
    console.log(res)
    let resultArr = res.data.booklist;
    $(".total").html(res.data.total);
    resultArr.forEach(function (item,idx) {
        // var objStr = JSON.stringify(item);
        // console.log(typeof objStr)
        let trStyle = idx%2 == 0 ? "even gradeC" : "gradeX";
        str+=`
                <tr class="${trStyle}" date-bookid="${item._id}">
                                        <td>${idx+1}</td>
                                        <td>
                                            <img src="${imgRootPath}/public${item.bookimg}" class="tpl-table-line-img" alt="">
                                        </td>
                                        <td class="am-text-middle">${item.bookname}</td>
                                        <td class="am-text-middle">${item.typeid}</td>
                                        <td class="am-text-middle">${item.author}</td>
                                        <td class="am-text-middle">${item.publish}</td>
                                        <td class="am-text-middle">${item.unitprice}</td>
                                        <td class="am-text-middle">${item.stock}</td>
                                        <td class="am-text-middle">
                                            <div class="tpl-table-black-operation">
                                                <a onclick = "updateBookInfo('${item._id}')">
                                                    <i class="am-icon-pencil"></i> 编辑
                                                </a>
                                                <a href="javascript:;" class="tpl-table-black-operation-del" onclick = "delBookInfo('${item._id}')">
                                                    <i class="am-icon-trash"></i> 删除
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                
                `;
    });
    $("#bookList").html(str);





    //显示该类别的图书信息
    $($(".am-selected-list")[0]).on("click","li",function(){
        page = 1
        let typeid =  $(this).attr("data-value");
        showTypeBooks(typeid,pagesize,page);

    });
}


//生成页码
function setPage(pagesize,page) {
    showBooks(pagesize,page);
}
// 生成分页图书
function setTypePage(typeid,pagesize,page) {
    showTypeBooks(typeid,pagesize,page);
}


//显示该类别的图书信息
function showTypeBooks(typeid,pagesize,page){
    let url = rootPath + "/book/findBooksByType";
    $.post(url,{typeid,pagesize,page},function (res) {
        if(res.err == 0){
            render(res,pagesize,page);
            //生成页码
            let PageNum = Math.ceil(res.data.total/pagesize);
            var strPage = `
                <li class=""><span  onclick="setTypePage(${typeid},${pagesize},${page-1})">«</span></li>
            `
            for(let i=1;i<=PageNum;i++){
                strPage += `<li><span onclick="setTypePage(${typeid},${pagesize},${i})">${i}</span></li>`;
            }
            strPage+=` <li><span onclick="setTypePage(${typeid},${pagesize},${page+1})">»</span></li>`;

            $(".page").html(strPage);
            var thisli = $(".page li").eq(page);
            thisli.addClass("am-active").siblings().removeClass("am-active");
        }
    })
}


//模糊查询
$(".findKeyword").on("click",function(){
   let keyword = $(".keyword").val();
   let pagesize=1000;
   let page = 1;
    let url = rootPath + "/book/findBookByKw";
    if(keyword != ""){
        $.post(url,{keyword,pagesize,page},function (res) {
            if(res.err == 0){
                console.log(res);
                render(res,pagesize,page);
            }
        })
    }

})


// 图书的编辑（修改信息）
function updateBookInfo(_id){
    location.href = "#newBook";
    $("#newBook").show();
    $("#addBookBtn").hide().next().show();
    let url = rootPath + "/book/findUnitBook";

    $.post(url,{_id},function (res) {
        if(res.err == 0){

            $("#book-name").val(res.data.booklist[0].bookname);
            $($(".alreadyType")[1]).val(res.data.booklist[0].typeid);
            $("#author").val(res.data.booklist[0].author);
            $("#publish").val(res.data.booklist[0].publish);
            $("#unitprice").val(res.data.booklist[0].unitprice);
            $(".uploadImg").attr("src",rootPath+"/public"+res.data.booklist[0].bookimg);
            $("#user-intro").val(res.data.booklist[0].bookdesc);
            $(".stock").val(res.data.booklist[0].stock);

            // 图书的修改
            $("#updateBookBtn").on("click",function(){

                let bookObj = {
                    _id:_id,
                    bookname:$("#book-name").val(),
                    typeid:$(".alreadyType").val(),
                    author:$("#author").val(),
                    publish:$("#publish").val(),
                    unitprice:$("#unitprice").val(),
                    bookimg:$(".uploadImg").attr("imgurl"),
                    bookdesc:$("#user-intro").val(),
                    stock:$(".stock").val(),
                    typeid:$($("li").filter(".am-checked")[1]).attr("data-value")
                };

                console.log(bookObj);
                updateBook(bookObj);
            })

        }
    })
}

//图书的删除
function delBookInfo(_id) {
    if(confirm("您确定要删除该条数据吗？")){
        let url = rootPath + "/book/removeBookInfo";
        $.post(url,{_id},function (res) {
            if(res.err == 0){
                showBooks(6,1);
            }
        })
    }
}
//图书的修改
function updateBook(bookObj) {
        let url = rootPath + "/book/updateBookInfo";
        $.post(url,bookObj,function (res) {
            if(res.err == 0){
                alert("修改成功");
                showBooks(6,1);
            }
        })

}