const express = require ("express");
const authMiddleware = require("../auth/auth");
const { createSchedule, getSchedulesWithClass, updateScheduleWithId, deleteScheduleWithId, getSchedulesWithId } = require("../controllers/schedule.controller");

const router = express.Router();

router.post("/create",authMiddleware(['SCHOOL']), createSchedule);
router.get("/fetch-with-class/:id",authMiddleware(['SCHOOL']) ,getSchedulesWithClass);

router.get("/fetch/:id",authMiddleware(["SCHOOL"]), getSchedulesWithId);// auth for update or not check
router.post("/update/:id",authMiddleware(["SCHOOL"]), updateScheduleWithId);// auth for update or not check
router.delete("/delete/:id",authMiddleware(["SCHOOL"]), deleteScheduleWithId);


module.exports = router;  