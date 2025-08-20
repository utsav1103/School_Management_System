const Examination = require("../models/examination.model")


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
            const examinations = await Examination.find({school:schoolId}); 
            res.status(200).json({success:true, examinations

            })
            
        } catch (error) {
            res.status(500).json({success: false,message:"Error in fetching Examinations."})
        }
    },

    getExaminationsByClass: async(req,res)=>{
        try {
            const schoolId = req.user.schoolId;
            const classId = req.params.id;
            //This is model small letter "examinations"
            const examinations = await Examination.find({class:classId,school:schoolId}).populate("subject"); 
            res.status(200).json({success:true, examinations

            })
            
        } catch (error) {
            res.status(500).json({success: false,message:"Error in fetching Examinations."})
        }
    },

    updateExaminationWithID : async(req,res)=>{
        try {

            const schoolId = req.user.schoolId;
            const examinationId = req.params.id;
            const {date , subjectId , examType} = req.body;
            
            await Examination.findOneAndUpdate({_id:examinationId,school:schoolId}, {$set:{examDate:date,subject:subjectId,examType:examType}})
            res.status(200).json({success:true, message:"Examination updated."

            })
            
        } catch (error) {
            res.status(500).json({success: false,message:"Error in updating Examination."})
        
        }
    },

    deleteExaminationWithId: async (req,res)=>{

        try {
            const schoolId = req.user.schoolId;
            const examinationId = req.params.id;
            await Examination.findOneAndDelete({_id:examinationId,school:schoolId})
            res.status(200).json({success:true, message:"Examination Deleted."

            })
            

        } catch (error) {
            res.status(500).json({success: false,message:"Error in Deleting Examination."})
        
            
        }
    }

}