// 创建数据模型
const mongoose = require("mongoose");
let userSchema = mongoose.Schema({
    _id:{type:String},
    email:{type:String,required:true},
    uname:{type:String,required:true},
    pwd:{type:String,required:true},
    status:{type:String,default:"1"}
});

//注意：数据库的集合名，在这里会被自动转化为复数，所以建立集合的时候尽量为复数
let user = mongoose.model("user",userSchema);
module.exports = user;