const express=require('express');
const app=express();
const bodyParser=require('body-parser')
const email=require('./sendMail.js')
console.log(email)
app.use(bodyParser.urlencoded({ extended: false }))
let check={}
//获取验证码
app.post("/getCode",(req,res)=>{
    // console.log(req.body)
    let mail=req.body.mail;
    console.log(mail)
    if (!mail) {return res.send('参数错误')}
    let code=parseInt(Math.random(0,1)*1000);
    check[mail]=code
    //发送邮件是异步操作
    email.sendMail(mail,code,(state)=>{
        if (state) {
            res.send({err:-1,msg:"验证码发送失败",data:null})
        }else{
            res.send({err:0,msg:"验证码发送成功",data:null})
        }

    })

})

module.exports = app;