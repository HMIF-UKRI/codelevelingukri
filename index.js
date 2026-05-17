require("dotenv").config({ quiet: true });

const express = require("express");
const path = require("path");

const app = express();
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const preferredPort = parsePort(process.env.PORT || process.env.BASE_PORT, 3000);
const portRange = parsePort(process.env.PORT_RANGE, 50);

app.disable("x-powered-by");
app.use(express.json({ limit: "64kb" }));
app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Format JSON request tidak valid." });
  }

  return next(error);
});

const publicPath = path.join(__dirname, "public");
app.use(
  express.static(publicPath, {
    etag: true,
    maxAge: process.env.NODE_ENV === "production" ? "1h" : 0
  })
);

const workshopContext = [
  "Website ini adalah template portofolio peserta workshop.",
  "Konten dapat diedit oleh peserta untuk mengganti nama, inisial avatar, asal sekolah atau kampus, jurusan atau program studi, minat belajar, skill, project, email, GitHub, LinkedIn, dan link demo.",
  "Bagian utama halaman: hero perkenalan, profil peserta, skill, project, checklist bagian yang bisa diedit, kontak, dan chatbot.",
  "Contoh placeholder yang perlu diganti: Nama Peserta, Nama Sekolah atau Kampus, Jurusan Peserta, emailpeserta@example.com, link GitHub, dan link LinkedIn.",
  "Chatbot membantu peserta memahami cara mengedit konten portofolio dan menjelaskan bagian-bagian halaman secara ringkas."
].join(" ");

function parsePort(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isInteger(parsed) && parsed > 0 && parsed < 65536) {
    return parsed;
  }

  return fallback;
}

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
                text: `Kamu adalah asisten pembelajaran pada template website portofolio peserta. Jawab dalam Bahasa Indonesia yang ringkas, praktis, dan mudah diikuti peserta. Gunakan konteks berikut sebagai dasar jawaban: ${workshopContext} Jika pengguna bertanya di luar konteks halaman, jawab seperlunya lalu arahkan kembali ke cara mengedit profil, asal sekolah/kampus, jurusan, skill, project, kontak, atau deploy portofolio.`
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

function listenWithPortFallback(appInstance, startPort, attempts) {
  return new Promise((resolve, reject) => {
    let currentPort = startPort;
    let remainingAttempts = Math.max(1, attempts);

    const tryListen = () => {
      const server = appInstance.listen(currentPort);

      server.once("listening", () => {
        resolve({ server, port: currentPort });
      });

      server.once("error", (error) => {
        if (error.code === "EADDRINUSE" && remainingAttempts > 1) {
          remainingAttempts -= 1;
          currentPort += 1;
          tryListen();
          return;
        }

        reject(error);
      });
    };

    tryListen();
  });
}

if (require.main === module) {
  listenWithPortFallback(app, preferredPort, portRange)
    .then(({ port }) => {
      console.log(`Workshop app running at http://localhost:${port}`);
      if (port !== preferredPort) {
        console.log(`PORT ${preferredPort} sedang dipakai, memakai PORT ${port}.`);
      }
    })
    .catch((error) => {
      console.error(`Gagal menjalankan server: ${error.message}`);
      process.exit(1);
    });
}

module.exports = app;
