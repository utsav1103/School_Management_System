//"mongoose"
const Notice = require("../models/notice.model")

module.exports = {

  //get all Notice

  getAllNotices:async (req, res)=> {

    try{
      const schoolId = req.user.schoolId;
      const allNotices = await Notice.find({school:schoolId});
      res.status(200).json({success:true, message:"Success in fetching all Notices", data:allNotices})

    }catch(error){
      console.log("GetAllNotices Error", error)
      res.status(500).json({success:false, message:"Server Error in Getting all Notices..."})
    }

  },

  //getSingleNotice
  
  //creating new Notice
  createNotice: async (req, res) => {
    try {
        const {title , message , audience} = req.body;
      
      const newNotice = new Notice({
        school: req.user.schoolId,
        title:title,
        message:message,
        audience:audience
        
    });
      await newNotice.save();
      res
        .status(200)
        .json({ success: true, message: "Notice created Successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "server error in creating Notice." });
    }
  },
  //update Notice

  updateNoticeWithId: async (req, res) => {
    try {
      let id = req.params.id;
      await Notice.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
      const NoticeAfterUpdate = await Notice.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "Notice updated successfully",
        data: NoticeAfterUpdate,
      });
    } catch (error) {
      console.log("update Notice error =>", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in updating Notice." });
    }
  },

  //delete Notice with id

 deleteNoticeWithId: async (req, res) => {
  try {
    let id = req.params.id;
    let schoolId = req.user.schoolId;

     await Notice.findOneAndDelete({ _id: id, school: schoolId });
      res.status(200).json({ success: true, message: "Notice deleted successfully" });

  } catch (error) {
    console.log("Delete Notice error =>", error);
    res.status(500).json({ success: false, message: "Server error in deleting Notice." });
  }
}

};
