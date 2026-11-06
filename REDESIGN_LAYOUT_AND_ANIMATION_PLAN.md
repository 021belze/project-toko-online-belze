# 🏛️ Cetak Biru Revisi Redesign Layout & Arsitektur Animasi React (Apple Store & Samsung Style)

> **Status Dokumen:** Revisi Pasca-Evaluasi Kritis (Mengintegrasikan masukan arsitektur UI/UX Apple & Samsung)  
> **Target Implementasi:** `resources/js/Pages/Home.jsx` & Ekosistem Komponen Storefront  
> **Prinsip Utama:** Anti-Slop, High-Key Clean White (`#FFFFFF`), Zero Em Dash, Tipografi Presisi, Fisika Pegas Alami (*Spring Physics*).

---

## 🧭 1. Ringkasan Perubahan & Hasil Audit Kritis

Berdasarkan evaluasi kritis terhadap prototipe sebelumnya, ditemukan beberapa gap fungsional dan estetika yang kini diperbaiki secara menyeluruh dalam cetak biru revisi ini:

| Komponen | Masalah pada Versi Lama | Solusi Arsitektur Baru (Revisi) |
| :--- | :--- | :--- |
| **Navbar Hover** | `onMouseEnter` pada seluruh `<header>` membuka menu saat mouse mengarah ke logo atau tombol CTA. | **Per-Item Trigger + Safe Hover Bridge:** Hover hanya aktif pada tombol navigasi tengah. Dilengkapi timeout toleransi 150ms agar menu tidak berkedip (*flicker-free*). |
| **Animasi Mega-Menu** | Menggunakan trik CSS `max-h-96 transition-all` yang kaku dan rentan *clipping*. | **Framer Motion (`motion`):** `AnimatePresence` dengan fisika pegas Apple (`stiffness: 280, damping: 24`) untuk ekspansi tinggi yang elastis dan organik. |
| **Hero Section** | Layout *stacked* generik (Teks atas, tombol tengah, gambar produk bawah). | **Cinematic Split Landscape (Rasio Widescreen):** Kolom kiri untuk tipografi editorial megah dan spek; kolom kanan untuk panggung visual multi-sudut perangkat. |
| **Slot Gambar** | Gambar statis di bagian bawah tanpa wadah modular. | **Modular Asset Stage (`poster_image`):** Wadah fleksibel yang siap menerima gambar poster kampanye kustom dari pengguna tanpa merusak struktur layout. |
| **Grid Fitur** | Grid 2x2 simetris dengan kartu seragam (kurang hierarki visual). | **Apple 2x3 Asymmetric Bento Grid:** 6 kartu ubin promosi dengan kartu unggulan *Galaxy AI Engine* berskala besar (`col-span-2`), lencana garansi, dan simulasi pengambilan gerai. |
| **Carousel Produk** | Belum ada slider horizontal rekomendasi. | **Samsung-Style Rekomendasi Carousel:** Slider horizontal dengan kontrol navigasi lingkaran, indikator progres, dan efek bayangan refleksi cermin (*mirror floor reflection*). |
| **Backdrop Dimming** | Belum ada isolasi visual saat menu terbuka. | **Dynamic Backdrop Dimming:** Lapisan `bg-black/25 backdrop-blur-xs` dengan animasi *fade* 200ms saat mega-menu aktif. |

---

## 📐 2. Anatomi Revisi Apple Clean Typographic Mega-Menu

### A. State & Logika Interaksi Anti-Flicker (React)
Mega-menu tidak lagi diikat pada seluruh bar navigasi, melainkan dikendalikan secara presisi melalui state menu aktif dan penundaan penutupan:

```javascript
// State kontrol per-item navigasi
const [activeMenuId, setActiveMenuId] = useState(null); // 'store' | 's-series' | 'z-series' | 'services' | null
const closeTimeoutRef = useRef(null);

const handleMenuEnter = (menuId) => {
    if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
    }
    setActiveMenuId(menuId);
};

const handleMenuLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
        setActiveMenuId(null);
    }, 150); // Safe hover bridge delay
};
```

### B. Baris Header Utama (Sticky Top h-14)
* **Kiri (Netral / Non-Trigger):** Logo `SAMSUNG` biru `#1428A0` dengan lencana `Authorized Reseller`. Hover pada logo akan memicu `handleMenuLeave()` instan agar menu menutup.
* **Tengah (Trigger Area Terisolasi):**
  1. `Store` / `Shop` (Master Katalog & Layanan Cepat)
  2. `Galaxy S Series` (Lini Flagship Titanium)
  3. `Galaxy Z Series` (Lini Layar Lipat Fold & Flip)
  4. `Layanan & Garansi SEIN` (Jaringan Service Center & Verifikasi IMEI)
  * Setiap tombol memiliki `onMouseEnter={() => handleMenuEnter(id)}` dan indikator pil meluncur `layoutId="navbarActivePill"`.
