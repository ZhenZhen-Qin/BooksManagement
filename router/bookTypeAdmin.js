const express = require("express");
const Router = express.Router();
var bodyParser  = require("body-parser");
Router.use(bodyParser.urlencoded({ extended: false }));

const BookType = require("../mongo/model/booktype.js");


/**
 * @api {post} /booktype/addBookType addBookType
 * @apiName addBookType
 * @apiGroup booktype
 *
 * @apiParam {String} typeid 类别id
 * @apiParam {String} typeName 类别名
 *
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/addBookType",(req,res)=>{
    let {typeid, typeName} = req.body;
    BookType.insertMany({typeid, typeName})
        .then((data)=>{
            if(data.length > 0){
                res.send({err:0,msg:'addSuccess',data:null});
            }
        })
        .catch((err)=>{
            console.log(err)
            res.send("add book error");
        })
});


/**
 * @api {post} /booktype/findBookType findBookType
 * @apiName findBookType
 * @apiGroup booktype
 *
 * @apiParam {String} pagesize
 * @apiParam {String} page
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/findBookType',(req,res)=>{
    let  {pagesize,page}=req.body;
    let obj={}
    BookType.find()
        .then((data)=>{
            // 获取总条数
            obj.total=data.length;
            return BookType.find().limit(Number(pagesize)).skip((Number(page)-1)*Number(pagesize))
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
 * @api {post} /booktype/findUnitBookType findUnitBookType
 * @apiName findUnitBookType
 * @apiGroup booktype
 *
 * @apiParam {String} unitTypeId  单个图书类别的管理
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/findUnitBookType',(req,res)=>{
    let  {unitTypeId}=req.body;
    let obj={}
    BookType.find()
        .then((data)=>{
            obj.total=data.length;
            return BookType.find({typeid:unitTypeId});
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
 * @api {post} /booktype/updateBookType updateBookType
 * @apiName updateBookType
 * @apiGroup booktype
 *
 * @apiParam {String} typeid 类别id
 * @apiParam {String} typeName 类别名
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/updateBookType",(req,res)=>{
    let id =req.body.typeid;
    let {typeName} = req.body;
    BookType.updateOne({typeid:id},{$set:{typeName}})
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
 * @api {post} /booktype/removeBookType removeBookType
 * @apiName removeBookType
 * @apiGroup booktype
 *
 * @apiParam {String} typeid 类别id
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/removeBookType',(req,res)=>{
    let id = req.body.typeid;

    BookType.deleteOne({typeid:id})
        .then((data)=>{
            res.send({err:0,msg:"delete success",data:null})
        })
        .catch((err)=>{
            console.log(err);
            res.send({err:-1,msg:"delete error",data:null})
        })

});


/**
 * @api {post} /booktype/findBookTypeByKw findBookTypeByKw
 * @apiName findBookTypeByKw
 * @apiGroup booktype
 *
 * @apiParam {String} keyword 模糊查询的关键字
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/findBookTypeByKw',(req,res)=>{

    let keyword =req.body.keyword;
    console.log(keyword)
    // Goods.find({name:{$regex:'肉'}})
    BookType.find({$or:[{typeName:{$regex:keyword}},{typeid:{$regex:keyword}}]})
        .then((data)=>{
            res.send({err:0,msg:"find success",data:data})
        })
        .catch((err)=>{
            console.log(err);
            res.send({err:-1,msg:'find error',data:null})
        })

})


module.exports=Router;