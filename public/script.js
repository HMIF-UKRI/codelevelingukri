const chatPanel = document.querySelector("[data-chat-panel]");
const chatToggle = document.querySelector("[data-chat-toggle]");
const chatClose = document.querySelector("[data-chat-close]");
const chatForm = document.querySelector("[data-chat-form]");
const chatMessages = document.querySelector("[data-chat-messages]");
const openChatButtons = document.querySelectorAll("[data-open-chat]");

const history = [];

function setChatOpen(isOpen) {
  chatPanel.classList.toggle("open", isOpen);
  chatPanel.setAttribute("aria-hidden", String(!isOpen));
  chatToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("chat-open", isOpen && window.innerWidth < 560);

  if (isOpen) {
    const input = chatForm.querySelector("input");
    window.setTimeout(() => input.focus(), 120);
  }
}

function addMessage(text, role, extraClass = "") {
  const message = document.createElement("div");
  message.className = ["message", role, extraClass].filter(Boolean).join(" ");
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return message;
}

async function sendMessage(text, previousHistory) {
  const loadingMessage = addMessage("Gemini sedang menyusun jawaban...", "bot", "loading");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        history: previousHistory
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Chatbot belum bisa menjawab saat ini.");
    }

    const reply = data.reply || "Saya belum punya jawaban untuk pertanyaan itu.";
    loadingMessage.classList.remove("loading");
    loadingMessage.textContent = reply;
    history.push({ role: "assistant", text: reply });
  } catch (error) {
    loadingMessage.classList.remove("loading");
    loadingMessage.textContent = error.message;
  }
}

chatToggle.addEventListener("click", () => {
  setChatOpen(!chatPanel.classList.contains("open"));
});

chatClose.addEventListener("click", () => setChatOpen(false));

openChatButtons.forEach((button) => {
  button.addEventListener("click", () => setChatOpen(true));
});

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = chatForm.querySelector("input");
  const text = input.value.trim();

  if (!text) {
    return;
  }

  input.value = "";
  addMessage(text, "user");
  const previousHistory = history.slice(-8);
  history.push({ role: "user", text });
  await sendMessage(text, previousHistory);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  element.style.animationPlayState = "paused";
  revealObserver.observe(element);
});