* **Kanan (Aksi Langsung / Non-Trigger):**
  * Tautan teks `Lacak Pesanan` (navigasi langsung ke `/track`).
  * Tombol pil primer `[Beli Sekarang]` warna biru aksi `#2189FF` (menuju `/buy/samsung-galaxy-s26-ultra`).

### C. Konten 3 Kolom Mega-Menu Saat Mode Expand

#### 1. Panel `Store` (Master Hub)
* **Kolom 1: Jelajahi Flagship (Display Font Tebal text-2xl):**
  * Galaxy S26 Ultra 5G
  * Galaxy Z Fold8 5G
  * Galaxy Watch Ultra2
  * Galaxy Buds3 Pro
  * Aksesoris & S-Pen Original
* **Kolom 2: Tautan Cepat (Navigasi Utilitas text-xs uppercase tracking-wider):**
  * Ambil di Gerai SES Mall (Siap dalam 2 Jam)
  * Lacak Status Pesanan & Nomor IMEI
  * Garansi Resmi SEIN 1 Tahun
  * Simulasi Program Trade-In (Tukar Tambah)
  * Lokasi 100+ Samsung Service Center
* **Kolom 3: Layanan Khusus Retail:**
  * Kemasan Khusus Kotak Kayu & Asuransi 100%
  * Samsung Care+ Protection
  * Konsultasi Spesifikasi Perangkat
  * Verifikasi Legalitas IMEI Kemenperin

#### 2. Panel `Galaxy S Series`
* **Kolom 1 (Jajaran Model):** Galaxy S26 Ultra 5G, Galaxy S26+ 5G, Galaxy S26 5G, Bandingkan Semua Model S-Series.
* **Kolom 2 (Konfigurasi & Pilihan Finis):** Titanium Silver Shadow, Titanium Phantom Black, Titanium Cobalt Violet, Titanium Amber Gold. Kapasitas 256GB / 512GB / 1TB.
* **Kolom 3 (Sorotan Fitur):** Prosesor Snapdragon 8 Elite 3nm, Sensor 200MP Quad-Telephoto, Stylus S-Pen Terintegrasi.

#### 3. Panel `Galaxy Z Series`
* **Kolom 1 (Jajaran Model):** Galaxy Z Fold8 5G, Galaxy Z Flip8 5G, Bandingkan Form Factor Lipat.
* **Kolom 2 (Konfigurasi & Pilihan Finis):** Crafted Black, Silver Shadow. Memori hingga 1TB.
* **Kolom 3 (Sorotan Fitur):** Layar Lipat Utama 8.0 Inci Dynamic AMOLED 2X, Slim Armor Hinge Tertipis, Flex Mode Multitasking.

#### 4. Panel `Layanan & Garansi SEIN`
* **Kolom 1 (Jaminan Unit Resmi):** 100% Unit Garansi PT Samsung Electronics Indonesia, Bebas Klaim di 100+ Samsung Service Center Nasional.
* **Kolom 2 (Gerai Pengambilan SES Mall):** Grand Indonesia, Central Park, Senayan City, PIM 3, Kota Kasablanka, PVJ Bandung, TP6 Surabaya, Pakuwon Mall.
* **Kolom 3 (Bantuan Konsumen):** Pusat Bantuan WhatsApp Resmi, Verifikasi Faktur Digital, Ketentuan Garansi Unit Baru.

---

## 🎬 3. Tata Letak Cinematic Campaign Poster Hero Banners

Menggantikan tata letak teks bertumpuk (*stacked*) dengan komposisi **Editorial Split Landscape (Widescreen 16:9 / 21:9 Visual Staging)**:

```
+-----------------------------------------------------------------------------------+
|  [Eyebrow: LINI FLAGSHIP RESMI 2026]                                              |
|                                                                                   |
|  Galaxy S26 Ultra                       [ VISUAL STAGING PANGGUNG ]              |
|  Titanium. Presisi Tanpa Kompromi.                                                |
|                                         Unit Tampak Depan    Unit Tampak Belakang |
|  Prosesor 3nm Snapdragon 8 Elite,       (AMOLED 120Hz)       (Titanium Finis)     |
|  kamera 200MP Quad-Telephoto, dan                                                 |
|  S-Pen terintegrasi langsung di bodi.                                             |
|                                         +---------------------------------------+ |
|  Mulai dari Rp 21.999.000               | [Slot Modular: posterImage]           | |
|  (Garansi Resmi SEIN 1 Tahun)           +---------------------------------------+ |
|                                                                                   |
|  [Beli Sekarang]  [Pelajari Fitur]           (Soft Floor Contact Shadow)          |
|                                                                                   |
|  [6.9" Dynamic AMOLED] [Snapdragon 8 Elite] [200MP Quad-Tele] [Garansi Resmi SEIN]|
+-----------------------------------------------------------------------------------+
```

