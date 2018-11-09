// 创建数据模型
const mongoose = require("mongoose");
let borrowBookSchema = mongoose.Schema({
    readerName:{type:String,required:true},
    bookname:{type:String,required:true},
    bookid:{type:String,required:true},
    borrowDate:{type:String,required:true},
    returnDate:{type:String,required:true},
    fine:{type:String,default: "0"}  //罚金
});

//注意：数据库的集合名，在这里会被自动转化为复数，所以建立集合的时候尽量为复数
let borrowbook = mongoose.model("borrowBook",borrowBookSchema);
module.exports = borrowbook;