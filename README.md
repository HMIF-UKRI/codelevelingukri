# UKRI Workshop Template + Gemini Chatbot

Contoh website bertema Universitas Kebangsaan Republik Indonesia untuk bahan pembelajaran workshop. Website ini bukan situs resmi UKRI; konten dan tampilannya dipakai sebagai contoh latihan menyusun halaman profil kampus sederhana.

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
PORT_RANGE=50
```

Buka alamat yang muncul di terminal, misalnya `http://localhost:3000`.

## Catatan Workshop

- Website ini hanya bahan pembelajaran.
- Website ini bukan website resmi UKRI.
- Peserta boleh mengganti teks, gambar, warna, section, dan link sesuai kebutuhan workshop.
- API key Gemini tetap dipakai di server lewat `.env`, bukan di frontend.

## File Penting

- `index.js`: server Express, endpoint `/api/chat`, dan fallback port otomatis.
- `public/index.html`: konten contoh website bertema UKRI.
- `public/styles.css`: tampilan responsif dengan palet merah, hijau, dan emas.
- `public/script.js`: interaksi chatbot dan animasi.
- `.env.example`: contoh konfigurasi environment.