### A. Komposisi Hero 1: Samsung Galaxy S26 Ultra 5G
1. **Sisi Kiri (Editorial Information & Badges, ~55% Widescreen Grid):**
   * **Kapsul Status:** Lencana halus berlatar biru lembut `#EBF3FF` dengan teks biru tua `#1428A0` (*LINI FLAGSHIP RESMI 2026*).
   * **Headline Display:** `Galaxy S26 Ultra` berukuran ekstra besar (`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-950`).
   * **Subheadline Filosofis:** `Titanium. Presisi Tanpa Kompromi.`
   * **Deskripsi Singkat Faktual:** Menjabarkan keunggulan komputasi 3nm, sensor kamera 200MP, dan integrasi pena digital S-Pen.
   * **Keterangan Harga & Legalitas:** Penegasan harga mulai dari Rp 21.999.000 dengan garansi resmi SEIN 1 tahun.
   * **Sepasang Tombol Aksi (Dual Pill Buttons):**
     * Tombol Utama: `[Beli Sekarang]` warna biru Samsung `#2189FF` dengan hover `#1a70d4` menuju `/buy/samsung-galaxy-s26-ultra`.
     * Tombol Sekunder: `[Pelajari Fitur]` gaya *neutral glass border* dengan navigasi gulir halus.
   * **Deret Ringkasan Spek Kunci:** 4 ubin spesifikasi mini horizontal (Layar, Chipset, Kamera, Legalitas SEIN).

2. **Sisi Kanan (Visual Staging & Modular Poster Slot, ~45% Widescreen Grid):**
   * **Staging Multi-Sudut:** Tampilan dua perangkat beresolusi tinggi (unit tampak depan berdampingan dengan unit tampak belakang warna Titanium Cobalt Violet).
   * **Wadah Modular Poster (`posterImage`):** Komponen disiapkan menerima prop gambar kustom dari pengguna. Bila gambar kustom dipasang, ia akan mengisi wadah ini secara otomatis tanpa pergeseran tata letak.
   * **Bayangan Lantai Alami (*Ground Contact Shadow*):** Gradien radial lembut di bawah unit untuk memberikan bobot fisik nyata.
   * **Palet Finis Titanium Interaktif:** 4 lingkaran finis warna asli Samsung (Silver Shadow, Phantom Black, Cobalt Violet, Amber Gold).

### B. Komposisi Hero 2: Samsung Galaxy Z Fold8 5G
* Format editorial panggung teater dengan latar abu-abu netral `#F8F9FA`.
* **Headline:** `Galaxy Z Fold8`
* **Subheadline:** `Layar Lipat 8.0 Inci. Multitasking Tanpa Batas.`
* **Visual Staging:** Memperlihatkan form-factor lipat terbuka penuh 8.0 inci bersanding dengan tampilan tertutup ramping yang menonjolkan Slim Armor Hinge.

---

## 🗂️ 4. Apple-Style 2x3 Asymmetric Promotional Bento Grid

Menggantikan grid 2x2 yang seragam dengan **6 Ubin Promosi Bento Asimetris** berstandar retail Apple:

```
+-------------------------------------------------------+---------------------------+
| UBIN 1 (HERO BENTO - SPAN 2 KOLOM)                    | UBIN 2                    |
| Galaxy AI Live Engine Terintegrasi                    | Ekosistem Galaxy Watch    |
| Circle to Search, Live Translate, dan Photo Assist    | Ultra2 & Galaxy Buds3 Pro |
| komputasi lokal aman tanpa hambatan.                  |                           |
|                                                       | [Lihat Ekosistem]         |
+---------------------------+---------------------------+---------------------------+
| UBIN 3                    | UBIN 4                    | UBIN 5                    |
| 100% Garansi Resmi SEIN   | Ambil di Gerai SES Mall   | Pengiriman Khusus Kayu    |
| Perlindungan suku cadang  | Siap diambil dalam 2 jam  | Kemasan proteksi ganda &  |
| di 100+ Samsung Service   | di Grand Indonesia, PIM,  | asuransi 100% nilai       |
| Center seluruh Indonesia. | Senayan City, dll.        | barang ke seluruh RI.     |
+---------------------------+---------------------------+---------------------------+
| UBIN 6 (SPAN PENUH ATAU FITUR KHUSUS)                                             |
| Program Trade-In Resmi: Tukar tambah smartphone lama dengan potongan instan       |
+-----------------------------------------------------------------------------------+
```

