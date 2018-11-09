const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user:'1484052517@qq.com', // 发送方的邮箱
        pass: 'orxondigafdgjcci' // smtp 的授权码
    }
});

function sendMail(mail,code,call){
    // 发送的配置项
    let mailOptions = {
        from: '"Fred Foo 👻" <1484052517@qq.com>', // 发送方
        to: mail, // 接收方
        subject: '欢迎登录校园图书后台管理系统，您所做的一切操作后台将有记录', // 标题
        text: 'Hello world?', // 文本内容
        html: `<h3>您的验证码是:<img class="uploadImg" src="http://localhost:3000/getCode/get-img-verify">,请注意安全性，该验证码有效期为1分钟</h3>`//页面内容
    };

    //发送函数
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            call(-1)
        }
        call(0)//因为是异步 所有需要回调函数通知成功结果

    });

}

module.exports={sendMail}
