const mongoose=require('mongoose');

const taskSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String, required:false},
    state:{type:String,enum:["todo","inprogress","completed"],requires:true},
    deadLine:{type:String,required:false},
});


const sprintSchema=mongoose.Schema({
    title:String,
    description:{type:String, required:false},
    beginLine:String,
    deadLine:String,
    tasks:[{
        type:taskSchema,default:[]
    }]
});
module.exports= mongoose.model("Sprint",sprintSchema);