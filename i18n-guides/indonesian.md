# Panduan Terjemahan Bahasa Indonesia (Astro Docs)

> Dokumen ini adalah panduan gaya dan glosarium untuk penerjemah **Bahasa Indonesia** pada Astro Docs. Tujuannya menjaga konsistensi istilah, nada, dan format di seluruh halaman.

---

## Prinsip Umum

- **Akurat dulu, alami kemudian.** Utamakan ketepatan makna teknis, lalu perhalus agar enak dibaca.
- **Konsisten.** Ikuti glosarium dan contoh di dokumen ini.
- **Minimalis.** Jangan menambah/mengurangi informasi; jangan memodifikasi struktur MDX atau contoh kode.
- **Hormati orisinal.** Nama proyek, API, dan token kode **tidak diterjemahkan** (lihat daftar “Jangan diterjemahkan”).

---

## Nada & Gaya

- **Nada:** ramah, profesional, dan langsung ke inti. Hindari bahasa terlalu santai.
- **Orang kedua:** gunakan **“Anda”** (bukan “kamu”).
- **Bentuk kalimat:** aktif bila memungkinkan.
- **Istilah Inggris:** jika dipertahankan, beri padanan saat pertama kali muncul, contoh: *prefetch (pengambilan awal)*.
- **Huruf kapital:** ikuti KBBI untuk umum; kapital untuk nama produk/proyek/fitur resmi (Astro, Starlight, React).

---

## Ejaan & Tanda Baca

- Ikuti **EYD/KBBI** untuk ejaan dan imbuhan (“di-” vs “di” terpisah).
- **Koma** sebelum “yang/untuk/karena” sesuai kebutuhan makna.
- **Angka:** gunakan pemisah desimal **koma** (mis. `1,5 MB`) bila konteks non-kode. Di kode/konfigurasi, **ikut aslinya**.
- **Tanggal:** “5 November 2025”.
- **Jam:** 24 jam, mis. “07.00”, “21.30”.

---

## Format Teknis (MD/MDX)

- **Jangan ubah**:
  - Frontmatter (blok `---` di atas).
  - Impor komponen, ekspor, dan sintaks MDX.
  - Path/file/slug/link relatif.
  - Blok kode (bahasa, indentasi, inline backticks).
- **Komentar dalam kode** boleh diterjemahkan jika bukan bagian dari output/command.
- **UI components/admonitions** (`<ReadMore>`, `<Steps>`, dll.) tetap; terjemahkan **hanya** konten di dalamnya.

---

## Jangan Diterjemahkan

- Nama proyek/brand: **Astro**, **Starlight**, **Vercel**, **Netlify**, **Cloudflare**, **GitHub**, dll.
- Nama paket/ekspor/API: `astro:content`, `getCollection`, `Astro.redirect`, `Astro.currentLocale`, dll.
- Nama file/folder/ekstensi: `astro.config.ts`, `src/content/docs`, `.mdx`, dll.
- Perintah CLI & output terminal.
- Konfigurasi, key JSON/YAML, env var: `defaultLocale`, `locales`, `NODE_ENV`, dll.
- Istilah konsep yang sudah mapan dan lebih jelas tanpa terjemahan: **islands**, **SSR/SSG**, **prefetch**, **middleware** (beri padanan di awal jika perlu).

---

## Terjemahkan atau Pertahankan?

- **Terjemahkan**: frasa antarmuka umum (mis. “Next steps” → “Langkah selanjutnya”), kalimat narasi, instruksi.
- **Pertahankan**: istilah API, nama properti, identifier, nama fitur resmi (lihat glosarium “Tetap Inggris”).

---

## Glosarium Inti

> Gunakan persis sesuai di tabel ini.

