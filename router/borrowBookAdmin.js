const express = require("express");
const Router = express.Router();
var bodyParser  = require("body-parser");
Router.use(bodyParser.urlencoded({ extended: false }));

const BorrowBook = require("../mongo/model/borrowbook.js");


/**
 * @api {post} /borrowbook/addBorrowBook addBorrowBook
 * @apiName addBorrowBook
 * @apiGroup borrowbook
 *
 * @apiParam {String} readerName 读者名
 * @apiParam {String} bookname 书名
 * @apiParam {String} bookid 书ID
 * @apiParam {String} borrowDate 借书日期
 * @apiParam {String} returnDate 还书日期
 * @apiParam {String} fine 逾期的罚金
 *
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/addBorrowBook",(req,res)=>{

    let {readerName,bookid,bookname,borrowDate,returnDate,fine} = req.body;
    BorrowBook.insertMany({readerName,bookid,bookname,borrowDate,returnDate,fine})
        .then((data)=>{
            if(data.length > 0){
                res.send({err:0,msg:'borrowSuccess',data:null});
            }
        })
        .catch((err)=>{
            console.log(err)
            res.send("borrow book error");
        })
});




/**
 * @api {post} /borrowbook/findBorrowBook findBorrowBook
 * @apiName findBorrowBook
 * @apiGroup borrowbook
 *
 * @apiParam {String} pagesize 一页显示多少条数据
 * @apiParam {String} page 页码
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/findBorrowBook',(req,res)=>{
    let  {pagesize,page}=req.body;
    let obj={}
    BorrowBook.find()
        .then((data)=>{
            // 获取总条数
            obj.total=data.length
            return BorrowBook.find().limit(Number(pagesize)).skip((Number(page)-1)*Number(pagesize))
        })
        .then((data)=>{
            obj.booklist=data;
            res.send({err:0,msg:'查询成功',data:obj})
        })
        .catch((err)=>{
            console.log(err)
            res.send({err:-1,msg:'查询错误',data:null})
        })
});



/**
 * @api {post} /borrowbook/findUnitBorrowBook findUnitBorrowBook
 * @apiName findUnitBorrowBook
 * @apiGroup borrowbook
 *
 * @apiParam {String} _id 要修改的这条记录的id
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/findUnitBorrowBook',(req,res)=>{
    let  {_id} = req.body;
    console.log({_id});
    let obj={};
    BorrowBook.find({_id})
        .then((data)=>{
            // 获取总条数
            obj.total=data.length;
            return BorrowBook.find({_id})
        })
        .then((data)=>{
            console.log(data)
            obj.booklist=data;
            res.send({err:0,msg:'查询成功',data:obj})
        })
        .catch((err)=>{
            console.log(err)
            res.send({err:-1,msg:'查询错误',data:null})
        })
});




/**
 * @api {post} /borrowbook/findBorrowByKw findBorrowByKw
 * @apiName findBorrowByKw
 * @apiGroup borrowbook
 *
 * @apiParam {String} keyword 模糊查询的关键字
 * @apiParam {String} pagesize
 * @apiParam {String} page
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/findBorrowByKw',(req,res)=>{

    let {keyword,pagesize,page} =req.body;
    let obj={};
    // Goods.find({name:{$regex:'肉'}})
    BorrowBook.find({$or:[{readerName:{$regex:keyword}},{bookname:{$regex:keyword}}]})
        .then((data)=>{
            // 获取总条数
            obj.total=data.length;
            return BorrowBook.find({$or:[{readerName:{$regex:keyword}},{bookname:{$regex:keyword}}]});
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
 * @api {post} /borrowbook/updateBorrowBook updateBorrowBook
 * @apiName updateBorrowBook
 * @apiGroup borrowbook
 *
 * @apiParam {String} readerName 读者名不可更改
 * @apiParam {String} bookname 书名
 * @apiParam {String} bookid 书ID
 * @apiParam {String} borrowDate 借书日期
 * @apiParam {String} returnDate 还书日期
 * @apiParam {String} fine 逾期的罚金
 *
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/updateBorrowBook",(req,res)=>{
    let readername =req.body.readerName;
    let { bookid,bookname,borrowDate,returnDate,fine} = req.body;
    BorrowBook.updateOne({readerName:readername},{$set:{ bookid,bookname,borrowDate,returnDate,fine}})
        .then((data)=>{
            console.log(data);
            res.send({err:0,msg:'update success',data:null})
        })
        .catch((err)=>{
            console.log(err)
            res.send({err:-1,msg:'update error',data:null})
        })
})


/**
 * @api {post} /borrowbook/removeBorrowBook removeBorrowBook
 * @apiName removeBorrowBook
 * @apiGroup borrowbook
 *
 * @apiParam {String} _id  数据库生成的_id
 *
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/removeBorrowBook',(req,res)=>{
    let id = req.body._id;
    console.log(id);
    BorrowBook.deleteOne({_id:id})
        .then((data)=>{
            console.log(data);
            res.send({err:0,msg:"delete success",data:null})
        })
        .catch((err)=>{
            console.log(err);
            res.send({err:-1,msg:"delete error",data:null})
        })

});


module.exports=Router;