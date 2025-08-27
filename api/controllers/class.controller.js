//"mongoose"

const Class = require("../models/class.model");
const Student = require("../models/student.model");
const Exam = require("../models/examination.model");
const Schedule = require("../models/schedule.model");
module.exports = {

  //get all classes

  getAllClasses:async (req, res)=> {

    try{
      const schoolId = req.user.schoolId;
      const allClasses = await Class.find({school:schoolId});
      res.status(200).json({success:true, message:"Success in fetching all Classes", data:allClasses})

    }catch(error){
      console.log("GetAllClasses Error", error)
      res.status(500).json({success:false, message:"Server Error in Getting all classes..."})
    }

  },

  //getSingleClass
  // 
  getSingleClass: async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const classId = req.params.id;

    const singleClass = await Class.findOne({
      school: schoolId,
      _id: classId
    }).populate("attendee", "name email"); // populate with the fields you want

    res.status(200).json({
      success: true,
      message: "Success in fetching single class",
      data: singleClass
    });
  } catch (error) {
    console.log("GetSingleClass Error", error);
    res.status(500).json({
      success: false,
      message: "Server Error in Getting single class..."
    });
  }
},


getAttendeeClass: async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const attendeeId = req.user.id;

    const classes = await Class.find({
      school: schoolId,
      attendee: attendeeId
    }).populate("attendee", "name email"); // populate with the fields you want

    res.status(200).json({
      success: true,
      message: "Success in fetching attendee class",
      data: classes
    });
  } catch (error) {
    console.log("GetAttendee Class Error", error);
    res.status(500).json({
      success: false,
      message: "Server Error in Getting attendee  class..."
    });
  }
},


  //creating new class
  createClass: async (req, res) => {
    try {
      //  school:{type:mongoose.Schema.ObjectId, ref:'School'},
      //     class_text:{type:String, required:true},
      //     class_num:{type:Number, required:true},
      //     attendee:{type:mongoose.Schema.ObjectId, ref:"Teacher"},
      //     createAt: {type:Date, default: new Date()}

      const newClass = new Class({
        school: req.user.schoolId,
        class_text: req.body.class_text,
        class_num: req.body.class_num,
      });
      await newClass.save();
      res
        .status(200)
        .json({ success: true, message: "Class created Successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "server error in creating class." });
    }
  },
  //update class

  updateClassWithId: async (req, res) => {
    try {
      let id = req.params.id;
      await Class.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
      const classAfterUpdate = await Class.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "Class updated successfully",
        data: classAfterUpdate,
      });
    } catch (error) {
      console.log("update class error =>", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in updating class." });
    }
  },

  //delete class with id

 deleteClassWithId: async (req, res) => {
  try {
    let id = req.params.id;
    let schoolId = req.user.schoolId;

    // Check how many students and exams are linked
    const classStudentCount = await Student.countDocuments({ student_class: id, school: schoolId });
    const classExamCount = await Exam.countDocuments({ class: id, school: schoolId });
    const classSchedule = await Schedule.findOne({ class: id, school: schoolId });

    if (classStudentCount === 0 && classExamCount === 0 && !classSchedule) {
      await Class.findOneAndDelete({ _id: id, school: schoolId });
      res.status(200).json({ success: true, message: "Class deleted successfully" });
    } else {
      res.status(400).json({
        success: false,
        message: "This Class is already in use and cannot be deleted.",
      });
    }
  } catch (error) {
    console.log("Delete class error =>", error);
    res.status(500).json({ success: false, message: "Server error in deleting class." });
  }
}

};
