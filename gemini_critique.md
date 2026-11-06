# DOKUMEN SPESIFIKASI & AUDIT REDESIGN STOREFRONT V2.0
**Acuan Desain:** Apple.com Editorial & Samsung Official Flagship Store[cite: 2]  
**Target Berkas:** `resources/js/Pages/Home.jsx` & `resources/js/Pages/Buy.jsx`[cite: 2]  
**Fokus Perombakan:** Eliminasi Border, Konsistensi Bento Grid, Tipografi & Warna Apple Web, serta Efisiensi Alur Konversi[cite: 1, 2]

---

## 1. Audit Kritis Tampilan Saat Ini (Temuan Visual & Struktural)

1. **Navbar Membelah Banner Pembuka & Duplikasi Visual S26 Ultra:**
   - Pada tampilan atas, bilah navigasi putih memotong area judul hitam (`Galaxy S26 Ultra`) dengan gambar perangkat di bawahnya[cite: 1].
   - Aset `s26-ultra-campaign.jpg` yang sudah tampil besar di *billboard* pembuka diulang kembali dalam ukuran kecil pada seksi *Presisi Titanium* tepat di bawahnya[cite: 1, 2].
2. **Polusi Garis Tepi (*Border Pollution*):**
   - Hampir seluruh komponen dibungkus garis tepi (`border`), mulai dari 4 kartu spesifikasi kecil, tombol sekunder (`Pelajari Fitur`), ubin Bento Grid, hingga kartu produk pada *carousel*[cite: 1].
3. **Kelebihan Teks & Label (*Over-Badging*):**
   - Terlalu banyak elemen kapsul yang menumpuk dan merusak fokus visual: *floating glass badges* di sudut bawah poster utama (`Presisi Titanium • Sensor 200MP...` dan `✓ Garansi Resmi SEIN 1 Tahun`), label hijau di samping harga, tombol *toggle* di atas gambar produk (`Poster Resmi Samsung` / `Finis Titanium`), label biru di setiap kartu, serta teks *footer* kiri-kanan di bagian bawah tiap kartu Bento[cite: 1, 2].
4. **Bento Grid Tidak Seimbang (7 Sel dalam Grid 3 Kolom):**
   - Seksi *Mengapa Memilih Toko Resmi Kami?* menggunakan 1 kartu lebar (2 kolom untuk *Galaxy AI Terintegrasi*) dan 5 kartu kecil (masing-masing 1 kolom)[cite: 1, 2].
   - Total 7 unit sel pada sistem 3 kolom menyebabkan kartu ke-6 (*Program Trade-In Resmi*) menggantung sendirian di baris paling bawah dan menyisakan 2 kolom kosong di sebelah kanannya[cite: 1, 2].
5. **Proporsi Aset Produk Terlalu Kecil & Tidak Konsisten:**
   - Foto `watch-ultra.png` dan `buds3-pro.png` pada ubin kedua Bento Grid tampil sangat kecil di sudut kiri atas layaknya ikon, bukan visual pameran produk[cite: 1, 2].
   - Pada seksi *Rekomendasi Produk Resmi SEIN*, produk *Galaxy S26 Ultra 5G* dan *Galaxy Z Fold8 5G* masih menggunakan ilustrasi vektor datar (`s26-ultra-front.svg` dan `zfold8-front.svg`) yang terlihat kontras dibandingkan foto PNG studio produk lainnya[cite: 1, 2].

---

## 2. Standarisasi Warna, Tipografi & Elevasi (Apple Web System)

Ganti palet warna dan gaya batas komponen di `Home.jsx` dengan sistem desain Apple berikut[cite: 2]:

| Komponen UI | Implementasi Lama | Standar Baru (Apple Web) | Class Tailwind CSS |
| :--- | :--- | :--- | :--- |
| **Font Family** | Sans-serif bawaan | **SF Pro Display / Inter** | `font-sans antialiased tracking-tight` |
| **Latar Hitam Keynote** | `#07080B`[cite: 2] | **`#000000` (Pure Black)** | `bg-black text-[#F5F5F7]` |
| **Latar Seksi & Bento** | `#F8F9FA`[cite: 2] | **`#F5F5F7` (Apple Light Gray)** | `bg-[#F5F5F7]` |
| **Latar Kanvas Utama** | `#FFFFFF`[cite: 2] | **`#FFFFFF` (Pure White)** | `bg-white` |
| **Teks Judul Utama** | Hitam standar | **`#1D1D1F` (Apple Near-Black)** | `text-[#1D1D1F] font-semibold` |
| **Teks Deskripsi & Spek** | Abu-abu standar | **`#86868B` (Apple Muted Gray)** | `text-[#86868B] font-medium` |
| **Warna Aksi Utama (CTA)** | `#2189FF`[cite: 2] | **`#0071E3` (Apple Blue)** | `bg-[#0071E3] hover:bg-[#0077ED] text-white` |
| **Batas Kartu (Card Border)** | `border` & `shadow` tipis[cite: 1] | **Tanpa Border (0px)** | `border-0 shadow-none rounded-[28px]` |

