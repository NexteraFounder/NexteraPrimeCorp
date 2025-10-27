const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch');

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.MODEL || "gpt-4";

if (!OPENAI_KEY) {
  console.error("❌ Please set your OPENAI_API_KEY in .env");
  process.exit(1);
}

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message || "";
    const messages = [
      { role: "system", content: "Kamu adalah NEXA, AI futuristik milik Nextera Prime Corporation. Jawab profesional, elegan, dan singkat (maksimal 4 kalimat)." },
      { role: "user", content: userMessage }
    ];
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: MODEL, messages, max_tokens: 800, temperature: 0.3 })
    });
    const data = await response.json();
    res.json({ answer: data?.choices?.[0]?.message?.content || "Maaf, tidak ada jawaban." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 NEXA AI running at http://localhost:${port}`));
