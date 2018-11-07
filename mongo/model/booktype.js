// 创建数据模型
const mongoose = require("mongoose");
let bookTypeSchema = mongoose.Schema({
    typeid:{type:String,required:true,unique: true},
    typeName:{type:String,required:true},
});

//注意：数据库的集合名，在这里会被自动转化为复数，所以建立集合的时候尽量为复数
let booktype = mongoose.model("booktype",bookTypeSchema);
module.exports = booktype;