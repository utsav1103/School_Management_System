const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../auth/auth");

const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const Schedule = require("../models/schedule.model");
const Notice = require("../models/notice.model");
const Examination = require("../models/examination.model");
const Attendance = require("../models/attendance.model");
const Subject = require("../models/subject.model");
const Class = require("../models/class.model");
const School = require("../models/school.model");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat",authMiddleware(['SCHOOL','TEACHER','STUDENT']), async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = req.user; // we will take this form jwt

    let response = "";
    //student asks schedule
     if (prompt.toLowerCase().includes("my schedule") && user.role === "STUDENT") {
        const student = await Student.findById(user.id).populate("student_class");

        if (!student || !student.student_class) {
          response = "You are not assigned to any class yet.";
        } else {
          const schedule = await Schedule.find({ class: student.student_class._id })
            .populate("subject teacher");

          response = schedule.length
            ? `Here is your schedule:\n${schedule
                .map(
                  (s) =>
                    `${s.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${s.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} | ${s.subject.subject_name} with ${s.teacher.name}`
                )
                .join("\n")}`
            : "I couldn’t find your schedule.";
        }
      }


      //teacher asks attendance
     else if (prompt.toLowerCase().includes("attendance") && user.role === "TEACHER") {
        const teacherClasses = await Class.find({ attendee: user._id || user.id });

        if (!teacherClasses.length) {
          response = "You are not assigned to any classes yet.";
        } else {
          const attendance = await Attendance.find({
            class: { $in: teacherClasses.map((c) => c._id) },
          }).populate("class student");

          response = attendance.length
            ? `You have attendance records for ${teacherClasses.length} classes, with a total of ${attendance.length} entries.`
            : "No attendance records found for your classes.";
        }
      }

      //school admin asks teachers
        else if (prompt.toLowerCase().includes("teachers") && user.role === "SCHOOL") {
        const teachers = await Teacher.countDocuments({ school: user.id });
        response = `There are ${teachers} teachers registered in your school.`;
      }

      //anyone asks about notices
else if (prompt.toLowerCase().includes("notices")) {
        const notices = await Notice.find().sort({ createdAt: -1 }).limit(5);
        response = notices.length
          ? `Recent notices: ${notices.map((n) => n.title).join(", ")}`
          : "No notices available.";
      }
      //anyone aasks about exam query
      else if (prompt.toLowerCase().includes("exams") || prompt.toLowerCase().includes("examinations")) {
        const exams = await Examination.find({ school: user.schoolId }).sort({ date: 1 });
        response = exams.length
          ? `Upcoming exams: ${exams.map(e => `${e.subject} on ${e.date}`).join(", ")}`
          : "No upcoming exams found.";
      }
      
       // ANYONE: Exams
      else if (
        prompt.toLowerCase().includes("exams") ||
        prompt.toLowerCase().includes("examinations")
      ) {
        const exams = await Examination.find({ school: user.school })
          .populate("subject class")
          .sort({ examDate: 1 });

        response = exams.length
          ? `Upcoming exams:\n${exams
              .map(
                (e) =>
                  `${e.subject.subject_name} (${e.examType}) for ${e.class.class_text} on ${e.examDate.toDateString()}`
              )
              .join("\n")}`
          : "No upcoming exams found.";
      }

       // STUDENT: Attendance summary
      else if (prompt.toLowerCase().includes("my attendance") && user.role === "STUDENT") {
        const attendance = await Attendance.find({ student: user.id });
        const present = attendance.filter((a) => a.status === "Present").length;
        const absent = attendance.filter((a) => a.status === "Absent").length;
        response = `Your attendance summary: Present ${present} days, Absent ${absent} days.`;
      }

       // TEACHER: My schedule
      else if (prompt.toLowerCase().includes("my schedule") && user.role === "TEACHER") {
        const schedule = await Schedule.find({ teacher: user.id })
          .populate("class subject");

        response = schedule.length
          ? `Your teaching schedule:\n${schedule
              .map(
                (s) =>
                  `${s.class.class_text} | ${s.subject.subject_name} (${s.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${s.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`
              )
              .join("\n")}`
          : "You have no scheduled classes yet.";
      }

      // SCHOOL ADMIN: Stats (students, teachers, subjects, classes)
      else if (prompt.toLowerCase().includes("school stats") && user.role === "SCHOOL") {
        const stats = {
          students: await Student.countDocuments({ school: user.id }),
          teachers: await Teacher.countDocuments({ school: user.id }),
          subjects: await Subject.countDocuments({ school: user.id }),
          classes: await Class.countDocuments({ school: user.id }),
        };
        response = `School Stats:\nStudents: ${stats.students}, Teachers: ${stats.teachers}, Subjects: ${stats.subjects}, Classes: ${stats.classes}`;
      }

      //by default
      else {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        response = result.response.text();
      }

    
    res.json({ response });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
