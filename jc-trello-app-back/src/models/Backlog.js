const mongoose = require('mongoose');

const taskSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
    state:{type:String,enum:["todo","inprogress","completed"],requires:true},
    deadLine:{type:String,required:true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    index:{type:Number,required:true}
});

const backlogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  tasks: [taskSchema]
});


backlogSchema.method("toJSON",function(){
    const{__v,_id,...object}=this.toObject();
    object.id=_id;
    return object;
})

module.exports= mongoose.model("Backlog",backlogSchema);