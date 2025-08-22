const express = require ("express");
const authMiddleware = require("../auth/auth");
const { createNotice, getAllNotices, updateNoticeWithId, deleteNoticeWithId } = require("../controllers/notice.controller");
const router = express.Router();

router.post("/create",authMiddleware(['SCHOOL']), createNotice);
router.get("/all",authMiddleware(['SCHOOL']) ,getAllNotices);
//router.get("/single/:id",authMiddleware(['SCHOOL']) ,getSingleClass);

router.patch("/update/:id",authMiddleware(["SCHOOL"]), updateNoticeWithId);// auth for update or not check
router.delete("/delete/:id",authMiddleware(["SCHOOL"]), deleteNoticeWithId);


module.exports = router;  