import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

export default router;
