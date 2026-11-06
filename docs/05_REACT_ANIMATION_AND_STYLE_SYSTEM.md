# 🎨 Dokumen Spesifikasi 05: Sistem Animasi React & Panduan Desain Anti-Slop

> **Pustaka Animasi:** `motion` (Framer Motion v12)  
> **Mesin CSS:** Tailwind CSS v4  
> **Filosofi Visual:** Apple Spring Physics & Samsung High-Key Retail Purity  

---

## 1. Arsitektur Animasi: Menghapus Antipattern CSS Kaku

Dalam aplikasi storefront retail bernilai tinggi (Rp 21jt - Rp 33jt), animasi kaku dengan durasi linear `transition-all duration-300` atau trik `max-h-96` menciptakan kesan murahan dan patah (*clipping*). Seluruh interaksi gerak dialihkan ke **matematika fisika pegas (Spring Physics)** menggunakan pustaka resmi `motion`.

### A. Konfigurasi Standar Apple Spring
Fisika pegas bereaksi secara alami terhadap momentum, menghasilkan nuansa antarmuka yang berbobot (*tactile and organic*):

```javascript
// Standar fisika pegas Apple Store
export const appleSpring = {
    type: 'spring',
    stiffness: 280,
    damping: 24,
    mass: 0.8,
};

// Standar pegas bergulir tenang (calm luxury rolling pill) untuk kapsul navigasi
export const rollingPillSpring = {
    type: 'spring',
    stiffness: 170,  // Dikalibrasi lebih tenang & halus (sebelumnya 350)
    damping: 22,     // Rasio redaman teredam kritis (tanpa getaran/overshoot)
    mass: 0.9,
};

// Standar pegas ekspansi menu dropdown pengguna
export const dropdownSpring = {
    type: 'spring',
    stiffness: 220,
    damping: 24,
    mass: 0.8,
};
```

---

## 2. Pola-Pola Animasi Kunci

### A. Gliding Magnetic Pill (`layoutId`)
Digunakan pada tombol navbar aktif, selektor sudut pandang (*Rear vs Front view toggle*), serta tombol aksi kanan (*Search, Cart, User*) dan opsi dropdown pengguna (*Login vs Lacak Pesanan*). Elemen pil berpindah secara mulus melintasi tombol tanpa perlu menghitung posisi piksel manual:

```jsx
import { motion } from 'motion/react';

{/* Contoh pada navigasi kanan Search, Cart, User */}
{hoveredActionId === action.id && (
    <motion.div
        layoutId="rightNavHoverPill"
        className="absolute inset-0 bg-gray-100/90 rounded-full -z-10"
        transition={fastPillSpring}
    />
)}
```

### B. Ekspansi Panel Elastis (`AnimatePresence`)
Digunakan pada tirai mega-menu navbar dan akordion instruksi pengambilan gerai. Mencegah konten tertutup secara mendadak saat state berubah:

```jsx
import { AnimatePresence, motion } from 'motion/react';

<AnimatePresence>
    {isOpen && (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-white/95 backdrop-blur-xl border-b border-gray-200"
        >
            {/* Konten 3 Kolom */}
        </motion.div>
    )}
</AnimatePresence>
```

### C. Aliran Link Bertingkat (*Staggered Cascading Links*)
Tautan navigasi pada kolom mega-menu muncul mengalir berurutan dengan jeda 30ms, memberikan kedalaman visual:

```javascript
export const linkContainerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
            delayChildren: 0.05,
        },
    },
};

export const linkItemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.22, ease: 'easeOut' } 
    },
};
```

---

## 3. Sistem Desain & Token Warna Resmi (Tailwind CSS v4)

| Token Desain | Nilai HEX | Kelas Tailwind | Tujuan Penggunaan |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#FFFFFF` | `bg-white` | Latar utama halaman beranda & etalase |
| **Stage Background** | `#F8F9FA` | `bg-[#F8F9FA]` | Latar panggung teater Fold8 & kartu bento |
| **Apple Soft Gray** | `#F5F5F7` | `bg-[#F5F5F7]` | Latar ubin sekunder bento grid |
| **Samsung Core Blue** | `#1428A0` | `text-[#1428A0]` | Logo brand, badge resmi SEIN |
| **Action Accent Blue** | `#2189FF` | `bg-[#2189FF]` | Tombol primer pembelian [Beli Sekarang] |
| **Action Blue Hover** | `#1a70d4` | `hover:bg-[#1a70d4]` | State hover tombol primer |
| **Primary Typography** | `#111111` | `text-[#111111]` | Headline, judul produk, angka harga |
| **Secondary Typography** | `#6E6E73` | `text-[#6E6E73]` | Deskripsi fitur, subtitle, spesifikasi |
| **Subtle Border** | `#E5E7EB` | `border-gray-200` | Garis batas netral antar seksi |
| **Verified Green** | `#15803d` | `text-emerald-700` | Lencana garansi resmi SEIN 1 tahun |

---

## 4. Daftar Periksa Kepatuhan Anti-Slop (Anti-Slop Compliance Checklist)

Untuk memastikan antarmuka tetap berwibawa, berkelas dunia, dan bebas dari kebiasaan buruk AI:

- [x] **Zero Glow Neon:** Tidak ada pendaran cahaya neon biru/ungu buatan di belakang ponsel. Seluruh perangkat berdiri di atas panggung putih/abu-abu netral dengan bayangan kontak lantai realistis (*soft radial contact shadow*).
- [x] **Zero Em Dash:** Tidak ada tanda pisah panjang em dash dalam seluruh teks copywriting. Digunakan tanda baca standar bahasa Indonesia yang lugas dan profesional.
- [x] **Purpose Test (Uji Fungsi Visual):** Setiap elemen visual harus memiliki fungsi nyata (informasi spesifikasi, status stok, navigasi, atau tindakan pembelian), bukan sekadar hiasan abstrak.
- [x] **High-Key Retail Legitimacy:** Mempertahankan tema putih bersih yang menjadi standar toko ritel resmi Apple Store dan Samsung Electronics Indonesia.
- [x] **Separation of Concerns:** Halaman depan murni untuk penjelajahan produk; seluruh interaksi transaksi dikhususkan pada halaman Studio Pembelian (`/buy/{slug}`).
