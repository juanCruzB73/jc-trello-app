const mongoose = require('mongoose');
require('dotenv');

const dbConnection=async()=>{
    try{
        await mongoose.connect(process.env.DB_CNN);
        console.log("DB CONNECTED");
    }catch(error){
        console.log(error);
        throw new Error("error updating db")
    }
}
module.exports={dbConnection};