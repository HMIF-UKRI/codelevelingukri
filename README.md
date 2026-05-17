# Workshop Portfolio + Gemini Chatbot

Website portofolio untuk kebutuhan workshop, dibuat dengan Express.js dan siap deploy ke Vercel. Chatbot berjalan lewat endpoint server-side agar `GEMINI_API_KEY` tidak pernah dikirim ke browser.

## Jalankan Lokal

```bash
npm install
copy .env.example .env
npm run dev
```

Isi `.env`:

```env
GEMINI_API_KEY=api_key_gemini_kamu
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
```

Buka `http://localhost:3000`.

## Deploy ke Vercel

1. Push project ini ke GitHub.
2. Import repository di Vercel.
3. Vercel akan mendeteksi Express dari `index.js`.
4. Buka Project Settings > Environment Variables.
5. Tambahkan `GEMINI_API_KEY` dengan API key Gemini kamu.
6. Tambahkan opsional `GEMINI_MODEL=gemini-2.5-flash`.
7. Deploy ulang project.

## File Penting

- `index.js`: server Express dan endpoint `/api/chat`.
- `public/index.html`: konten portofolio.
- `public/styles.css`: desain visual responsive.
- `public/script.js`: interaksi chatbot dan animasi.

## Kustomisasi Cepat

Ganti teks berikut sebelum workshop:

- `Nama Kamu`
- Initial avatar `NK`
- Email `emailkamu@example.com`
- Link LinkedIn dan GitHub
- Project dan jadwal workshop
