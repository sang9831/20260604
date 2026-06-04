const express = require("express");

const app = express();
const PORT = 3333;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("gdgd");
});

app.post("/chat", (req, res) => {
  const { msg } = req.body;
  res.json({
    reply: `${msg}라고 말씀하셨네요`,
  });
});

app.listen(PORT, () => {
  //   console.log("3000에서 서버 실행 중");
  console.log(`${PORT}에서 서버 실행 중`);
});
