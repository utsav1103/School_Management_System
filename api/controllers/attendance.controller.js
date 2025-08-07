const Attendance = require("../models/attendance.model");


module.exports   = {

    markAttendance: async(req ,res)=>{
        
        try{
            const{studentId, date,status,classId}=req.body;
        const schoolId = req.user.schoolId;

        const newAttendance = new Attendance ({
            student:studentId,
            date,
            status:status,
            class:classId,
            school:schoolId,

        })

        await newAttendance.save();
        res.status(201).json(newAttendance)

        }catch(error){
            res.status(500).json({success:false,message:"Error in marking attendance"})
        }
    },


    getAttendance:async(req,res)=>{

        try {
            const {studentId} = req.params;
            const attendance = await Attendance.find({student:studentId}).populate('student');
            res.status(200).json(attendance)
        } catch (error) {
            res.status(500).json({success:false,message:"Error in getting attendance"})
        
        }

    }
}