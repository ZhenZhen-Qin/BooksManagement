const express = require("express");
const Router = express.Router();
const querystring = require("querystring");
var bodyParser  = require("body-parser");
Router.use(bodyParser.urlencoded({ extended: false }));

const Book = require("../mongo/model/book.js");


/**
 * @api {post} /book/addBookInfo addBookInfo
 * @apiName addBookInfo
 * @apiGroup book
 *
 * @apiParam {String} typeid 类别id
 * @apiParam {String} bookname 书名
 * @apiParam {String} author 作者
 * @apiParam {String} publish 出版社
 * @apiParam {String} publicDate 出版日期
 * @apiParam {String} unitprice 单价
 * @apiParam {String} bookimg 图书缩略图
 * @apiParam {String} bookdesc 图书描述
 * @apiParam {String} stock 库存
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/addBookInfo",(req,res)=>{
    let {typeid, bookname, author, publish, publicDate, unitprice,bookimg,bookdesc,stock} = req.body;
    Book.insertMany({typeid, bookname, author, publish, publicDate, unitprice,bookimg,bookdesc,stock})
        .then((data)=>{
            console.log(data)
            if(data.length > 0){
                res.send({err:0,msg:"addSuccess",data:null});
            }
        })
        .catch((err)=>{
            console.log(err)
            res.send("add book error");
        })
});



/**
 * @api {post} /book/findBooksInfo findBooksInfo
 * @apiName findBooksInfo
 * @apiGroup book
 *
 * @apiParam {String} pagesize
 * @apiParam {String} page
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/findBooksInfo',(req,res)=>{
    let  {pagesize,page}=req.body;
    let obj={}
    Book.find()
        .then((data)=>{
            // 获取总条数
            obj.total=data.length
            return Book.find().limit(Number(pagesize)).skip((Number(page)-1)*Number(pagesize))
        })
        .then((data)=>{
            obj.booklist=data;
            res.send({err:0,msg:'查询成功',data:obj})
        })
        .catch((err)=>{
            console.log(err)
            res.send({err:-1,msg:'查询错误',data:null})
        })
})



/**
 * @api {post} /book/updateBookInfo updateBookInfo
 * @apiName updateBookInfo
 * @apiGroup book
 *
 * @apiParam {String} typeid 类别id
 * @apiParam {String} bookname 书名
 * @apiParam {String} author 作者
 * @apiParam {String} publish 出版社
 * @apiParam {String} publicDate 出版日期
 * @apiParam {String} unitprice 单价
 * @apiParam {String} bookimg 图书缩略图
 * @apiParam {String} bookdesc 图书描述
 * @apiParam {String} stock 库存
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/updateBookInfo",(req,res)=>{
    let id =req.body._id;
    let {typeid, bookname, author, publish, publicDate, unitprice,bookimg,bookdesc,stock} = req.body;
    Book.updateOne({_id:id},{$set:{typeid, bookname, author, publish, publicDate, unitprice,bookimg,bookdesc,stock}})
        .then((data)=>{
            console.log(data)
            res.send({err:0,msg:'update success',data:null})
        })
        .catch((err)=>{
            console.log(err)
            res.send({err:-1,msg:'update error',data:null})
        })
})


/**
 * @api {post} /book/updateBookInfo updateBookInfo
 * @apiName updateBookInfo
 * @apiGroup book
 *
 * @apiParam {String} _id 数据库自动生成的图书ID
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/removeBookInfo',(req,res)=>{
    let id = req.body._id;
    console.log(id)
    Book.deleteOne({_id:id})
        .then((data)=>{
            res.send({err:0,msg:"delete success",data:null})
        })
        .catch((err)=>{
            console.log(err);
            res.send({err:-1,msg:"delete error",data:null})
        })

});


module.exports=Router;