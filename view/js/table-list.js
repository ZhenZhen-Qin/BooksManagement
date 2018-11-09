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


//显示所有借阅信息
showBooks(6,1);
function showBooks(pagesize,page){
    let url = rootPath + "/borrowbook/findBorrowBook";

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

function setPage(pagesize,page) {
    showBooks(pagesize,page);
}

//渲染页面
function render(res,pagesize,page) {
    //    渲染页面
    var str = "";
    let imgRootPath = "http://127.0.0.1:3000";
    console.log(res)
    let resultArr = res.data.booklist;
    $(".total").html(res.data.total);
    resultArr.forEach(function (item,idx){
        let obj = JSON.stringify(item);
        let trStyle = idx%2 == 0 ? "even gradeC" : "gradeX";
        str+=`
                <tr class="${trStyle}" date-borrowid="${item._id}">
                                        <td>${idx+1}</td>
                                        <td>${item.readerName}</td>
                                        <td class="am-text-middle" date-bookid="${item.bookid}">${item.bookname}</td>
                                        <td class="am-text-middle">${item.borrowDate}</td>
                                        <td class="am-text-middle">${item.returnDate}</td>
                                        <td class="am-text-middle">${item.fine}</td>
                                        <td class="am-text-middle">
                                            <div class="tpl-table-black-operation">
                                                <a class="UpdateBorrow" onclick = "updateBorrowInfo('${item._id}')">
                                                    <i class="am-icon-pencil"></i> 编辑
                                                </a>
                                                <a href="javascript:;" class="tpl-table-black-operation-del" onclick = "delBorrowInfo('${item._id}')">
                                                    <i class="am-icon-trash"></i> 删除
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                
                `;
    });
    $("#borrowList").html(str);

    //修改借阅信息





    //显示该类别的图书信息
    $($(".am-selected-list")[0]).on("click","li",function(){
        page = 1
        let typeid =  $(this).attr("data-value");
        showTypeBooks(typeid,pagesize,page);

    });
}


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


//添加借阅信息
$("#newBorrowBox").hide();
$("#NewBorrow").on("click",function () {
    location.href = "#newBorrowBox";
    $("#newBorrowBox").show();
    $("#updateBtn").hide();
    $("#addBtn").show();
});

//添加借阅信息提交
$("#addBtn").on("click",function () {
    let borrowObj = {
        typeid : $($(".alreadyType")[1]).val(),
        readerName : $("#reader").val(),
        bookname : $("#bookName").val(),
        bookid : $("#bookId").val(),
        borrowDate : $("#borrowDate").val(),
        returnDate : $("#returnDate").val(),
        fine : $("#fine").val(),
    };

    let url = rootPath +"/borrowbook/addBorrowBook";

    $.post(url,borrowObj,function (res) {
        if(res.err == 0){
            console.log(res)
            alert("添加成功");

        }else{
            console.log("失败请重试")
        }

    })
});



//删除借阅记录
function delBorrowInfo(_id) {
    if(confirm("您确定要删除该条记录吗？")){
        let url = rootPath + "/borrowbook/removeBorrowBook";
        $.post(url,{_id},function (res) {
            if(res.err == 0){
                showBooks(6,1);
            }
        })
    }
}

//修改
function updateBorrowInfo(_id){
    location.href = "#newBorrowBox";
    $("#newBorrowBox").show();
    $("#updateBtn").show();
    $("#addBtn").hide();

    let url = rootPath + "/borrowbook/findUnitBorrowBook";

    $.post(url,{_id},function (res) {
        if(res.err == 0){
            console.log(res.data.booklist);

            $("#reader").val(res.data.booklist[0].readerName);
            $("#bookName").val(res.data.booklist[0].bookname);
            $("#bookId").val(res.data.booklist[0].bookid);//这里是书的集合的_id
            // $($(".alreadyType")[1]).val(res.data.booklist[0].typeid);
            $("#borrowDate").val(res.data.booklist[0].borrowDate);
            $("#returnDate").val(res.data.booklist[0].returnDate);
            // $(".alreadyType").val(res.data.booklist[0].unitprice);  所属类别
            $("#fine").val(res.data.booklist[0].fine);

            // 图书的修改
            $("#updateBtn").on("click",function(){

                // { bookid,bookname,borrowDate,returnDate,fine} readerName不可更改

                let borrowObj = {
                    _id:_id,
                    readerName:$("#reader").val(),
                    bookid:$("#bookId").val(),
                    bookname:$("#bookName").val(),
                    borrowDate:$("#borrowDate").val(),
                    returnDate:$("#returnDate").val(),
                    fine:$("#fine").val()
                };

                console.log(borrowObj);
                updateBorrow(borrowObj);

            })

        }
    })
}


function updateBorrow(borrowObj){
    let urlUpdate = rootPath + "/borrowbook/updateBorrowBook";
    $.post(urlUpdate,borrowObj,function (res) {

        if(res.err == 0){
            alert(res)
            // showBooks(6,1);
        }
    })
}



$("#findByKW").on("click",function(){
    let keyword = $("#findByKWVal").val();
    let url = rootPath + "/borrowbook/findBorrowByKw";
    let pagesize = 6;
    let page = 1;

    $.post(url,{pagesize:pagesize,page:page,keyword:keyword},function (res) {
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

})