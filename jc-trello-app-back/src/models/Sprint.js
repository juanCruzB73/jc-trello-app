const mongoose=require('mongoose');

const taskSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String, required:false},
    state:{type:String,enum:["todo","inprogress","completed"],required:true},
    deadLine:{type:String,required:false},
    index:{type:Number,required:true}
});


const sprintSchema=mongoose.Schema({
    title:String,
    description:{type:String, required:false},
    beginLine:String,
    deadLine:String,
    tasks:[{
        type:taskSchema,default:[]
    }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    index:{type:Number,required:true}
});
module.exports= mongoose.model("Sprint",sprintSchema);