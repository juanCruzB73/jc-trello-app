const mongoose=require('mongoose');

const taskSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
    state:{type:String,enum:["todo","inprogress","completed"],requires:true},
    deadLine:{type:String,required:true},
});


const sprintSchema=mongoose.Schema({
    title:String,
    beginLine:String,
    deadLine:String,
    tasks:[{
        type:taskSchema,default:[]
    }]
});
module.exports= mongoose.model("Sprint",sprintSchema);