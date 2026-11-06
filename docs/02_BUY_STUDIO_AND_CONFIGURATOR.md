# 📱 Dokumen Spesifikasi 02: Studio Pembelian & Konfigurator Interaktif (Buy Studio)

> **Modul:** `resources/js/Pages/Buy.jsx`  
> **Rute:** `GET /buy/{slug}` (Contoh: `/buy/samsung-galaxy-s26-ultra`, `/buy/samsung-galaxy-z-fold8`)  
> **Standar UI:** Apple Store Buy Page (Dua Kolom: Visual Sticky di Kiri & Konfigurasi Bertahap di Kanan)  

---

## 1. Konsep & Filosofi Studio Pembelian

Halaman Studio Pembelian (`Buy.jsx`) adalah pusat konfigurasi spesifikasi perangkat sebelum checkout. Mengadopsi prinsip antarmuka ritel Apple Store:
* **Fokus Penuh pada Produk:** Menghilangkan elemen navigasi yang tidak relevan agar perhatian konsumen terpusat pada pemilihan perangkat.
* **Transparansi Stok & Harga:** Setiap perubahan opsi (warna, kapasitas memori, metode penerimaan) langsung memperbarui tampilan harga total dan status ketersediaan unit secara *real-time*.
* **Bebas Form Membingungkan:** Formulir data pemesan dan metode bayar disatukan secara ringkas tanpa tahapan multi-langkah yang berbelit (*One-Page Configurator*).

---

## 2. Diagram Tata Letak Dua Kolom

```
+-----------------------------------------------------------------------------------+
|  HEADER MINIMALIS: [Logo Samsung] | Galaxy S26 Ultra 5G | Bantuan Layanan WhatsApp|
+-----------------------------------------+-----------------------------------------+
|  KOLOM KIRI: VISUAL STAGE STICKY        |  KOLOM KANAN: STEP-BY-STEP CONFIGURATOR |
|                                         |                                         |
|  [Toggle Sudut Pandang:                 |  LANGKAH 1: PILIH FINIS TITANIUM        |
|   Tampak Belakang | Layar Depan AMOLED] |  - Titanium Silver Shadow               |
|                                         |  - Titanium Phantom Black               |
|  [Render Perangkat Resolusi Tinggi      |  - Titanium Cobalt Violet               |
|   Finis Berubah Mengikuti Swatch]       |  - Titanium Amber Gold                  |
|                                         |                                         |
|  (Soft Floor Contact Shadow)            |  LANGKAH 2: PILIH KAPASITAS & RAM       |
|                                         |  - 256GB / 12GB RAM [Tersedia]          |
|  [Pill Spek: 6.9" 120Hz | 200MP Quad]   |  - 512GB / 12GB RAM (+Rp 3.000.000)     |
|                                         |  - 1TB / 16GB RAM (+Rp 8.000.000)       |
|                                         |                                         |
|                                         |  LANGKAH 3: METODE PENGAMBILAN UNIT     |
|                                         |  (•) Ambil di SES Mall (Siap 2 Jam)     |
|                                         |      Dropdown 8 Cabang Mall Terkemuka   |
|                                         |  ( ) Kirim ke Rumah (Kemasan Kayu SEIN) |
|                                         |      Form Alamat Lengkap & Kota         |
|                                         |                                         |
|                                         |  LANGKAH 4: DATA PEMESAN & PEMBAYARAN   |
|                                         |  - Nama Lengkap & Nomor WhatsApp Aktif  |
|                                         |  - Email (Pengiriman Faktur Digital)    |
|                                         |  - Pilihan Bayar: QRIS / Virtual Account|
+-----------------------------------------+-----------------------------------------+
|  PERSISTENT FLOATING BUY BAR (Fixed Bottom):                                      |
|  [Varian Terpilih: 512GB Cobalt Violet]  |  Total: Rp 24.999.000  |  [PESAN SEKARANG]|
+-----------------------------------------------------------------------------------+
```

---

## 3. Rincian Fitur & Mekanisme Interaksi

### A. Kolom Kiri: Panggung Visual Sticky (*Interactive Visual Stage*)
1. **Perilaku Sticky:** Kontainer gambar perangkat tetap mengapung (*sticky top-24*) di sisi kiri saat pengguna menggulir opsi di sisi kanan layar desktop.
2. **Toggle Sudut Pandang Ganda (*Dual-View Angle Selector*):**
   * *Tampak Belakang (Chassis):* Menampilkan tekstur material Titanium asli, pulau kamera melayang (*floating camera rings*), dan pantulan cahaya alami.
   * *Tampak Depan (Display):* Menampilkan layar Dynamic AMOLED 2X berbingkai simetris tipis dengan wallpaper resmi resolusi tinggi.
