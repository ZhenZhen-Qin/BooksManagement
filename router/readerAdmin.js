const express = require("express");
const Router = express.Router();
var bodyParser  = require("body-parser");
Router.use(bodyParser.urlencoded({ extended: false }));

const Reader = require("../mongo/model/reader.js");



/**
 * @api {post} /reader/addReader addReader
 * @apiName addReader
 * @apiGroup reader
 *
 * @apiParam {String} readerName 读者名
 * @apiParam {String} sex 性别
 * @apiParam {String} dept 所在院系
 * @apiParam {String} phone 手机号
 * @apiParam {String} age 年龄
 * @apiParam {String} status 身份[student/teacher]
 *
 * @apiSuccess {Number} err 错误码 0：ok -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/addReader",(req,res)=>{

    let {readerName, sex, dept, phone, age, status} = req.body;
    Reader.insertMany({readerName, sex, dept, phone, age, status})
        .then((data)=>{
            if(data.length > 0){
                res.send({err:0,msg:'addSuccess',data:null});
            }
        })
        .catch((err)=>{
            console.log(err)
            res.send("add reader error");
        })
});


/**
 * @api {post} /reader/findReader findReader
 * @apiName findReader
 * @apiGroup reader
 *
 * @apiParam {String} pagesize 显示的页码的长度
 * @apiParam {String} page 第几页
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/findReader',(req,res)=>{
    let  {pagesize,page}=req.body;
    let obj={}
    Reader.find()
        .then((data)=>{
            // 获取总条数
            obj.total=data.length;
            return Reader.find().limit(Number(pagesize)).skip((Number(page)-1)*Number(pagesize))
        })
        .then((data)=>{
            obj.readerlist=data;
            res.send({err:0,msg:'查询成功',data:obj})
        })
        .catch((err)=>{
            console.log(err)
            res.send({err:-1,msg:'查询错误',data:null})
        })
});

/**
 * @api {post} /reader/findUnitReader findUnitReader
 * @apiName findUnitReader
 * @apiGroup reader
 *
 * @apiParam {String} pagesize 显示的页码的长度
 * @apiParam {String} page 第几页
 * @apiParam {String} _id 第几页
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/findUnitReader',(req,res)=>{
    let {_id} = req.body;
    let  {pagesize,page}=req.body;
    let obj={};
    Reader.find({_id})
        .then((data)=>{
            // 获取总条数
            obj.total=data.length;
            return Reader.find({_id}).limit(Number(pagesize)).skip((Number(page)-1)*Number(pagesize))
        })
        .then((data)=>{
            obj.readerlist=data;
            res.send({err:0,msg:'查询成功',data:obj})
        })
        .catch((err)=>{
            console.log(err)
            res.send({err:-1,msg:'查询错误',data:null})
        })
});


/**
 * @api {post} /reader/updateReader updateReader
 * @apiName updateReader
 * @apiGroup reader
 *
 * @apiParam {String} _id 读者的ID
 * @apiParam {String} readerName 读者名
 * @apiParam {String} sex 性别
 * @apiParam {String} dept 所在院系
 * @apiParam {String} phone 手机号
 * @apiParam {String} age 年龄
 * @apiParam {String} status 身份[student/teacher]
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/updateReader",(req,res)=>{
    let id =req.body._id;
    let {readerName, sex, dept, phone, age, status} = req.body;
    Reader.updateOne({_id:id},{$set:{readerName, sex, dept, phone, age, status}})
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
 * @api {post} /reader/removeReader removeReader
 * @apiName removeReader
 * @apiGroup reader
 *
 * @apiParam {String} _id 读者的ID
 *
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/removeReader',(req,res)=>{
    let id = req.body._id;
    console.log(id)
    Reader.deleteOne({_id:id})
        .then((data)=>{
            res.send({err:0,msg:"delete success",data:null})
        })
        .catch((err)=>{
            console.log(err);
            res.send({err:-1,msg:"delete error",data:null})
        })

});


module.exports=Router;