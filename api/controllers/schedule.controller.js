//"mongoose"

const Subject = require("../models/subject.model");
const Student = require("../models/student.model");
const Exam = require("../models/examination.model");
const Schedule = require("../models/schedule.model");
module.exports = {

  //get all schedule

  getSchedulesWithClass:async (req, res)=> {

    try{
      const classId = req.params.id;  
      const schoolId = req.user.schoolId;
      const schedules = await Schedule.find({school:schoolId,class:classId });
      res.status(200).json({success:true, message:"Success in fetching all Subjects", data:schedules})

    }catch(error){
      console.log("Get Schedule with class Error", error)
      res.status(500).json({success:false, message:"Server Error in Getting Schedule with class"})
    }

  },


  //creating new Schedule
  createSchedule: async (req, res) => {
    try {
      //  school:{type:mongoose.Schema.ObjectId, ref:'School'},
      //     Subjects_text:{type:String, required:true},
      //     Subjects_num:{type:Number, required:true},
      //     attendee:{type:mongoose.Schema.ObjectId, ref:"Teacher"},
      //     createAt: {type:Date, default: new Date()}

      const newSubject = new Subject({
        school: req.user.schoolId,
        teacher:req.body.teacher,
        subject:req.body.subject,
        class:req.body.selectedClass,
        startTime:req.body.startTime,
        endTime:req.body.endTime,
        
      });
      await newSubject.save();
      res
        .status(200)
        .json({ success: true, message: "Schedule created Successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "server error in creating Schedule." });
    }
  },
  //update Subjects

  updateScheduleWithId: async (req, res) => {
    try {
      let id = req.params.id;
      await Schedule.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
      const scheduleAfterUpdate = await Schedule.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "Schedule updated successfully",
        data: scheduleAfterUpdate,
      });
    } catch (error) {
      console.log("update Schedule error =>", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in updating Schedule." });
    }
  },

  //delete Subjects with id

 deleteScheduleWithId: async (req, res) => {
  try {
    let id = req.params.id;
    let schoolId = req.user.schoolId;

    // Check how many students and exams are linked
   
    const SubjectExamCount = await Exam.countDocuments({ subject: id, school: schoolId });
    const SubjectSchedule = await Schedule.findOne({ subject: id, school: schoolId }); 

    if (SubjectExamCount === 0 && !SubjectSchedule) {
      await Subject.findOneAndDelete({ _id: id, school: schoolId });
      res.status(200).json({ success: true, message: "Subjects deleted successfully" });
    } else {
      res.status(400).json({
        success: false,
        message: "This Subjects is already in use and cannot be deleted.",
      });
    }
  } catch (error) {
    console.log("Delete Subjects error =>", error);
    res.status(500).json({ success: false, message: "Server error in deleting Subjects." });
  }
}

};
