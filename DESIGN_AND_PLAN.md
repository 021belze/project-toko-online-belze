# 🏛️ Cetak Biru Arsitektur & Desain Toko Online Samsung Flagship (Clean White Retail)

> **Status Proyek:** Fase Implementasi & Redesign Storefront Lanjutan  
> **Lisensi Toko:** Samsung Authorized Reseller (Unit Resmi Garansi PT Samsung Electronics Indonesia / SEIN)  
> **Tema Desain:** High-Key Clean White (`#FFFFFF`), Zero Glow Neon, Zero Em Dash, Apple Spring Physics  

---

## 🧭 1. Indeks Dokumen Spesifikasi Modular

Untuk memastikan setiap bagian sistem terdokumentasi secara presisi dan mendalam, cetak biru proyek ini dibagi menjadi 5 dokumen spesifikasi modular:

| Modul Spesifikasi | Dokumen Markdown | Fokus & Cakupan Sistem |
| :--- | :--- | :--- |
| **01. Etalase Depan (Discovery)** | [docs/01_HOMEPAGE_AND_DISCOVERY.md](file:///c:/laragon/www/Project-toko-online/docs/01_HOMEPAGE_AND_DISCOVERY.md) | Apple Typographic Mega-Menu 3-kolom, Hero Poster Split Landscape S26 & Fold8, 2x3 Bento Grid, Carousel Rekomendasi, dan Retail Footer resmi. |
| **02. Studio Pembelian (Configurator)** | [docs/02_BUY_STUDIO_AND_CONFIGURATOR.md](file:///c:/laragon/www/Project-toko-online/docs/02_BUY_STUDIO_AND_CONFIGURATOR.md) | Studio konfigurasi 2-kolom, visual stage toggle sudut pandang ganda, swatch warna dinamis, matriks RAM/Storage, kalkulasi harga real-time, dan in-store pickup SES Mall 2 jam. |
| **03. Transaksi & Pelacakan** | [docs/03_CHECKOUT_TRANSACTION_AND_TRACKING.md](file:///c:/laragon/www/Project-toko-online/docs/03_CHECKOUT_TRANSACTION_AND_TRACKING.md) | Endpoint `POST /checkout`, validasi server-side mutlak, DB transaction dengan `lockForUpdate()`, 3 digit kode unik, notifikasi Gmail SMTP faktur resmi, dan tracking publik. |
| **04. Database & Seeder Master** | [docs/04_DATABASE_MODELS_AND_SEEDERS.md](file:///c:/laragon/www/Project-toko-online/docs/04_DATABASE_MODELS_AND_SEEDERS.md) | ERD, skema tabel `products`, `product_variants`, `orders`, relasi Eloquent, dan matriks 16 SKU seeder (12 varian S26 Ultra + 4 varian Z Fold8). |
| **05. Sistem Animasi & Anti-Slop** | [docs/05_REACT_ANIMATION_AND_STYLE_SYSTEM.md](file:///c:/laragon/www/Project-toko-online/docs/05_REACT_ANIMATION_AND_STYLE_SYSTEM.md) | Konfigurasi fisika pegas Apple (`motion`), gliding pill `layoutId`, `AnimatePresence`, token Tailwind CSS v4, serta checklist kepatuhan anti-slop. |
| **Cetak Biru Redesign Layout** | [REDESIGN_LAYOUT_AND_ANIMATION_PLAN.md](file:///c:/laragon/www/Project-toko-online/REDESIGN_LAYOUT_AND_ANIMATION_PLAN.md) | Panduan langkah teknis perombakan antarmuka beranda pasca-evaluasi kritis arsitektur. |

---

## 🌐 2. Diagram Alur Pengguna (User Flow) Dua Tingkat

```
+-----------------------------------------------------------------------------------+
|  1. ETALASE PENJELAJAHAN: GET /                                                   |
|     - Menjelajahi spesifikasi flagship via Mega-Menu & Poster Kampanye            |
|     - Melihat ubin inovasi Galaxy AI & Rekomendasi Produk Ekosistem               |
|     - Mengklik tombol [Beli Sekarang] pada model pilihan                          |
+-----------------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------------+
|  2. STUDIO PEMBELIAN: GET /buy/{slug}                                             |
|     - Memilih finis warna (Visual chassis & display berubah secara dinamis)       |
|     - Memilih kapasitas RAM & Memori Penyimpanan (Stok dicek secara real-time)    |
|     - Memilih metode pengambilan (Ambil di 8 Gerai SES Mall vs Kirim Paket Kayu)  |
|     - Mengisi data pembeli & memilih metode bayar (QRIS / Virtual Account)        |
|     - Menekan tombol [Pesan Sekarang] pada Floating Buy Bar                       |
+-----------------------------------------------------------------------------------+
                                       │
                                       ▼ (POST /checkout dengan Database Lock)
+-----------------------------------------------------------------------------------+
|  3. FAKTUR PEMBAYARAN RESMI: GET /invoice/{order_code}                            |
|     - Menampilkan total tagihan dengan 3 digit kode unik transfer                 |
|     - Menampilkan QRIS dinamis & nomor Virtual Account bank                       |
|     - Menampilkan instruksi pengambilan gerai SES atau nomor resi pengiriman      |
|     - Email faktur digital otomatis dikirim via Gmail SMTP                        |
+-----------------------------------------------------------------------------------+
                                       │
                                       ▼ (Kapan saja pembeli ingin memeriksa)
+-----------------------------------------------------------------------------------+
|  4. PELACAKAN STATUS PESANAN: GET /track                                          |
|     - Pencarian menggunakan Kode Pesanan + Nomor WhatsApp/Email                  |
|     - Linimasa status: Dibuat -> Terverifikasi -> Disiapkan SEIN -> Siap Diambil  |
|     - Menampilkan nomor IMEI legal terdaftar di Kemenperin                        |
+-----------------------------------------------------------------------------------+
```

---

## 🎨 3. Standar Estetika & Identitas Visual

1. **Latar Belakang High-Key Clean White (`#FFFFFF`):**
   * Memberikan kesan legitimasi retail berkelas tinggi untuk produk seharga puluhan juta rupiah.
   * Menolak latar belakang gelap bernuansa neon cyberpunk atau portofolio gelap yang tidak mencerminkan situs komersial resmi.
2. **Palet Biru Resmi Samsung:**
   * Biru Utama Korporat: `#1428A0` (Logo Samsung, badge resmi SEIN).
   * Biru Aksi Pembelian: `#2189FF` (Tombol [Beli Sekarang], link aktif).
3. **Panggung Visual Bebas Pendaran (*Zero Glow*):**
   * Perangkat gadget berdiri di atas lantai bersih dengan bayangan kontak realistis (*soft radial ground contact shadow*).
4. **Copywriting Bersih Tanpa Em Dash:**
   * Menghilangkan tanda pisah panjang em dash (`—`) dalam seluruh bahasa promosi dan dokumen teknis. Menggunakan bahasa Indonesia yang ringkas, berwibawa, dan lugas.

---

## 🛡️ 4. Integritas Data & Keamanan Backend

1. **Kalkulasi Server-Side Mutlak:** Nilai harga tidak pernah diterima dari browser. Backend mencocokkan `variant_id` dengan database master untuk menjamin keaslian nominal.
2. **Pencegahan Race Condition:** Pengurangan stok dilakukan di dalam transaksi database menggunakan `lockForUpdate()` untuk mencegah overselling.
3. **Proteksi Anti-Spam:** Middleware `throttle:5,1` membatasi pengiriman formulir pesanan maksimal 5 kali per menit per alamat IP.

---

## 🔗 Keterkaitan Obsidian Second Brain
Seluruh rencana ini disinkronkan ke dalam vault Obsidian:
* `[[README-Toko-Online]]`
* `[[Desain-Dan-Arsitektur-Storefront]]`
* `[[Rencana-Redesign-Storefront-Poster-Layout]]`
* `[[Arsitektur-Backend]]`
* `[[Model-Dan-Database]]`
* `[[API-Dan-Routing]]`
