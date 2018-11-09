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
 * @api {post} /book/findBooksByType findBooksByType
 * @apiName findBooksByType
 * @apiGroup book
 *
 * @apiParam {String} typeid  根据书的类别查找书
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/findBooksByType',(req,res)=>{
    let  {typeid,pagesize,page} = req.body;
    let obj={};
    Book.find({typeid})
        .then((data)=>{
            // 获取总条数
            obj.total=data.length;
            return Book.find({typeid}).limit(Number(pagesize)).skip((Number(page)-1)*Number(pagesize));
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
 * @api {post} /book/findUnitBook findUnitBook
 * @apiName findUnitBook
 * @apiGroup book
 *
 * @apiParam {String} _id  根据书的_id查找书
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/findUnitBook',(req,res)=>{
    let  {_id} = req.body;
    let obj={};
    Book.find({_id})
        .then((data)=>{
            obj.total=data.length;
            obj.booklist=data;
            res.send({err:0,msg:'查询成功',data:obj})
        })
        .catch((err)=>{
            console.log(err)
            res.send({err:-1,msg:'查询错误',data:null})
        })
})




/**
 * @api {post} /book/findBookByKw findBookByKw
 * @apiName findBookByKw
 * @apiGroup book
 *
 * @apiParam {String} keyword 模糊查询的关键字
 * @apiParam {String} pagesize
 * @apiParam {String} page
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/findBookByKw',(req,res)=>{

    let {keyword,pagesize,page} =req.body;
    let obj={};
    // Goods.find({name:{$regex:'肉'}})
    Book.find({$or:[{bookname:{$regex:keyword}},{typeid:{$regex:keyword}},{author:{$regex:keyword}},{publish:{$regex:keyword}},{bookdesc:{$regex:keyword}}]})
        .then((data)=>{
            // 获取总条数
            obj.total=data.length;
            return Book.find({$or:[{bookname:{$regex:keyword}},{typeid:{$regex:keyword}},{author:{$regex:keyword}},{publish:{$regex:keyword}},{bookdesc:{$regex:keyword}}]}).limit(Number(pagesize)).skip((Number(page)-1)*Number(pagesize));
        })
        .then((data)=>{
            obj.booklist=data;
            res.send({err:0,msg:'find success',data:obj})
        })
        .catch((err)=>{
            console.log(err);
            res.send({err:-1,msg:'find error',data:null})
        })

})


/**
 * @api {post} /book/updateBookInfo updateBookInfo
 * @apiName updateBookInfo
 * @apiGroup book
 *
 * @apiParam {String} _id 图书id
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
    console.log(id)
    let {typeid, bookname, author, publish, publicDate, unitprice,bookimg,bookdesc,stock} = req.body;
    Book.updateOne({_id:id},{$set:{typeid, bookname, author, publish, publicDate, unitprice,bookimg,bookdesc,stock}})
        .then((data)=>{
            console.log(data);
            res.send({err:0,msg:'update success',data:null})
        })
        .catch((err)=>{
            console.log(err);
            res.send({err:-1,msg:'update error',data:null})
        })
});


/**
 * @api {post} /book/removeBookInfo removeBookInfo
 * @apiName removeBookInfo
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