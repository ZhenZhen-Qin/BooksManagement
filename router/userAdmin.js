const express = require("express");
const Router = express.Router();
const querystring = require("querystring");
var bodyParser  = require("body-parser");
Router.use(bodyParser.urlencoded({ extended: false }));

const User = require("../mongo/model/user.js");

/**
 * @api {post} /user/userLogin userLogin
 * @apiName userLogin
 * @apiGroup user
 *
 * @apiParam {String} uname 前端传过来的可以是用户名和邮箱
 * @apiParam {String} pwd 登录密码
 *
 * @apiSuccess {Number} err 错误码 0：ok -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/userLogin",(req,res)=>{
        console.log(req.body);
        var dataObj = req.body;

        User.find({$and: [{$or:[{"uname":dataObj["uname"] },{"email":dataObj["uname"] }]}, {"pwd": dataObj["pwd"]}]})
            .then((data)=>{
                console.log(data);
                if((data[0]["uname"] == dataObj["uname"] || data[0]["email"] == dataObj["uname"])&& data[0]["pwd"] == dataObj["pwd"]){
                    res.send({err:0,msg:'loginSuccess',data:null});
                }
            })
            .catch((err)=>{
                console.log(err);
                res.send("loginErr");
            })

});

//超级管理员添加新的普通管理员
/**
 * @api {post} /user/addUserInfo addUserInfo
 * @apiName addUserInfo
 * @apiGroup user
 *
 * @apiParam {String} uname 用户名
 * @apiParam {String} pwd 登录密码
 * @apiParam {String} status 权限
 *
 * @apiSuccess {Number} err 错误码 0：ok -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/addUserInfo",(req,res)=>{
    let status = req.body.status?req.body.status:1;
    User.insertMany({email:req.body.email,uname:req.body.uname,pwd:req.body.pwd,status:status})
        .then((data)=>{
            console.log(data);
            res.send({err:0,msg:'addSuccess',data:null})
        })
        .catch((err)=>{
            console.log(err);
            res.send("fail")
        })
});



/**
 * @api {post} /user/findUserInfo findUserInfo
 * @apiName findUserInfo
 * @apiGroup user
 *
 * @apiParam {String} uname 前端传过来的用户名或者邮箱
 *
 * @apiSuccess {Number} err 错误码 0：ok -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/findUserInfo",(req,res)=>{
    let uname = req.body.uname;
    User.find({$or:[{"uname":uname },{"email":uname }]})
        .then((data)=>{
            console.log(data);
            res.send({err:0,msg:'find Success',data:data})
        })
        .catch((err)=>{
            console.log(err);
            res.send("fail")
        })
});


//邮箱验证码的处理
const email=require('./sendMail.js');
    //获取post请求的时候要加上下面两句代码才能获取请求的参数
Router.use(bodyParser.urlencoded({ extended: false }));
let check={};
//获取验证码


/**
 * @api {post} /user/getCode getCode
 * @apiName getCode
 * @apiGroup user
 *
 * @apiParam {String} mail 邮箱地址
 *
 * @apiSuccess {Number} err 错误码 0：ok -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 *
 */
Router.post("/getCode",(req,res)=>{
    console.log(req.body);
    let mail=req.body.mail;
    if (!mail) {return res.send('参数错误')}
    let code=parseInt(Math.random(1000,9999)*10000);
    check[mail]=code;
    //发送邮件是异步操作
    email.sendMail(mail,code,(state)=>{
        if (state) {
            res.send('验证码发送nook')
        }else{
            res.send({err:0,msg:'getCodeSuccess',data:code})
            // res.sendStatus(code)
        }
    })
});

module.exports=Router;