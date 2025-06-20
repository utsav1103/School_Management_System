const express = require ("express");
const authMiddleware = require("../auth/auth");
const {createSubject , getAllSubjects, updateSubjectWithId , deleteSubjectWithId} = require("../controllers/subject.controller")
const router = express.Router();

router.post("/create",authMiddleware(['SCHOOL']), createSubject);
router.get("/all",authMiddleware(['SCHOOL']) ,getAllSubjects);

router.patch("/update/:id",authMiddleware(["SCHOOL"]), updateSubjectWithId);// auth for update or not check
router.delete("/delete/:id",authMiddleware(["SCHOOL"]), deleteSubjectWithId);


module.exports = router;