3. **Pembaruan Aset Real-Time:** Memilih salah satu swatch warna di kolom kanan secara otomatis mengubah aset gambar di kolom kiri dengan transisi halus tanpa flicker.
4. **Bayangan Lantai Kontak (*Contact Ground Shadow*):** Gradien bayangan lembut realistis di bawah ponsel untuk mempertegas dimensi fisik.

### B. Kolom Kanan: Alur Pemilihan Bertahap (*Step-by-Step Flow*)

#### 1. Langkah 1: Pemilihan Warna Finis Bodi
* Menampilkan lingkaran konsentris warna ganda dengan kode HEX akurat:
  * *Titanium Silver Shadow* (`#8c959e`)
  * *Titanium Phantom Black* (`#161719`)
  * *Titanium Cobalt Violet* (`#3b334a`)
  * *Titanium Amber Gold* (`#c8b590`)
* Setiap tombol warna menampilkan nama finis resmi Samsung dan indikator pilihan aktif bergaris ganda.

#### 2. Langkah 2: Pemilihan Kapasitas Memori & Penyimpanan
* Kartu pilihan memori dengan struktur perbandingan harga transparan:
  * `256GB / 12GB RAM` (Harga Dasar: Rp 21.999.000)
  * `512GB / 12GB RAM` (Tambahan +Rp 3.000.000: Rp 24.999.000)
  * `1TB / 16GB RAM` (Tambahan +Rp 8.000.000: Rp 29.999.000)
* **Indikator Stok Riil (Data Driven):**
  * `stock > 5`: Label hijau `"Tersedia di SES Mall & Gudang"`
  * `1 <= stock <= 5`: Label kuning `"Sisa [n] unit segera habis"`
  * `stock == 0`: Kartu otomatis terkunci (*disabled*) dengan label abu-abu `"Stok Habis"`

#### 3. Langkah 3: Pilihan Metode Pengambilan Unit
1. **Opsi 1: Ambil di Gerai SES Mall (In-Store Pickup, Bebas Biaya):**
   * Unit disiapkan dan siap diambil dalam 2 jam sejak pembayaran diverifikasi.
   * Dropdown 8 lokasi gerai resmi: Grand Indonesia, Central Park, Senayan City, Pondok Indah Mall 3, Kota Kasablanka, Paris Van Java Bandung, Tunjungan Plaza 6 Surabaya, Pakuwon Mall.
   * Menampilkan jam operasional gerai (10.00 - 21.00 WIB) dan instruksi penukaran faktur.
2. **Opsi 2: Pengiriman Khusus Berasuransi ke Rumah:**
   * Proteksi kotak kayu khusus dengan segel antiprusak resmi.
   * Asuransi pengiriman penuh 100% nilai barang.
   * Menampilkan kolom input: Nama Jalan & Nomor Rumah, RT/RW, Kecamatan, Kota/Kabupaten, Provinsi, Kode Pos.

#### 4. Langkah 4: Identitas Pemesan & Jalur Pembayaran
1. **Data Pelanggan:**
   * Nama Lengkap (Sesuai KTP untuk klaim garansi SEIN).
   * Nomor WhatsApp Aktif (Untuk konfirmasi status pemrosesan).
   * Email Valid (Wajib untuk pengiriman faktur resmi dan nomor pesanan).
2. **Pilihan Pembayaran Nasional:**
   * **QRIS Nasional:** QR code instan mendukung seluruh aplikasi perbankan digital (BCA, Mandiri, BRI, BNI) dan dompet digital (GoPay, OVO, Dana).
   * **Virtual Account Bank Otomatis:** Transfer akun virtual 24 jam dengan verifikasi otomatis.

### C. Persistent Floating Buy Bar (Bilah Pembelian Melayang)
* Berada tetap di bagian dasar layar (`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200`).
* Menampilkan ringkasan konfigurasi yang sedang dipilih:
  * Model & Finis Warna aktif
  * Kapasitas Memori terpilih
  * Total Nominal Tagihan resmi (Format Rupiah)
* Tombol CTA primer: `[Pesan Sekarang]` yang memicu validasi form dan mengirimkan data transaksi ke rute `POST /checkout`.

---

## 4. Keamanan & Validasi Sisi Klien

1. Tombol checkout dinonaktifkan jika stok varian terpilih bernilai 0.
2. Validasi format email menggunakan ekspresi reguler standar RFC 5322.
3. Validasi nomor telepon/WhatsApp minimal 10 digit numerik.
4. Nilai harga yang dikirim ke backend murni berupa `variant_id` (tidak pernah mengirimkan nominal harga angka bebas guna mencegah manipulasi sisi klien).
