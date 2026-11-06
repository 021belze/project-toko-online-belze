# 🛍️ Dokumen Spesifikasi 01: Halaman Depan & Etalase Penjelajahan (Homepage Discovery)

> **Modul:** `resources/js/Pages/Home.jsx` & Subkomponen  
> **Standar:** Apple Store Clean Typographic Mega-Menu & Samsung Campaign Showcase  
> **Tema Visual:** High-Key Clean White (`#FFFFFF`), Zero Glow Neon, Zero Em Dash  

---

## 1. Tujuan & Filosofi Desain

Halaman depan (`/`) difungsikan secara eksklusif sebagai panggung penjelajahan produk (*Discovery & Brand Authority Showcase*). Halaman ini memamerkan kredibilitas toko resmi Samsung Authorized Reseller dengan unit garansi resmi PT Samsung Electronics Indonesia (SEIN). 

Sesuai filosofi anti-slop, halaman depan tidak memuat formulir transaksi yang padat, melainkan membimbing pengguna memahami inovasi flagship sebelum diarahkan ke Studio Pembelian khusus (`/buy/{slug}`).

---

## 2. Anatomi Komponen Halaman Depan

```
+-----------------------------------------------------------------------------------+
|  NAVBAR UTAMA (Sticky Top h-14)                                                   |
|  [Logo Samsung]   [Store]  [Galaxy S]  [Galaxy Z]  [Layanan SEIN]   [Lacak] [Beli]|
+-----------------------------------------------------------------------------------+
|  [Tirai Apple Mega-Menu 3-Kolom Expandable saat Hover pada Nav Item]             |
+-----------------------------------------------------------------------------------+
|  HERO 1: SAMSUNG GALAXY S26 ULTRA 5G (Cinematic Split Landscape Poster)          |
|  - Sisi Kiri: Headline Editorial, Spek Kunci, Harga Resmi, Dual Action Pills      |
|  - Sisi Kanan: Visual Staging Multi-Sudut (Depan & Belakang) / Slot posterImage   |
+-----------------------------------------------------------------------------------+
|  HERO 2: SAMSUNG GALAXY Z FOLD8 5G (Panggung Teater Modern #F8F9FA)               |
|  - Visual Layar Lipat 8.0 Inci Terbuka & Tertutup dengan Slim Armor Hinge        |
+-----------------------------------------------------------------------------------+
|  APPLE-STYLE 2x3 ASYMMETRIC BENTO POSTER GRID                                     |
|  - Ubin 1 (Span 2): Galaxy AI Live Engine                                         |
|  - Ubin 2: Ekosistem Watch Ultra2 & Buds3 Pro                                     |
|  - Ubin 3: 100% Garansi Resmi SEIN 1 Tahun                                        |
|  - Ubin 4: Layanan Pengambilan Gerai SES Mall 2 Jam                               |
|  - Ubin 5: Pengiriman Berasuransi & Kemasan Kayu                                  |
|  - Ubin 6: Program Tukar Tambah / Trade-In Resmi                                  |
+-----------------------------------------------------------------------------------+
|  SAMSUNG-STYLE REKOMENDASI PRODUK HORIZONTAL CAROUSEL                             |
|  - Slider produk horizontal dengan bayangan refleksi cermin di bawah render       |
|  - Tombol kontrol panah lingkaran & indikator progres gulir                      |
+-----------------------------------------------------------------------------------+
|  RETAIL FOOTER RESMI (Jaringan SES, Pusat Bantuan, Ketentuan Garansi SEIN)        |
+-----------------------------------------------------------------------------------+
```

---

## 3. Spesifikasi Detail Masing-Masing Komponen

### A. Apple Clean Typographic Mega-Menu
1. **Trigger Area:** Hanya aktif ketika kursor memasuki teks menu di bagian tengah navbar (`Store`, `Galaxy S Series`, `Galaxy Z Series`, `Layanan & Garansi SEIN`).
2. **Safe Hover Bridge:** Timeout 150ms disematkan pada fungsi `onMouseLeave` agar panel tidak menutup seketika saat kursor berpindah dari baris navbar ke dalam panel tirai.
3. **Zona Netral:** Logo Samsung dan tombol kanan (`Lacak Pesanan`, `[Beli Sekarang]`) langsung memicu penutupan menu secara halus saat diarahkan kursor.
4. **Isi 3 Kolom:**
   * Kolom 1: *Jelajahi Model Flagship* (Tipografi display tebal `text-2xl font-bold`).
   * Kolom 2: *Akses & Konfigurasi Cepat* (Kategori model, pilihan finis bodi, memori).
   * Kolom 3: *Keunggulan & Layanan Resmi* (Jaminan SEIN, trade-in, pengambilan SES mall).
