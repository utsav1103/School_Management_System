const express = require ("express");
const authMiddleware = require("../auth/auth");
const { getStudentsWithQuery, updateStudent, getStudentOwnData,getStudentsWithQuery,loginStudent, getStudentWithID, deleteStudentWithId } = require("../controllers/student.controller");

const router = express.Router();

router.post("/register", re);
router.get("/all",authMiddleware['SCHOOL'], getStudentsWithQuery);
router.post("/login", loginStudent);
router.patch("/update",authMiddleware(["SCHOOL"]), updateStudent);// auth for update or not check
router.get("/fetch-single",authMiddleware(["STUDENT"]), getStudentOwnData);
router.get("/fetch/:id", authMiddleware(['SCHOOL']), getStudentWithID);
router.delete("/delete /:id", authMiddleware(['SCHOOL']), deleteStudentWithId);



module.exports = router;