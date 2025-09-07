const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { route } = require("./school.router");
const authMiddleware = require("../auth/auth");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat",authMiddleware(['SCHOOL','TEACHER','STUDENT']), async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    res.json({ response: result.response.text() });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
