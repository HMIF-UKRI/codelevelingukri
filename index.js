require("dotenv").config({ quiet: true });

const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

app.use(express.json({ limit: "1mb" }));
app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Format JSON request tidak valid." });
  }

  return next(error);
});

const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .slice(-8)
    .filter((item) => item && typeof item.text === "string")
    .map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.text.slice(0, 1500) }]
    }));
}

function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part) => part.text || "")
    .join("")
    .trim();
}

app.post("/api/chat", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message) {
    return res.status(400).json({ error: "Pesan tidak boleh kosong." });
  }

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY belum disetel di environment variable."
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text:
                  "Kamu adalah chatbot pada website portofolio workshop. Jawab dalam Bahasa Indonesia yang ringkas, ramah, dan profesional. Bantu pengunjung memahami profil, skill, project, materi workshop, cara kolaborasi, dan kontak. Jika ditanya hal di luar konteks, jawab seperlunya lalu arahkan kembali ke portofolio/workshop."
              }
            ]
          },
          contents: [
            ...normalizeHistory(req.body?.history),
            {
              role: "user",
              parts: [{ text: message.slice(0, 2000) }]
            }
          ],
          generationConfig: {
            temperature: 0.75,
            topP: 0.9,
            maxOutputTokens: 700
          }
        }),
        signal: controller.signal
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const detail = data?.error?.message || "Gagal menghubungi Gemini API.";
      return res.status(502).json({ error: detail });
    }

    const reply = extractGeminiText(data);
    return res.json({
      reply:
        reply ||
        "Saya belum mendapatkan jawaban dari Gemini. Coba ulangi dengan pertanyaan yang lebih spesifik."
    });
  } catch (error) {
    const isTimeout = error.name === "AbortError";
    return res.status(504).json({
      error: isTimeout
        ? "Request ke Gemini timeout. Coba lagi sebentar."
        : "Terjadi kesalahan server saat memproses chatbot."
    });
  } finally {
    clearTimeout(timeout);
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Portfolio app running at http://localhost:${port}`);
  });
}

module.exports = app;
