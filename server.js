import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..")));

app.post("/api/chat", async (req, res) => {
  const { symptoms } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
              You are healthBot — a friendly, empathetic virtual assistant.
              Use <strong> for symptoms and <span class="doctor"></span> for doctor recommendations.
              Keep everything compact and conversational.
            `
          },
          { role: "user", content: `Symptoms: ${symptoms}` }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error communicating with AI" });
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
