require("dotenv").config();

const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");

const app = express();
const { GEMINI_API_KEY, GROQ_API_KEY, PORT } = process.env;

const path = require("path");
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const groqAI = new Groq({ apiKey: GROQ_API_KEY });

//미들웨어
app.use(express.json()); //body의 json 해석
app.use(express.static(path.join(__dirname, "public")));

app.post("/chat", async (req, res) => {
  const { provider, model, ask } = req.body;
  let result;
  switch (true) {
    case provider === "google":
      console.log("google 제공자 요청");
      result = await useGoogle(model, ask);
      break;
    case provider === "groq":
      console.log("groq 제공자 요청");
      result = await useGroq(model, ask);
      break;
    default:
      console.log("잘못된 Provider");
      res.status(404).json({ msg: "존재하지 않는 Provider" });
      return;
  }
  res.json({
    result,
  });
});

async function useGoogle(model, ask) {
  const response = await genAI.models.generateContent({
    model,
    contents: ask,
  });
  return response.text;
}
async function useGroq(model, ask) {
  const response = await groqAI.chat.completions.create({
    messages: [{ role: "user", content: ask }],
    model,
  });
  return response.choices[0].message.content;
}

app.listen(PORT, () => {
  console.log(`${PORT}로 작동 중`);
});
