
// $("#newBook").hide();
$("#addBook").on("click",function(){
    location.href = "#newBook";
});

let rootPath = "http://127.0.0.1:3000";

//获取类别id
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


//上传代码
var OL_Action_Root = "http://127.0.0.1:3000";
function Req_ajax() {
    console.log(111)
    console.log($("#imagelist"))
    var formData = new FormData()//创建一个formdata对象
    console.log(formData)
    formData.append("test", $("#imagelist")[0].files[0])
    console.log(formData)
    console.log(formData.get('test'));

    $.ajax({
        url: OL_Action_Root + '/uploads/img',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            var res = data;
            console.log(res);
            if (res.err == 0) {
                alert(res)
                console.log(res.data)
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
        console.log(res);
        if(res.err == 0){
            alert("添加成功");

        }else{
            console.log("失败请重试")
        }

    })

});


//显示所有图书

getBookType(6,1);
function getBookType(pagesize,page){
    let url = rootPath + "/book/findBooksInfo";
    let imgRootPath = "http://127.0.0.1:3000";
    $.post(url,{pagesize:pagesize,page:page},function (res) {
        console.log(res);
        if(res.err == 0){
            //    渲染页面
            var str = "";
            let resultArr = res.data.booklist;

            resultArr.forEach(function (item,idx) {
                let trStyle = idx%2 == 0 ? "even gradeC" : "gradeX";
                str+=`
                <tr class="${trStyle}">
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
                                                <a href="javascript:;">
                                                    <i class="am-icon-pencil"></i> 编辑
                                                </a>
                                                <a href="javascript:;" class="tpl-table-black-operation-del">
                                                    <i class="am-icon-trash"></i> 删除
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                
                `;
            })
            $("#bookList").html(str);






        //生成页码
            let Page



            到生成页码了














        }else{
            console.log("失败请重试")
        }

    })

}