require("dotenv").config();

const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");

const PORT = 3434;
const app = express();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groqAI = new Groq({ apiKey: process.env.GROQ_API_KEY });

//미들웨어
app.use(express.json()); //body의 json 해석

app.post("/chat/gen", async (req, res) => {
  const { ask = "질문 없음", model = "gemma-4-26b-a4b-it" } = req.body;
  console.log(ask);
  const response = await genAI.models.generateContent({
    model,
    contents: ask,
  });

  res.json({ answer: response.text });
});

app.post("/chat/groq", async (req, res) => {
  const { ask = "질문 없음", model = "openai/gpt-oss-120b" } = req.body;
  console.log(ask);
  const response = await groqAI.chat.completions.create({
    messages: [{ role: "user", content: ask }],
    model,
  });

  res.json({ msg: response.choices[0].message.content });
});

app.listen(PORT, () => {
  console.log(`${PORT}로 작동 중`);
});
