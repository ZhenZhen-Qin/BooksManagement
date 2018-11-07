// 创建数据模型
const mongoose = require("mongoose");
let readerSchema = mongoose.Schema({
    readerName:{type:String,required:true},
    sex:{type:String},
    dept:{type:String}, //所在系
    phone:{type:String,required:true},
    age:{type:String},
    status:{type:String,default:"student"}
});

//注意：数据库的集合名，在这里会被自动转化为复数，所以建立集合的时候尽量为复数
let reader = mongoose.model("reader",readerSchema);
module.exports = reader;