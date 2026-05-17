# Portfolio Peserta + Gemini Chatbot

Template website portofolio untuk peserta workshop. Peserta bisa mengganti nama, asal sekolah/kampus, jurusan, skill, project, dan kontak sebelum deploy.

## Jalankan Lokal

```bash
npm install
copy isi .env.example
buat file baru .env
lalu pastekan kedalam .env isi dari .env.example
setelah itu npm run dev untuk menjalankan website localhost
```

Isi `.env`:

```env
GEMINI_API_KEY=api_key_gemini_kamu
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
PORT_RANGE=50
```

Buka alamat yang muncul di terminal, misalnya `http://localhost:3000`.

## Bagian Yang Perlu Diedit Peserta

- `Nama Peserta`
- `NP` sebagai inisial avatar
- `Nama Sekolah atau Kampus`
- `Jurusan Peserta`
- daftar skill
- daftar project
- `emailpeserta@example.com`
- link GitHub, LinkedIn, atau demo project

## File Penting

- `index.js`: server Express, endpoint `/api/chat`, dan fallback port otomatis.
- `public/index.html`: konten portofolio peserta.
- `public/styles.css`: tampilan responsif portofolio.
- `public/script.js`: interaksi chatbot dan animasi.
- `.env.example`: contoh konfigurasi environment.