### Rincian 6 Ubin Promosi Bento:
1. **Ubin 1 (Hero Bento, Lebar Ganda `col-span-1 md:col-span-2`):**
   * **Judul:** `Galaxy AI Live Engine Terintegrasi`
   * **Fungsi:** Menampilkan kemampuan komputasi kecerdasan buatan terdepan (Circle to Search, Live Call Translate bahasa Indonesia, dan Photo Assist generatif).
   * **Visual:** Lencana komputasi AI dengan chip grafis interaktif dan indikator status *Fitur Standar Resmi*.
2. **Ubin 2: Ekosistem Galaxy Watch Ultra2 & Buds3 Pro**
   * **Judul:** `Performa Ekosistem Tanpa Celah`
   * **Fungsi:** Integrasi pemantauan kesehatan presisi tinggi dan audio fidelitas 24-bit.
3. **Ubin 3: 100% Garansi Resmi SEIN 1 Tahun**
   * **Judul:** `Jaminan Resmi PT Samsung Electronics Indonesia`
   * **Fungsi:** Perlindungan servis resmi, nomor IMEI terdaftar di database Kemenperin, bebas klaim di 100+ Samsung Service Center nasional.
4. **Ubin 4: Layanan Ambil di Gerai SES Mall (In-Store Pickup)**
   * **Judul:** `Siap Diambil dalam 2 Jam di Mall Favorit`
   * **Fungsi:** Pesan online, unit diverifikasi dan disiapkan di gerai Samsung Experience Store (Grand Indonesia, Central Park, Senayan City, PIM 3, Kota Kasablanka, PVJ Bandung, TP6 Surabaya).
5. **Ubin 5: Pengiriman Berasuransi & Kemasan Kayu Khusus**
   * **Judul:** `Proteksi Fisik 100% Nilai Barang`
   * **Fungsi:** Kemasan kayu pelindung dengan segel antiprusak pabrik untuk pengiriman ke seluruh kota di Indonesia.
6. **Ubin 6: Program Trade-In Resmi Samsung**
   * **Judul:** `Tukar Tambah Unit Lama Anda`
   * **Fungsi:** Penilaian kondisi transparan dan potongan harga langsung untuk pembelian seri Galaxy S26 atau Z Fold8.

* **Spesifikasi Gaya:** Sudut lengkung 28px (`rounded-3xl`), latar belakang abu-abu premium `#F8F9FA`, garis tepi halus `border border-gray-200/70`, bebas dari efek neon atau hover berlebihan.

---

## 🎠 5. Samsung-Style Rekomendasi Produk Horizontal Carousel

Menambahkan komponen slider interaktif produk flagship sesuai standar antarmuka `samsung.com/id`:

### A. Karakteristik & Fitur Slider
* **Judul Seksi:** `Rekomendasi Produk Flagship & Ekosistem`
* **Subjudul:** `Pilihan perangkat unggulan bergaransi resmi SEIN untuk melengkapi produktivitas dan gaya hidup Anda.`
* **Kontrol Navigasi:**
  * Tombol navigasi lingkaran di sudut kanan atas: Panah Kiri (`<`) dan Panah Kanan (`>`) dengan status disabled cerdas ketika berada di ujung guliran.
  * Baris indikator progres guliran (*scroll progress indicator bar*) di bawah kartu yang merefleksikan posisi gulir saat ini.
  * Mendukung gulir sentuh (*touch swipe*) pada perangkat seluler dan guliran roda mouse horizontal pada desktop (`scroll-snap-x mandatory`).

### B. Efek Bayangan Refleksi Cermin (*Mirror Floor Reflection Shadow*)
Setiap kartu produk menampilkan efek refleksi cermin di bawah gambar render perangkat:
```jsx
{/* Wadah Render Perangkat Utama */}
<div className="relative h-56 flex items-center justify-center">
    <img
        src={product.image}
        alt={product.name}
        className="h-44 object-contain z-10 drop-shadow-md"
    />
    {/* Efek Refleksi Cermin Khas Samsung Retail */}
    <div className="absolute top-[82%] w-full h-16 overflow-hidden pointer-events-none opacity-20 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.5),transparent)]">
        <img
            src={product.image}
            alt=""
            className="h-44 object-contain scale-y-[-1] mx-auto filter blur-[0.5px]"
        />
    </div>
</div>
```