---

## 3. Spesifikasi Perombakan Per Seksi (`Home.jsx`)

### A. Navigasi Utama (Sticky Header)
- Posisikan navigasi utama tetap di paling atas layar (`fixed top-0 inset-x-0 z-50 h-12 bg-white/80 backdrop-blur-md`) tanpa membelah antara judul *hero* dan gambar produk di bawahnya[cite: 1, 2].
- Pertahankan fitur *gliding pill* (`layoutId="navbarActivePill"`) dan *safe hover bridge* (`150ms`) pada Mega-Menu 3 kolom, namun hilangkan garis batas bawah (`border-b`) yang tebal[cite: 2].

### B. Panggung Utama Terpadu: Galaxy S26 Ultra (Hapus Duplikasi)
- **Satukan Seksi:** Gabungkan *Grand Opening Keynote Billboard* dengan seksi *Presisi Titanium* menjadi satu panggung vertikal utuh berlatar `#000000` agar poster `s26-ultra-campaign.jpg` tidak tampil dua kali[cite: 1, 2].
- **Hapus Elemen Pengganggu:**
  - Hapus *floating glass badges* (`Presisi Titanium • Sensor 200MP...` dan `✓ Garansi Resmi SEIN 1 Tahun`) dari atas gambar poster[cite: 1, 2].
  - Hapus tombol *toggle* `Poster Resmi Samsung` / `Finis Titanium` serta *badge* hijau di samping harga[cite: 1, 2].
- **Susunan Hierarki Baru (Rata Tengah):**
  1. Label kecil di atas judul: `Galaxy S26 Ultra` (`text-sm uppercase tracking-widest text-[#86868B]`)[cite: 1, 2].
  2. Headline utama: `Presisi Titanium. Era baru Galaxy AI.` (`text-5xl md:text-7xl font-semibold text-[#F5F5F7]`)[cite: 1, 2].
  3. Baris Harga & Aksi: `Mulai dari Rp 21.999.000` diikuti satu tombol kapsul biru `#0071E3` (`Beli`) yang mengarah ke `Buy.jsx` dan satu tautan teks bersih `Pelajari lebih lanjut ›` tanpa *border*[cite: 1, 2].
  4. Visual utama `s26-ultra-campaign.jpg` berukuran penuh dengan pemilih warna (*Interactive Swatch Selector*) di bawahnya[cite: 1, 2].
  5. **4 Metrik Tipografi Apple (Menggantikan 4 Kotak Ber-border):** Tampilkan 4 kolom angka besar tanpa kotak pembungkus[cite: 1, 2]:
     - **`6.9"`** — Layar Dynamic AMOLED 2X[cite: 1, 2]
     - **`200 MP`** — Kamera Quad-Telephoto[cite: 1, 2]
     - **`3 nm`** — Chipset Snapdragon 8 Elite[cite: 1, 2]
     - **`1 Tahun`** — Jaminan Resmi SEIN[cite: 1, 2]

### C. Panggung Kedua: Galaxy Z Fold8 (Centered Showcase)
- Ubah tata letak 2 kolom kiri-kanan menjadi panggung rata tengah (`text-center`) di atas latar `#F5F5F7` untuk menciptakan variasi ritme visual[cite: 1, 2].
- Tampilkan judul `Galaxy Z Fold8`, subjudul `Layar Lipat 8.0 Inci. Ultra Ramping.`, harga `Mulai dari Rp 27.999.000`, serta tombol `Beli` (`#0071E3`) dan tautan `Pelajari lebih lanjut ›` tanpa *border*[cite: 1, 2].
- Tempatkan visual `zfold8-campaign.jpg` berukuran besar di tengah (hapus tombol *toggle* di atas gambar), diikuti *swatch* warna (*Crafted Black* & *Silver Shadow*) dan 4 angka spesifikasi utama tanpa bingkai kotak[cite: 1, 2].

