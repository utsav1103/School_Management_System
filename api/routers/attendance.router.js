const express = require ("express");
const authMiddleware = require("../auth/auth");
const {markAttendance,getAttendance,checkAttendance} = require("../controllers/subject.controller")
const router = express.Router();

router.post("/mark",authMiddleware(['TEACHER']), markAttendance);
router.get("/:studentId",authMiddleware(['SCHOOL']) ,getAttendance);

router.get("/check/:classId",authMiddleware(["SCHOOL"]),checkAttendance);

module.exports = router;