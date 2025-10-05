const mongoose = require('mongoose');

const taskSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
    state:{type:String,enum:["todo","inprogress","completed"],requires:true},
    deadLine:{type:String,required:true},
});

const backlogSchema=new mongoose.Schema({
    tasks:[{
        type:taskSchema,default:[]
    }]
});

backlogSchema.method("toJSON",function(){
    const{__v,_id,...object}=this.toObject();
    object.id=_id;
    return object;
})

module.exports= mongoose.model("Backlog",backlogSchema);