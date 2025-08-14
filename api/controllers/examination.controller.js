const Examination = require("../modles/examination.model")


module.exports = {
 
    newExamination: async (req,res)=>{

        try {
            const schoolId = req.user.schoolId;
            const {date , subjectId , examType, classId} = req.body;
            const newExamination = new Examination({
                school:schoolId,
                examDate:date,
                subject:subjectId,
                examType:examType,
                class:classId,

            })


            const savedData = await newExamination.save();
            res.status(200).json({success:true, message:"Success in creating new Examination.", data:savedData})
        } catch (error) {
            res.status(500).json({success:false, message:"Error in creating New Examination."})
        }
    },
    

    getAllExaminations: async(req,res)=>{
        try {
            const schoolId = req.user.schoolId;
            //This is model small letter "examinations"
            const examinations = await Examination.find(); 
            res.status(200).json({success:true, examinations})
            
        } catch (error) {
            res.status(500).json({success: false,message:"Error in fetching Examinations."})
        }
    }


}