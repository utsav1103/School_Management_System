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
      res.status(200).json({success:true, message:"Success in fetching all Schedules", data:schedules})

    }catch(error){
      console.log("Get Schedule with class Error", error)
      res.status(500).json({success:false, message:"Server Error in Getting Schedule with class"})
    }

  },


  //creating new Schedule
  createSchedule: async (req, res) => {
  try {
    const { teacher, subject, class: classId, date, startTime, endTime } = req.body;

    // Construct proper Date objects
    
    const newSchedule = new Schedule({
      school: req.user.schoolId,
      teacher,
      subject,
      class: classId,
      startTime,
      endTime,
    });

    await newSchedule.save();

    res.status(200).json({
      success: true,
      message: "Schedule created Successfully",
    });
  } catch (err) {
    console.error("Schedule creation error:", err);
    res.status(500).json({
      success: false,
      message: "Server error in creating Schedule.",
    });
  }
},

  //update Schedule

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

    
      await Schedule.findOneAndDelete({ _id: id, school: schoolId });
      res.status(200).json({ success: true, message: "Schedule deleted successfully" });
   
  } catch (error) {
    console.log("Delete Schedules error =>", error);
    res.status(500).json({ success: false, message: "Server error in deleting Schedule." });
  }
}

};