### C. Daftar Produk dalam Carousel
1. **Galaxy S26 Ultra 5G** (Titanium Cobalt Violet - Rp 21.999.000)
2. **Galaxy Z Fold8 5G** (Crafted Black - Rp 26.999.000)
3. **Galaxy Watch Ultra2** (Titanium Gray - Rp 9.999.000)
4. **Galaxy Buds3 Pro** (Silver Shadow - Rp 3.299.000)
5. **Samsung 45W Power Adapter Original** (Super Fast Charging 2.0 - Rp 499.000)

---

## ⚡ 6. Arsitektur Animasi React: Integrasi Pustaka `motion`

### A. Mengapa Menggunakan `motion` (Framer Motion v12)?
Menghilangkan seluruh batasan transisi CSS kaku (`max-h-96`) dan menggantinya dengan perhitungan matematis pegas alami:

1. **Konfigurasi Fisika Pegas Apple (Spring Physics):**
   ```javascript
   export const appleSpring = {
       type: 'spring',
       stiffness: 280,
       damping: 24,
       mass: 0.8,
   };
   ```
2. **Ekspansi Menu Dinamis (`AnimatePresence`):**
   Tirai mega-menu dapat mengembang dan menyusut sesuai ukuran konten internal secara mulus tanpa pemotongan tinggi (*clipping*).
3. **Gliding Nav Pill (`layoutId`):**
   Pil latar belakang abu-abu halus meluncur secara magnetis saat pengguna memindahkan fokus antar tombol navbar.
4. **Staggered Link Flow:**
   Tautan teks pada ketiga kolom mega-menu mengalir turun dengan jeda 30ms secara berurutan, memberikan kesan antarmuka berbobot dan mewah.
5. **Backdrop Dimming Overlay:**
   Lapisan peredup halaman belakang bertransisi *fade* dengan halus:
   ```jsx
   <AnimatePresence>
       {activeMenuId && (
           <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.2 }}
               onClick={() => setActiveMenuId(null)}
               className="fixed inset-0 top-14 bg-black/25 backdrop-blur-xs z-40"
           />
       )}
   </AnimatePresence>
   ```

---

## 📋 7. Matriks Eksekusi Bertahap

Langkah pengerjaan yang disepakati untuk diterapkan pada kode:

```
[Tahap 1: Setup Dependensi]
    └── Pasang package resmi: `npm i motion`

[Tahap 2: Refactor Navbar & Mega-Menu di Home.jsx]
    ├── Terapkan per-item hover trigger + timeout safe hover bridge (150ms)
    ├── Pasang sliding pill indicator `layoutId="navbarActivePill"`
    ├── Integrasikan AnimatePresence untuk ekspansi elastis panel mega-menu 3 kolom
    └── Pasang lapisan pengabur redup (backdrop dimming overlay)

[Tahap 3: Refactor Hero Section Menjadi Cinematic Poster]
    ├── Ubah layout bertumpuk menjadi Editorial Split Landscape (55% teks / 45% visual)
    ├── Pasang wadah modular `posterImage` untuk aset poster kampanye kustom
    ├── Terapkan bayangan kontak lantai realistis dan palet finis warna interaktif
    └── Terapkan struktur yang sama pada Hero 2 (Galaxy Z Fold8)

[Tahap 4: Bangun Apple-Style 2x3 Asymmetric Bento Grid]
    ├── Implementasikan 6 ubin promo terstruktur (Galaxy AI Hero span, Ekosistem, SEIN, Mall 2 Jam, Kayu, Trade-in)
    └── Pastikan tipografi dan kelengkungan 28px konsisten

[Tahap 5: Bangun Samsung-Style Rekomendasi Carousel]
    ├── Bangun wadah gulir horizontal dengan scroll-snap
    ├── Pasang tombol navigasi panah kiri/kanan dan indikator progres
    └── Terapkan efek refleksi cermin di bawah render produk

[Tahap 6: Verifikasi & Audit Kualitas]
    ├── Jalankan kompilasi Vite: `npm run build`
    ├── Jalankan pengujian backend: `php artisan test`
    └── Lakukan pengujian visual interaksi di browser
```

---

## 🔗 Keterkaitan Dokumen
* Vault Obsidian: `[[Rencana-Redesign-Storefront-Poster-Layout]]`
* Catatan Induk Toko: `[[README-Toko-Online]]`
* Standar Desain Resmi: `[[Desain-Dan-Arsitektur-Storefront]]`
