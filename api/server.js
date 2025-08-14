require("dotenv").config()
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
// Routers import
const schoolRouter = require("./routers/school.router")
const classRouter = require("./routers/class.router")
const subjectRouter = require("./routers/subject.router")
const studentRouter = require("./routers/student.router")
const teacherRouter = require("./routers/teacher.router")
const scheduleRouter = require("./routers/schedule.router")
const attendanceRouter = require("./routers/attendance.router")
const examinationRouter = require("./routers/examination.router")

const app = express();
app.use(express.json());  
//if we pass any data to body to retrive the data we have to use this  
app.use(express.urlencoded({extended: true}));
const corsOption  = {exposedHeaders:"Authorization"}
app.use(cors(corsOption));
app.use(cookieParser());

//MONGODO CONNECTION

mongoose.connect(process.env.MONGODB_URL,
    {
        dbName: 'school_management_db'
    }
)
.then(db => {
    console.log("Database is connected Successfully") 
    }).catch(e => {
        console.log("MongoDb error", e);
        
    })


    //routers
    app.use("/api/school", schoolRouter)
    app.use("/api/class", classRouter )
    app.use("/api/subject",subjectRouter)
    app.use("/api/student",studentRouter)
    app.use("/api/teacher", teacherRouter )
    app.use("/api/schedule",scheduleRouter)
    app.use("/api/attendance",attendanceRouter)
    app.use("/api/examination",examinationRouter)

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log("Server is running on port", PORT);
    
})