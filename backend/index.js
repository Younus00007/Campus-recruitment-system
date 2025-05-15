const express = require("express");
const mongoose= require("mongoose");
const cors = require("cors");
const dotenv =require("dotenv");
const userRoutes = require("./Routers/userRoutes")
const jobRoutes = require("./Routers/jobRoutes");
const candidateDetailsRoutes= require("./Routers/candidateDetailsRoutes");
const applicationRoutes = require("./Routers/applicationRoutes");
const candidateLoginRoutes = require("./Routers/CandidateLoginRoutes");
const app=express();
const port = 3030;
const path= require('path')
dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Mongo db connected");
})
.catch((err)=>console.log(err));
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname,  "Upload", "uploads")));



app.get('/',(req,res)=>{
res.send("Server is running sucessfully")
})
app.use('/api/candidatedetails', candidateDetailsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/candidatelogin',candidateLoginRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.listen(port,()=>
{
    console.log("Server is running ");
});


