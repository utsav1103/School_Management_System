//"mongoose"

const Subject = require("../models/subject.model");
const Student = require("../models/student.model");
const Exam = require("../models/examination.model");
const Schedule = require("../models/schedule.model");
module.exports = {

  //get all Subjects

  getAllSubjects:async (req, res)=> {

    try{
      const schoolId = req.user.schoolId;
      const allSubjects = await Subject.find({school:schoolId});
      res.status(200).json({success:true, message:"Success in fetching all Subjects", data:allSubjects})

    }catch(error){
      console.log("GetAllSubjects Error", error)
      res.status(500).json({success:false, message:"Server Error in Getting all Subjects..."})
    }

  },


  //creating new Subjects
  createSubject: async (req, res) => {
    try {
      //  school:{type:mongoose.Schema.ObjectId, ref:'School'},
      //     Subjects_text:{type:String, required:true},
      //     Subjects_num:{type:Number, required:true},
      //     attendee:{type:mongoose.Schema.ObjectId, ref:"Teacher"},
      //     createAt: {type:Date, default: new Date()}

      const newSubject = new Subject({
        school: req.user.schoolId,
        subject_name: req.body.subject_name,
        subject_codename: req.body.subject_codename,
      });
      await newSubject.save();
      res
        .status(200)
        .json({ success: true, message: "Subjects created Successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "server error in creating Subjects." });
    }
  },
  //update Subjects

  updateSubjectWithId: async (req, res) => {
    try {
      let id = req.params.id;
      await Subject.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
      const SubjectAfterUpdate = await Subject.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "Subject updated successfully",
        data: SubjectAfterUpdate,
      });
    } catch (error) {
      console.log("update Subjects error =>", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in updating Subjects." });
    }
  },

  //delete Subjects with id

 deleteSubjectWithId: async (req, res) => {
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
