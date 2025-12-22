const checkButton = document.getElementById("checkButton");
const symptomInput = document.getElementById("symptomInput");
const chatContainer = document.getElementById("chatContainer");

let messages = [
  {
    role: "system",
    content: `
You are HealthBot — a friendly, empathetic virtual assistant.
You help users understand possible causes of their symptoms
and suggest which type of doctor to contact.

When you respond:
- Highlight symptoms using <strong></strong>.
- Recommend specific doctors with <span class="doctor"></span>.
- Never use asterisks (*).
- Keep responses short and chat-style.
- Stay warm, conversational, and supportive.
- Never diagnose directly.
- Remember the conversation for consistency.
- Always encourage the user to elaborate on symptoms.
- Never end the conversation.
- Format advice using:

<ul class="advice-list">
  <li><strong>Example:</strong> Keep hydrated.</li>
</ul>

Keep everything compact.
`
  }
];

symptomInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const symptoms = symptomInput.value.trim();
  if (!symptoms) return;

  const userBubble = document.createElement("div");
  userBubble.classList.add("user-message");
  userBubble.textContent = symptoms;
  chatContainer.appendChild(userBubble);

  symptomInput.value = "";
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const aiBubble = document.createElement("div");
  aiBubble.classList.add("ai-message");
  aiBubble.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
  chatContainer.appendChild(aiBubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });

    const data = await response.json();

    const answer = data.reply;

    aiBubble.innerHTML = answer;
    chatContainer.scrollTop = chatContainer.scrollHeight;

    messages.push({ role: "user", content: symptoms });
    messages.push({ role: "assistant", content: answer });

  } catch (err) {
    aiBubble.innerHTML = "<p>There was an error. Please try again later.</p>";
  }
}

checkButton.addEventListener("click", sendMessage);