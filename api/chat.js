const fetch = require("node-fetch");

module.exports = async function handler(req, res) {
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
              You are healthBot — a friendly and supportive assistant.
              Use <strong> for symptoms and <span class="doctor"></span> for doctor recommendations.
              Keep replies compact and chat-style.
            `
          },
          {
            role: "user",
            content: `Symptoms: ${symptoms}`
          }
        ]
      }),
    });

    const data = await response.json();

    res.status(200).json({
      reply: data.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error." });
  }
};