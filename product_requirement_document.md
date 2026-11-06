# Product Requirement Document (PRD)
**Project Name:** Single-Product Showcase & E-Commerce Web (Apple/Samsung Style)  
**Architecture:** Monolith (Laravel 13 + Inertia.js + React Vite + MySQL)  
**Target Market:** Indonesia (Metode Pembayaran & Pengiriman Lokal)  

---

## 1. Overview & Project Scope
Aplikasi web *e-commerce* yang berfokus pada penjualan satu lini produk utama (*flagship gadget/device*) dengan antarmuka interaktif bergaya *landing page* Apple atau Samsung. Sistem menggunakan alur transaksi satu halaman (*One-Page Checkout*) tanpa keranjang belanja multi-item.

### Batasan Sistem (Scope)
* **Zero-Backoffice (Tanpa Halaman Admin):** Tidak ada pembuatan UI dashboard admin. Data master produk/varian dimasukkan melalui *Laravel Database Seeder*, dan pemantauan pesanan dilakukan langsung melalui Database GUI (phpMyAdmin / TablePlus).
* **Hybrid Authentication:** Mendukung *Guest Checkout* (tanpa wajib login) sekaligus *Optional Login* (bawaan Laravel Breeze React) untuk kemudahan *auto-fill* data pemesan.
* **No REST API Manual:** Komunikasi data antara backend Laravel dan frontend React ditangani sepenuhnya menggunakan **Inertia.js**.

---

## 2. Tech Stack
* **Backend:** PHP $\ge 8.3$, Laravel 13
* **Frontend:** React (JSX), Tailwind CSS, Vite
* **Fullstack Adapter:** Inertia.js (`inertiajs/inertia-laravel` & `@inertiajs/react`)
* **Database:** MySQL
* **Mail Service:** Laravel Mail (`Mailable`) via Gmail SMTP (App Password)

---

## 3. Functional Requirements

### 3.1. Product Showcase & Interactive Configurator (`Showcase.jsx`)
1. **Visual Showcase:** Menampilkan *hero section* dan spesifikasi unggulan produk (*bento grid*).
2. **Variant Selector:**
   * Pemilihan **Warna** mengubah pratinjau gambar produk secara instan.
   * Pemilihan kombinasi **RAM** dan **Storage** mengubah harga tampilan secara *real-time*.
3. **Stock Indicator:**
   * Jika `stock > 5`: Menampilkan status *"Tersedia"*.
   * Jika `stock` antara $1$ hingga $5$: Menampilkan status *"Stok Terbatas"*.
   * Jika `stock == 0`: Opsi varian otomatis terkunci (*disabled*) dengan label *"Habis"*.

### 3.2. Fulfillment Method (Pengiriman vs Ambil di Toko)
1. **Delivery (Kirim ke Alamat):**
   * Menampilkan form alamat lengkap: Provinsi, Kota/Kabupaten, Kecamatan, Kode Pos, dan Alamat Detail.
2. **In-Store Pickup (Ambil di Toko):**
   * Menyembunyikan form alamat pengiriman rumah.
   * Menampilkan *dropdown* pemilihan lokasi cabang toko fisik (contoh: *Grand Indonesia, Central Park, Pondok Indah Mall*).

### 3.3. One-Page Checkout & Payment (Lokal Indonesia)
1. **Data Pemesan:** Nama Lengkap, Email Aktif (wajib untuk pengiriman invoice Gmail), dan Nomor HP/WhatsApp. Jika user berstatus login, Nama dan Email terisi otomatis.
2. **Opsi Metode Pembayaran:**
   * **QRIS** (Mendukung GoPay, OVO, Dana, ShopeePay, dan m-Banking).
   * **Virtual Account Bank:** BCA, Mandiri, BNI, BRI.
   * **E-Wallet:** GoPay, Dana, ShopeePay.

