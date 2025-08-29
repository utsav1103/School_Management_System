const Attendance = require("../models/attendance.model");
const moment = require("moment");

module.exports = {
  // ✅ Mark Attendance (multiple students at once)
  markAttendance: async (req, res) => {
    try {
      const { classId, attendance, date } = req.body;
      const schoolId = req.user.schoolId;

      if (!classId || !attendance || !Array.isArray(attendance)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid request data" });
      }

      const attendanceDate = date ? new Date(date) : new Date();
      attendanceDate.setHours(0, 0, 0, 0); // normalize day

      for (let record of attendance) {
        const { studentId, present } = record;

        // check if already marked
        let existing = await Attendance.findOne({
          student: studentId,
          class: classId,
          date: {
            $gte: attendanceDate,
            $lt: moment(attendanceDate).endOf("day").toDate(),
          },
        });

        if (existing) {
          existing.status = present ? "Present" : "Absent";
          await existing.save();
        } else {
          await Attendance.create({
            student: studentId,
            class: classId,
            date: attendanceDate,
            status: present ? "Present" : "Absent",
            school: schoolId,
          });
        }
      }

      res
        .status(201)
        .json({ success: true, message: "Attendance marked successfully" });
    } catch (error) {
      console.error("Error marking attendance:", error);
      res
        .status(500)
        .json({ success: false, message: "Error in marking attendance" });
    }
  },

  // ✅ Get all attendance of one student
  getAttendance: async (req, res) => {
    try {
      const { studentId } = req.params;
      const attendance = await Attendance.find({ student: studentId })
        .populate("student")
        .populate("class");
      res.status(200).json({ success: true, attendance });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error in getting attendance" });
    }
  },

  // ✅ Check if attendance is already taken for a class today
  checkAttendance: async (req, res) => {
    try {
      const { classId } = req.params;
      const today = moment().startOf("day");

      const attendanceForToday = await Attendance.findOne({
        class: classId,
        date: {
          $gte: today.toDate(),
          $lt: moment(today).endOf("day").toDate(),
        },
      });

      if (attendanceForToday) {
        return res.status(200).json({
          success: true,
          attendanceTaken: true,
          message: "Attendance already taken today",
        });
      } else {
        return res.status(200).json({
          success: true,
          attendanceTaken: false,
          message: "No attendance taken yet",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error in checking attendance" });
    }
  },
};