5. **Aksi Cepat Kanan (Search, Cart, User):**
   * Tiga ikon aksi terpadu dengan efek kapsul bergulir (*rolling hover pill* berbasis `layoutId="rightNavHoverPill"` dan fisika pegas `stiffness: 350, damping: 30`).
   * **Search:** Membuka modal pencarian instan dengan penelusuran produk *real-time*.
   * **Cart:** Menampilkan flyout keranjang belanja dengan ringkasan status belanja dan penawaran flagship.
   * **User Profile & Dropdown:** Menampilkan menu melayang saat di-*hover* dengan opsi **Login / Masuk** (membuka modal autentikasi Samsung/Galax) dan **Lacak Pesanan** (navigasi langsung ke `/track`), dilengkapi efek kapsul bergulir (*rolling pill*) di dalam opsi menu.
6. **Backdrop Dimming Overlay:** Lapisan transparan gelap `bg-black/25 backdrop-blur-xs` meredupkan konten halaman di bawah navbar dengan durasi transisi 200ms.

### B. Cinematic Campaign Poster Hero Banners
1. **Format Rasio Widescreen (Split Landscape):**
   * **Kolom Kiri (~55%):** Tipografi display besar, subheadline filosofis, deskripsi keunggulan hardware (3nm Snapdragon 8 Elite, 200MP Quad-Telephoto, S-Pen), kepastian harga resmi mulai Rp 21.999.000, serta sepasang tombol aksi: `[Beli Sekarang]` (Biru aksen `#2189FF`) dan `[Pelajari Fitur]` (Glass neutral).
   * **Kolom Kanan (~45%):** Panggung visual multi-sudut perangkat beresolusi tinggi, bayangan kontak lantai alami (*soft ground contact shadow*), dan swatch pemilih finis titanium interaktif.
2. **Wadah Modular Poster (`posterImage`):** Komponen menyediakan prop khusus sehingga jika pengguna memasukkan file poster kampanye kustom, wadah langsung memuat gambar tersebut secara proporsional tanpa pergeseran tata letak (*zero layout shift*).
3. **Hero 2 (Galaxy Z Fold8):** Menerapkan format panggung teater dengan latar `#F8F9FA`, menampilkan form-factor lipat 8.0 inci terbuka dan tertutup ramping dengan Slim Armor Hinge.

### C. Apple-Style 2x3 Asymmetric Bento Poster Grid
1. **Ubin 1 (Hero Bento Span 2 Kolom):** *Galaxy AI Live Engine* (Circle to Search, Live Translate, Photo Assist).
2. **Ubin 2:** *Ekosistem Galaxy Watch Ultra2 & Buds3 Pro* (Integrasi pemantauan kebugaran dan audio 24-bit).
3. **Ubin 3:** *100% Garansi Resmi SEIN 1 Tahun* (Perlindungan suku cadang asli di 100+ Samsung Service Center).
4. **Ubin 4:** *Ambil di Gerai SES Mall dalam 2 Jam* (Pilihan 8 gerai mall besar bebas antre).
5. **Ubin 5:** *Pengiriman Khusus Kemasan Kayu & Asuransi 100%* (Segel resmi hingga ke alamat tujuan).
6. **Ubin 6:** *Program Trade-In Resmi* (Tukar tambah smartphone lama dengan potongan langsung).

### D. Samsung-Style Rekomendasi Horizontal Carousel
1. **Mekanisme Gulir:** Menggunakan CSS `scroll-snap-x mandatory` untuk transisi kartu yang terkunci rapi pada tiap geseran.
2. **Kontrol Interaktif:** Tombol lingkaran panah kiri (`<`) dan kanan (`>`) di sudut atas dengan deteksi otomatis status nonaktif saat berada di batas awal atau akhir guliran.
3. **Efek Refleksi Cermin Khas Samsung:** Gambar render setiap produk memiliki refleksi bayangan terbalik di bawahnya (`scale-y-[-1] opacity-20 mask-image:linear-gradient`) untuk menghadirkan kesan lantai kaca toko ritel premium.

---

## 4. Parameter Data & Props Komponen

Komponen `Home.jsx` menerima props dari Laravel Inertia:
* `models` (Array): Daftar lini model flagship (`samsung-galaxy-s26-ultra`, `samsung-galaxy-z-fold8`) beserta spesifikasi kunci, harga mulai, gambar hero, dan tautan pembelian.
* `appName` (String): Nama resmi toko berlisensi dari konfigurasi aplikasi.
