const express = require ("express");
const authMiddleware = require("../auth/auth");
const {createClass , getAllClasses, updateClassWithId , deleteClassWithId} = require("../controllers/class.controller")
const router = express.Router();

router.post("/create",authMiddleware(['SCHOOL']), createClass);
router.get("/all",authMiddleware(['SCHOOL']) ,getAllClasses);

router.patch("/update/:id",authMiddleware(["SCHOOL"]), updateClassWithId);// auth for update or not check
router.get("/delete/:id",authMiddleware(["SCHOOL"]), deleteClassWithId);


module.exports = router;