### D. Bento Grid Simetris 6 Kolom (Tanpa Celah Kosong)
- Gunakan kontainer `grid grid-cols-1 md:grid-cols-6 gap-6` di atas latar halaman `#FFFFFF`, di mana setiap kartu menggunakan latar `#F5F5F7`, sudut membulat `rounded-[28px]`, dan **tanpa `border`**[cite: 1, 2]:
  - **Baris 1 (Total 6 Kolom):**
    - **Ubin 1 (`md:col-span-4` — Galaxy AI Terintegrasi):** Padukan teks singkat `Circle to Search`, `Live Call Translate`, dan `Photo Assist` di sisi kiri dengan poster vertikal `galaxy-ai-banner.jpg` yang memenuhi ruang sisi kanan kartu[cite: 1, 2].
    - **Ubin 2 (`md:col-span-2` — Ekosistem Galaxy):** Tampilkan judul `Galaxy Watch Ultra & Buds3 Pro` di bagian atas dan perbesar ukuran gambar `watch-ultra.png` serta `buds3-pro.png` (`h-48 object-contain`) di bagian bawah kartu agar tidak terlihat kerdil[cite: 1, 2].
  - **Baris 2 (Total 6 Kolom — Padatkan 4 Kartu Layanan Menjadi 3 Kartu `md:col-span-2`):**
    - **Ubin 3 (`md:col-span-2` — Jaminan Resmi SEIN 1 Tahun):** Informasi garansi 100+ pusat servis nasional dan registrasi IMEI Kemenperin[cite: 1, 2].
    - **Ubin 4 (`md:col-span-2` — Ambil 2 Jam di SES & Pengiriman Asuransi 100%):** Gabungkan layanan pengambilan cepat di mal dengan pengiriman berasuransi penuh dalam satu kartu logistik premium[cite: 1, 2].
    - **Ubin 5 (`md:col-span-2` — Program Trade-In Resmi):** Informasi tukar tambah instan dengan potongan harga langsung[cite: 1, 2].
- **Pembersihan Teks di Dalam Kartu Bento:**
  - Hapus seluruh *badge* kapsul di bagian atas judul kartu[cite: 1].
  - Hapus teks *footer* kiri-kanan di bagian dasar setiap kartu (seperti `100% Jaminan Resmi` / `Lihat Detail`) agar kartu tampil bersih seperti Bento Grid Apple[cite: 1].

### E. Carousel Rekomendasi Produk Resmi SEIN
- Ganti berkas vektor `s26-ultra-front.svg` dan `zfold8-front.svg` dengan *render* produk PNG transparan beresolusi tinggi agar seragam dengan `galaxy-ring.png`, `watch-ultra.png`, `buds3-pro.png`, dan `tab-s10-ultra.png`[cite: 1, 2].
- Hapus `border` pada setiap kartu produk; gunakan latar `#F5F5F7` (`rounded-[28px] p-8`) di atas latar seksi `#FFFFFF`[cite: 1].
- Perbesar area gambar produk (`h-56 w-full object-contain mb-6`) dan hapus *badge* biru kecil di atas nama produk[cite: 1, 2].
- Sisakan hanya 4 informasi esensial di bagian bawah tiap kartu: Nama Produk (`#1D1D1F`), 1 baris ringkasan fitur (`#86868B`), Harga, dan tombol kapsul `Beli` (`#0071E3`)[cite: 1].

---

## 4. Alur Konversi Pengguna (Landing Page ke Buy Studio)

1. **Tahap Impresi (`Home.jsx`):** Pengguna disambut oleh visual sinematik berukuran besar, interaksi *swatch* warna secara langsung, dan ringkasan spesifikasi bergaya editorial tanpa gangguan *border* atau teks promosi berlebih[cite: 1, 2].
2. **Tahap Transisi Pembelian (`Buy.jsx`):** Seluruh konfigurasi mendalam (pilihan kapasitas penyimpanan, kalkulasi potongan *Trade-In*, opsi pengiriman atau pengambilan di *Samsung Experience Store*, serta rincian pembayaran) hanya dimuat setelah pengguna menekan tombol **`Beli`** pada produk yang diminati[cite: 1, 2].