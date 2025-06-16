const Class = require("../models/class.model");
const Student = require("../models/student.model")
const Exam = require("../models/examination.model")
const Schedule = require('../models/schedule.model')
module.exports = {
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
      res
        .status(200)
        .json({
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

  deleteClassWithId: async(req, res)=>{
    
    try{
        let id = req.params.id;
        let schoolId = req.user.schoolId;
        //giving condition to only delete unuse class

        const classStudentCount = (await Student.find({student_class:id, school:schoolId})).length;
        const classExamCount = (await Exam.find({class:id, school:schoolId})).length;
        const classScheduleCount = (await Schedule.findOneAndDelete({class:id, school:schoolId})).length;

        if((classStudentCount === 0)  &&(classExamCount === 0) && (classScheduleCount ===0)){

            await Class.findOneAndDelete({_id:id, school:schoolId})
        res.status(200).json({success:true, message: "Class deleted successfully"})

        }else{
            res.status(500).json({success:false, message:"This Class is already in use..."})
        }

    }catch(error){
        console.log("Delete class error =>", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in deleting class." });
    }
  }
};