| English (source)              | Indonesia (pakai ini)                    | Catatan                                                                 |
|---                            |---                                       |---                                                                      |
| guide                         | panduan                                  | Judul bagian: “Guides and recipes” → “Panduan dan resep”                |
| how-to recipe(s)              | resep (how-to)                           | “Recipes” → “Resep”; boleh “Resep cara” jika konteks butuh kejelasan    |
| overview                      | ringkasan                                |                                                                          |
| quick start                   | mulai cepat                              |                                                                          |
| getting started               | memulai                                  |                                                                          |
| upgrade                       | peningkatan / upgrade                    | “Upgrade to v5” → “Peningkatan ke v5”                                   |
| adapter                       | adapter                                  | Tetap “adapter” (umum di ekosistem JS)                                  |
| integration                   | integrasi                                |                                                                          |
| content collections           | koleksi konten                           |                                                                          |
| front matter                  | frontmatter                               | Tanpa spasi (sesuai istilah umum di Astro)                              |
| build                         | build                                    | Sebagai proses/hasil; biarkan Inggris                                   |
| server rendering              | perenderan server                        |                                                                        |
| on-demand rendering           | perenderan saat diminta                  |                                                                        |
| server islands                | server islands                           | **Tetap Inggris**                                                       |
| islands architecture          | arsitektur islands                       | “islands” dipertahankan                                                 |
| image optimization            | optimasi gambar                          |                                                                          |
| prefetch                      | prefetch (pengambilan awal)             | Pertahankan; beri padanan pada penyebutan pertama                       |
| runtime                       | runtime                                  |                                                                          |
| endpoint                      | endpoint                                 |                                                                          |
| middleware                    | middleware                               |                                                                          |
| session                       | sesi                                     |                                                                          |
| environment variables         | variabel lingkungan                      |                                                                          |
| fallback                      | fallback                                 | Pertahankan; dapat diberi padanan “cadangan” saat pertama kali muncul   |
| locale                        | locale                                   |                                                                          |
| default locale                | locale bawaan                            |                                                                          |
| routing                       | perutean                                 |                                                                          |
| relative URL                  | URL relatif                              |                                                                          |
| slug                          | slug                                     |                                                                          |
| table of contents             | daftar isi                               |                                                                          |
| pagination                    | penomoran halaman                        | “pagination” juga sering dipakai; pilih satu dan konsisten              |
| changelog                     | catatan rilis                            |                                                                          |
| breaking change               | perubahan besar yang memutus kompatibilitas |                                                                    |
| deprecate / deprecated        | tidak lagi direkomendasikan / usang      | Pilih sesuai konteks                                                    |
| experimental                  | eksperimental                            |                                                                          |
| stable                        | stabil                                   |                                                                          |

**Catatan istilah Astro khusus:**

- **Astro Islands** → gunakan **“Astro islands”** (tanpa terjemahan “pulau”).
- **View Transitions** → **transisi tampilan**.
- **Content Collections** → **koleksi konten**.
- **Actions** → **aksi** (fitur Astro Actions).
- **Dev Toolbar** → **Dev Toolbar** (pertahankan; bisa diberi “Bilah Alat Dev” saat pertama).

---

## Contoh Penerapan

**Sebelum (EN):**
> Use collections to organize translated content and fetch entries dynamically.

**Sesudah (ID):**
> Gunakan **koleksi konten** untuk mengorganisasi konten terjemahan dan mengambil entri secara dinamis.

**Sebelum (EN):**
> Configure your default and supported locales in `astro.config.ts`.

**Sesudah (ID):**
> Konfigurasikan **locale bawaan** dan **locale yang didukung** di `astro.config.ts`.

---

## Link, Anchor, & Rute

- **Jangan ubah slug/anchor** (tautan `#heading-id`) kecuali halaman ID-nya memang diterjemahkan dan anchor otomatis berubah.
- Teks tautan boleh diterjemahkan; **URL tetap**.
- Pastikan tautan relatif tetap valid antar-bahasa.

---

## Kode & Output Terminal

- **Perintah/flag/output**: pertahankan bahasa sumber.
- **Komentar**: boleh diterjemahkan jika tidak mengubah perilaku.
- **Nama variabel/fungsi**: jangan diubah.
- **Format blok kode**: bahasa, indentasi, dan baris kosong **harus sama**.

---

## Satuan & Istilah Teknis

- **Ukuran file**: KB/MB/GB (huruf kapital), contoh “2 MB”.
- **Sistem operasi**: Windows/macOS/Linux tetap Inggris.
- **Browser**: Chrome, Firefox, Safari, Edge tetap.

---

## Checklist Sebelum Commit/PR

1. Mengikuti **glosarium** dan gaya di atas.
2. **Tidak** mengubah struktur MDX, impor, atau contoh kode.
3. Tautan relatif dan anchor **berfungsi**.
4. EYD/KBBI konsisten; kapitalisasi benar.
5. Komentar commit gunakan format:  
   `i18n(id): <ringkas perubahan>`.
6. PR fokus kecil & tematik (lebih mudah direview).

---

## Tanya & Koordinasi

- Jika ragu pada istilah, tambahkan ke bagian “Butuh Keputusan” (di bawah) lalu diskusikan di review PR atau kanal komunitas.
- Kontroversi penamaan → pilih satu jalur, konsisten, dan dokumentasikan di glosarium.

### Butuh Keputusan (daftar terbuka)

- pagination → **penomoran halaman** *atau* “pagination”?  
- fallback → biarkan Inggris *atau* pakai “cadangan” setelah penyebutan pertama?

Tambahkan kasus lain saat menemukan.

---

## Contoh Revisi Umum

- “kamu” → **Anda**  
- “default language” → **locale bawaan** (bukan “bahasa default”)  
- “file path” → **path file**  
- “build” (kata benda) → **build** (tetap)  
- “server-side rendering (SSR)” → **perenderan server (SSR)**

---

## Kredit

Terima kasih untuk semua kontributor penerjemahan Bahasa Indonesia. Tetap jaga konsistensi dan semangat kolaborasi!

