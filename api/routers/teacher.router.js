const express = require ("express");
const authMiddleware = require("../auth/auth");
const { registerTeacher } = require("../controllers/student.controller");
const { getTeacherWithID, updateTeacher, getTeacherOwnData, getTeachersWithQuery, deleteTeacherWithId } = require("../controllers/teacher.controller");

const router = express.Router();

router.post("/register",authMiddleware(['SCHOOL']), registerTeacher);
router.get("/fetch-with-query",authMiddleware(['SCHOOL']), getTeachersWithQuery);
router.post("/login", loginStudent);
router.patch("/update/:id",authMiddleware(["SCHOOL"]), updateTeacher);// auth for update or not check
router.get("/fetch-single",authMiddleware(["TEACHER"]), getTeacherOwnData);
router.get("/fetch/:id", authMiddleware(['SCHOOL']), getTeacherWithID);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteTeacherWithId);



module.exports = router;