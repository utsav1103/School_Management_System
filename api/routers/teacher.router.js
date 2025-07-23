const express = require ("express");
const authMiddleware = require("../auth/auth");
const { getTeacherWithID, updateTeacher, getTeacherOwnData, getTeachersWithQuery, deleteTeacherWithId, loginTeacher, registerTeacher } = require("../controllers/teacher.controller");

const router = express.Router();

router.post("/register",authMiddleware(['SCHOOL']), registerTeacher);
router.get("/fetch-with-query",authMiddleware(['SCHOOL']), getTeachersWithQuery);
router.post("/login", loginTeacher);
router.patch("/update/:id",authMiddleware(["SCHOOL"]), updateTeacher);// auth for update or not check
router.get("/fetch-single",authMiddleware(["TEACHER"]), getTeacherOwnData);
router.get("/fetch/:id", authMiddleware(['SCHOOL']), getTeacherWithID);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteTeacherWithId);



module.exports = router;