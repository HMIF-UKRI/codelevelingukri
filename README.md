# Portfolio Peserta + Gemini Chatbot

Template website portofolio untuk peserta workshop. Peserta bisa mengganti nama, asal sekolah/kampus, jurusan, skill, project, dan kontak sebelum menjalankan atau deploy website.

## 1. Buka Folder Project

Pastikan terminal VS Code sudah berada di folder project:

```bash
cd codelevelingukri
```

Jika sudah berada di folder project, lanjut ke step berikutnya.

## 2. Install Dependency

Jalankan:

```bash
npm install
```

Perintah ini akan menginstall package yang dibutuhkan project.

## 3. Buat File `.env`

Copy isi file `.env.example`, lalu buat file baru bernama `.env`.

Cara cepat lewat terminal:

```bash
copy .env.example .env
```

Untuk Linux/VPS:

```bash
cp .env.example .env
```

## 4. Isi API Key Gemini

Buka file `.env`, lalu isi bagian:

```env
GEMINI_API_KEY=isi_api_key_gemini_kamu
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
PORT_RANGE=50
```

Panduan membuat API key Gemini:

```text
https://youtu.be/AHkR-incMMs
```

## 5. Jalankan Website di Lokal

Jalankan:

```bash
npm run dev
```

Buka di browser:

```text
http://localhost:3000
```

Jika port `3000` sedang dipakai, aplikasi akan mencoba port berikutnya.

## 6. Edit Isi Portofolio

File utama yang perlu diedit:

```text
public/index.html
```

Bagian yang perlu diganti:

- `Nama Peserta`
- `NP` sebagai inisial avatar
- `Nama Sekolah atau Kampus`
- `Jurusan Peserta`
- deskripsi profil
- daftar skill
- daftar project
- `emailpeserta@example.com`
- link GitHub, LinkedIn, atau demo project

## 7. Deploy di VPS Saat Workshop

Login ke VPS menggunakan user masing-masing:

```bash
ssh username@IP_VPS
```

Clone repo project:

```bash
git clone URL_REPOSITORY_KAMU
cd NAMA_FOLDER_PROJECT
```

Install dependency:

```bash
npm install
```

Buat file `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
nano .env
```

Gunakan port berbeda untuk setiap peserta. Contoh:

```env
PORT=3001
```

Contoh pembagian port:

```text
peserta01 = 3001
peserta02 = 3002
peserta03 = 3003
...
peserta10 = 3010
```

Jalankan project:

```bash
npm start
```

Atau menggunakan PM2:

```bash
pm2 start index.js --name portfolio-peserta01
pm2 list
```

## 8. Cek Hasil Deploy

Dari VPS:

```bash
curl http://localhost:3001
```

Dari browser:

```text
http://IP_VPS:3001
```

Sesuaikan angka port dengan port masing-masing peserta.

## 9. Troubleshooting

Jika website tidak bisa dibuka:

- Pastikan `npm install` sudah selesai.
- Pastikan file `.env` sudah ada.
- Pastikan `GEMINI_API_KEY` sudah diisi.
- Pastikan `PORT` tidak sama dengan peserta lain.
- Cek proses PM2 dengan `pm2 list`.
- Restart aplikasi dengan `pm2 restart nama-app`.

Jika chatbot muncul tapi tidak menjawab:

- Cek `GEMINI_API_KEY` di `.env`.
- Pastikan VPS punya koneksi internet.
- Cek log aplikasi:

```bash
pm2 logs nama-app
```

## 10. File Penting

- `index.js`: server Express, endpoint `/api/chat`, dan fallback port otomatis.
- `public/index.html`: konten portofolio peserta.
- `public/styles.css`: tampilan website.
- `public/script.js`: interaksi chatbot dan animasi.
- `.env.example`: contoh konfigurasi environment.
