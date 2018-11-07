// 创建数据模型
const mongoose = require("mongoose");
let bookSchema = mongoose.Schema({
    typeid:{type:String,required:true},
    bookname:{type:String,required:true},
    author:{type:String},
    publish:{type:String},
    publicDate:{type:String},
    unitprice:{type:String},
    bookimg:{type:String},
    bookdesc:{type:String},
    stock:{type:String}//库存
});

//注意：数据库的集合名，在这里会被自动转化为复数，所以建立集合的时候尽量为复数
let book = mongoose.model("books",bookSchema);
module.exports = book;