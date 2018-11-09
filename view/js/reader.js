// 处理用户信息显示
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


// 显示读者信息  渲染页面

//显示所有读者信息
showReaderInfo(6,1);
function showReaderInfo(pagesize,page){
    let url = rootPath + "/reader/findReader";

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
            console.log("失败请重试");
        }

    })

}

function setPage(pagesize,page) {
    showReaderInfo(pagesize,page);
}

//渲染页面
function render(res,pagesize,page) {
    //    渲染页面
    var str = "";
    let imgRootPath = "http://127.0.0.1:3000";
    console.log(res)
    let resultArr = res.data.readerlist;
    $(".total").html(res.data.total);
    resultArr.forEach(function (item,idx){
        let obj = JSON.stringify(item);
        let trStyle = idx%2 == 0 ? "even gradeC" : "gradeX";
        str+=`<tr class="${trStyle}">
                    <td class="am-text-middle">${idx+1}</td>
                    <td class="am-text-middle">${item.readerName}</td>
                    <td class="am-text-middle">${item.sex}</td>
                    <td class="am-text-middle">${item.dept}</td>
                    <td class="am-text-middle">${item.phone}</td>
                    <td class="am-text-middle">${item.age}</td>
                    <td class="am-text-middle">${item.status}</td>
                    <td class="am-text-middle">
                        <div class="tpl-table-black-operation">
                            <a href="javascript:;"  onclick="updateReaderInfo('${item._id}')">
                                <i class="am-icon-pencil"></i> 编辑
                            </a>
                            <a href="javascript:;" class="tpl-table-black-operation-del" onclick="delReader('${item._id}')">
                                <i class="am-icon-trash"></i> 删除
                            </a>
                        </div>
                    </td>
                </tr>
               `;
    });
    $("#readerList").html(str);

}


//新增读者信息处理
$("#newReader").hide();
$("#newReaderBtn").on("click", function(){
    location.href = "#newReader";
    $("#newReader").show();
    $("#addReaderBtn").show().next().hide();
});
$("#addReaderBtn").on("click", function(){
    let url = rootPath + "/reader/addReader";
    let readerObj = {
        readerName:$("#readerName").val(),
        sex:$("#sex").val(),
        dept:$("#dept").val(),
        phone:$("#phone").val(),
        age:$("#age").val(),
        status:$("#status").val(),
    };

    $.post(url,readerObj,function (res) {
        if(res.err == 0){
            alert("添加成功");
            showReaderInfo(6,1);
        }else{
            alert("添加失败")
        }
    })

});

//修改读者信息
function updateReaderInfo(_id) {
    location.href = "#newReader";
    $("#newReader").show();
    $("#addReaderBtn").hide().next().show();
    let pagesize = 6;
    let page=1;
    let url = rootPath + "/reader/findUnitReader"
    $.post(url,{_id:_id,pagesize:pagesize,page:page},(res) => {
        if(res.err == 0){
            let chooseReader = res.data.readerlist[0];
            $("#readerName").val(chooseReader.readerName)
            $("#sex").val(chooseReader.sex);
            $("#dept").val(chooseReader.dept);
            $("#phone").val(chooseReader.phone);
            $("#age").val(chooseReader.age);
            $("#status").val(chooseReader.status);
        }

    })

    $("#updateReaderBtn").on("click",function(){

        // { bookid,bookname,borrowDate,returnDate,fine} readerName不可更改
        let readerObj = {
            _id:_id,
            readerName:$("#readerName").val(),
            sex:$("#sex").val(),
            dept:$("#dept").val(),
            phone:$("#phone").val(),
            age:$("#age").val(),
            status:$("#status").val(),
        };

        console.log(readerObj)
        updateReader(readerObj);

    })

}
//显示要更改的信息

function updateReader(readerObj) {
    let url = rootPath + "/reader/updateReader";
    $.post(url,readerObj,(res) => {
        if(res.err == 0){
            alert("修改成功")
            showReaderInfo(6,1);
        }
    })
}

//删除
function delReader(_id){
    if(confirm("您确定要删除该条记录吗？")){
        let url = rootPath + "/reader/removeReader";
        $.post(url,{_id},function (res) {
            if(res.err == 0){
                showReaderInfo(6,1);
            }
        })
    }

}