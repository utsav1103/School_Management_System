require("dotenv").config()
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Routers import
const schoolRouter = require("./routers/school.router")

const app = express();
app.use(express.json());  
//if we pass any data to body to retrive the data we have to use this  
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());


//MONGODO CONNECTION

mongoose.connect(process.env.MONGODB_URL
)
.then(db => {
    console.log("Database is connected Successfully") 
    }).catch(e => {
        console.log("MongoDb error", e);
        
    })


    //routers
    app.use("/api/school", schoolRouter)

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log("Server is running on port", PORT);
    
})