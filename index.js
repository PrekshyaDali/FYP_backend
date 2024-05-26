const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")


const app = express()
app.use(express.json())


app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );

  app.use(express.urlencoded({ extended: true }));


   const Connection = async () => {
    try {
     
      await mongoose.connect("mongodb+srv://Prekshya:prekshya123@cluster0.qrug1kk.mongodb.net/");
    
      console.log("Database Connected Succesfully");
    } catch (error) {
      console.log("Connection error: ", error);
    }
  };

  Connection()

  app.use("/api/", userRouter)



  app.listen(8000,()=>{
    console.log("Server is running at port 8000")
  })