const express=require('express');
require('dotenv').config();
const {dbConnection}=require('./config/databaseConfig');
const cors = require('cors');

const app=express();

//conection to db
dbConnection();

//enable cors
app.use(cors());

//public directory
app.use(express.static("public"));

//json parse
app.use(express.json());

app.use('/api/backlog',require('./routes/backlog'));
app.use('/api/sprints',require('./routes/sprints'));
app.use('/api/tasks',require('./routes/tasks'));
app.use("/api/auth",require("./routes/auth"))


app.listen(process.env.PORT,()=>console.log(`server running on port ${process.env.PORT}`))