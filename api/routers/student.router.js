const express = require ("express");
const authMiddleware = require("../auth/auth");
const { getStudentsWithQuery, updateStudent, getStudentOwnData,loginStudent, getStudentWithID, deleteStudentWithId, registerStudent } = require("../controllers/student.controller");

const router = express.Router();

router.post("/register",authMiddleware(['SCHOOL']), registerStudent);
router.get("/fetch-with-query",authMiddleware(['SCHOOL']), getStudentsWithQuery);
router.post("/login", loginStudent);
router.patch("/update/:id",authMiddleware(["SCHOOL"]), updateStudent);// auth for update or not check
router.get("/fetch-single",authMiddleware(["STUDENT"]), getStudentOwnData);
router.get("/fetch/:id", authMiddleware(['SCHOOL']), getStudentWithID);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteStudentWithId);



module.exports = router;