### 3.4. Backend Processing, Security & Gmail Notification
1. **Server-Side Price Calculation:** Backend tidak menerima input nominal harga dari frontend. Harga diambil murni dari tabel `product_variants` berdasarkan `variant_id` yang dikirim, ditambah $3$ digit kode unik pembayaran.
2. **Stock Validation & Decrement:**
   * Mengecek ketersediaan stok (`stock >= quantity`) di dalam *Database Transaction*.
   * Mengurangi stok secara otomatis saat pesanan berhasil dibuat: `$variant->decrement('stock', $quantity)`.
3. **Anti-Spam Protection:** Menerapkan *Rate Limiting* (`throttle:5,1`) pada rute `POST /checkout`.
4. **Automated Gmail Invoice:** Mengirimkan email struk pesanan berisi `order_code`, rincian varian, alamat/lokasi pickup, dan instruksi pembayaran ke alamat email pembeli.

### 3.5. Order Invoice & Public Tracking
1. **Halaman Invoice (`Invoice.jsx`):** Menampilkan status pesanan, kode pesanan unik, rincian pembayaran (QRIS / Nomor VA), dan total tagihan.
2. **Halaman Cek Pesanan (`TrackOrder.jsx`):** Memungkinkan pembeli (Guest) melacak status pesanan menggunakan kombinasi `order_code` dan `customer_email` atau `customer_phone`.

---

## 4. Database Schema (MySQL)

### 4.1. Tabel `users`
Menggunakan skema bawaan Laravel (`id`, `name`, `email`, `password`, `timestamps`).

### 4.2. Tabel `product_variants`
Menyimpan matriks kombinasi SKU produk (diisi via `ProductVariantSeeder`).

| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | PK, Auto Increment | ID Varian |
| `sku` | `VARCHAR(50)` | UNIQUE | Kode SKU (misal: `PHN-BLK-12-256`) |
| `color_name` | `VARCHAR(50)` | NOT NULL | Nama warna (misal: `Titanium Black`) |
| `color_hex` | `VARCHAR(10)` | NOT NULL | Kode warna HEX untuk tombol UI |
| `ram` | `VARCHAR(20)` | NOT NULL | Kapasitas RAM (`8GB`, `12GB`) |
| `storage` | `VARCHAR(20)` | NOT NULL | Kapasitas Memori (`128GB`, `256GB`, `512GB`) |
| `price` | `DECIMAL(12,2)` | NOT NULL | Harga master varian |
| `stock` | `INT` | UNSIGNED, Default `0` | Sisa stok unit |
| `image_url` | `VARCHAR(255)` | NOT NULL | Path gambar varian di folder public |
| `created_at` | `TIMESTAMP` | NULLABLE | Waktu dibuat |
| `updated_at` | `TIMESTAMP` | NULLABLE | Waktu diupdate |

### 4.3. Tabel `orders`
Menyimpan seluruh data transaksi pembeli.

| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | PK, Auto Increment | ID Internal |
| `user_id` | `BIGINT` | FK, NULLABLE | Relasi ke `users.id` (`NULL` jika Guest) |
| `variant_id` | `BIGINT` | FK, NOT NULL | Relasi ke `product_variants.id` |
| `order_code` | `VARCHAR(30)` | UNIQUE, NOT NULL | Kode invoice unik (`INV-202610-XXXX`) |
| `quantity` | `INT` | UNSIGNED, Default `1` | Jumlah unit dibeli |
| `unit_price` | `DECIMAL(12,2)` | NOT NULL | Harga satuan saat transaksi |
| `unique_code` | `INT` | UNSIGNED | $3$ digit kode unik transfer |
| `total_price` | `DECIMAL(12,2)` | NOT NULL | Total tagihan (`(unit_price * quantity) + unique_code`) |
| `customer_name` | `VARCHAR(100)` | NOT NULL | Nama penerima |
| `customer_email` | `VARCHAR(100)` | NOT NULL | Email penerima invoice Gmail |
| `customer_phone` | `VARCHAR(25)` | NOT NULL | Nomor kontak/kurir |
| `fulfillment_method` | `ENUM` | `'delivery'`, `'pickup'` | Metode pengambilan barang |
| `pickup_store` | `VARCHAR(100)` | NULLABLE | Nama cabang toko (wajib jika `pickup`) |
| `shipping_province` | `VARCHAR(100)` | NULLABLE | Provinsi (wajib jika `delivery`) |
| `shipping_city` | `VARCHAR(100)` | NULLABLE | Kota/Kabupaten (wajib jika `delivery`) |
| `shipping_district` | `VARCHAR(100)` | NULLABLE | Kecamatan (wajib jika `delivery`) |
| `shipping_postal_code`| `VARCHAR(10)` | NULLABLE | Kode Pos (wajib jika `delivery`) |
| `shipping_address` | `TEXT` | NULLABLE | Detail jalan & patokan (wajib jika `delivery`) |
| `payment_method` | `VARCHAR(50)` | NOT NULL | `qris`, `va_bca`, `va_mandiri`, `va_bni`, `va_bri`, `gopay`, `dana`, `shopeepay` |
| `status` | `ENUM` | Default `'pending'` | `'pending'`, `'paid'`, `'processing'`, `'shipped'`, `'completed'`, `'cancelled'` |
| `tracking_number` | `VARCHAR(50)` | NULLABLE | Nomor resi pengiriman (diisi via database) |
| `created_at` | `TIMESTAMP` | NULLABLE | Waktu transaksi |
| `updated_at` | `TIMESTAMP` | NULLABLE | Waktu pembaruan status |

---

## 5. Application Routes & Inertia Pages Mapping

Seluruh rute didefinisikan di dalam `routes/web.php`:

| HTTP Method | URI | Controller Action | Inertia React Page (`resources/js/Pages/`) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | `ProductController@index` | `Showcase.jsx` | Menampilkan halaman utama, varian, stok, dan form checkout. |
| `POST` | `/checkout` | `OrderController@store` | *(Redirect ke Invoice)* | Memvalidasi input, mengurangi stok, menyimpan order, dan mengirim email. |
| `GET` | `/invoice/{order_code}` | `OrderController@show` | `Invoice.jsx` | Menampilkan halaman sukses, detail pesanan, dan instruksi bayar. |
| `GET` | `/track` | `OrderController@track` | `TrackOrder.jsx` | Halaman pencarian status pesanan publik berdasarkan kode order. |

---

## 6. Validation Rules (`StoreOrderRequest`)
* `variant_id`: `required|exists:product_variants,id`
* `quantity`: `required|integer|min:1|max:5`
* `customer_name`: `required|string|min:3|max:100`
* `customer_email`: `required|email:rfc,dns|max:100`
* `customer_phone`: `required|string|min:10|max:15`
* `fulfillment_method`: `required|in:delivery,pickup`
* `pickup_store`: `nullable|required_if:fulfillment_method,pickup|string|max:100`
* `shipping_province`: `nullable|required_if:fulfillment_method,delivery|string|max:100`
* `shipping_city`: `nullable|required_if:fulfillment_method,delivery|string|max:100`
* `shipping_district`: `nullable|required_if:fulfillment_method,delivery|string|max:100`
* `shipping_postal_code`: `nullable|required_if:fulfillment_method,delivery|string|max:10`
* `shipping_address`: `nullable|required_if:fulfillment_method,delivery|string|min:10`
* `payment_method`: `required|in:qris,va_bca,va_mandiri,va_bni,va_bri,gopay,dana,shopeepay`

---

## 7. Edge Cases & Implementation Notes
1. **Prevent Double Submit pada Checkout:** Karena pengiriman SMTP Gmail memakan waktu sekitar $2$ hingga $4$ detik, tombol submit di `Showcase.jsx` wajib di-disable menggunakan state `processing` dari hook `useForm` Inertia.
2. **Race Condition pada Stok:** Pemeriksaan dan pengurangan stok di `OrderController@store` wajib dibungkus dalam `DB::transaction()` dengan `lockForUpdate()` agar stok tidak minus saat diakses bersamaan.
3. **Reset Data Cepat:** Gunakan perintah `php artisan migrate:fresh --seed` untuk mereset stok dan varian produk selama masa pengujian.