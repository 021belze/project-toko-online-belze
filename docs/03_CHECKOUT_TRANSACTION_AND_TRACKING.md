# 💳 Dokumen Spesifikasi 03: Alur Transaksi, Keamanan Checkout & Pelacakan Pesanan

> **Modul Backend:** `app/Http/Controllers/CheckoutController.php`, `app/Mail/OrderInvoiceMail.php`  
> **Modul Frontend:** `resources/js/Pages/Invoice.jsx`, `resources/js/Pages/TrackOrder.jsx`  
> **Standar Transaksi:** Enkripsi 256-bit, Perlindungan Race Condition (*Pessimistic Locking*), Validasi Server-Side Mutlak  

---

## 1. Alur Transaksi Lengkap (End-to-End Transaction Flow)

```
[ PENGGUNA: Buy Studio ]
      │
      ├── Memilih Varian (Warna, Storage)
      ├── Mengisi Identitas & Metode Pengambilan
      └── Menekan Tombol [Pesan Sekarang]
            │
            ▼
[ POST /checkout ] (Rate Limited: throttle:5,1)
      │
      ├── 1. Validasi Input Data (Nama, Email, WhatsApp, Variant ID, Fulfillment)
      ├── 2. Buka DB Transaction: DB::beginTransaction()
      ├── 3. Kunci Baris Stok: ProductVariant::lockForUpdate()->find($variant_id)
      │       ├── Jika stok < quantity: Rollback & Kirim Error "Stok Tidak Mencukupi"
      │       └── Jika stok >= quantity: Kurangi Stok: $variant->decrement('stock')
      ├── 4. Ambil Harga Resmi Server (Cegah Manipulasi Klien)
      ├── 5. Generate 3 Digit Kode Unik Pembayaran (100 - 999)
      ├── 6. Simpan Pesanan ke Tabel 'orders' dengan Status 'pending'
      ├── 7. Komit Transaksi: DB::commit()
      ├── 8. Kirim Email Faktur Otomatis via Gmail SMTP (OrderInvoiceMail)
      └── 9. Redirect Pengguna ke Halaman Faktur Resmi: /invoice/{order_code}
            │
            ▼
[ HALAMAN FAKTUR: /invoice/{order_code} ]
      ├── Tampilkan Kode Pesanan Unik (Contoh: INV-202610-S26U-8821)
      ├── Rincian Varian, Total Tagihan + 3 Digit Kode Unik
      ├── QRIS Dinamis & Nomor Virtual Account Bank
      ├── Lokasi Pengambilan Gerai SES Mall / Alamat Kirim
      └── Tombol [Salin Nomor Rekening] & [Lacak Status Pesanan]
            │
            ▼
[ HALAMAN PELACAKAN: /track ]
      ├── Form Pencarian: Input Kode Pesanan + Email/Nomor WhatsApp
      └── Milestones Status: Pesanan Dibuat -> Pembayaran Terverifikasi -> Penyiapan Unit di SES -> Siap Diambil
```

---

## 2. Standar Keamanan & Integritas Transaksi

### A. Perhitungan Harga Server-Side Mutlak (*Zero Client-Trust*)
Frontend tidak pernah diperbolehkan mengirimkan nominal harga (`price`). Nilai harga murni diambil oleh backend langsung dari kolom `price` pada tabel `product_variants` berdasarkan `variant_id`. Setiap upaya pengiriman harga palsu dari browser akan diabaikan secara total.

### B. Perlindungan *Race Condition* & Stok Minus
Ketika banyak pengguna melakukan checkout pada varian yang sama secara bersamaan (misal rilis awal Galaxy S26 Ultra), sistem mengunci baris data varian tersebut di level database menggunakan `lockForUpdate()` di dalam transaksi database:

```php
DB::transaction(function () use ($validated, &$order) {
    $variant = ProductVariant::where('id', $validated['variant_id'])
        ->lockForUpdate()
        ->firstOrFail();

    if ($variant->stock < $validated['quantity']) {
        throw new \Exception('Maaf, stok unit ini baru saja habis dipesan pembeli lain.');
    }

    // Pengurangan stok secara atomik
    $variant->decrement('stock', $validated['quantity']);

    $uniqueCode = rand(100, 999);
    $totalAmount = ($variant->price * $validated['quantity']) + $uniqueCode;

    $order = Order::create([
        'order_code' => 'INV-' . date('Ym') . '-' . strtoupper(Str::random(6)),
        'variant_id' => $variant->id,
        'customer_name' => $validated['customer_name'],
        'customer_email' => $validated['customer_email'],
        'customer_phone' => $validated['customer_phone'],
        'fulfillment_type' => $validated['fulfillment_type'],
        'pickup_location' => $validated['pickup_location'] ?? null,
        'shipping_address' => $validated['shipping_address'] ?? null,
        'unit_price' => $variant->price,
        'unique_code' => $uniqueCode,
        'total_amount' => $totalAmount,
        'payment_method' => $validated['payment_method'],
        'status' => 'pending',
    ]);
});
```

### C. Proteksi Anti-Spam & DDoS
Rute `POST /checkout` dilindungi middleware `throttle:5,1` (maksimal 5 permintaan dalam 1 menit per alamat IP) untuk mencegah eksploitasi bot.

---

## 3. Notifikasi Otomatis Faktur Gmail SMTP

Setiap pesanan yang berhasil dicatat akan secara asinkron memicu pengiriman email resmi menggunakan kelas `OrderInvoiceMail`:
1. **Identitas Pengirim:** `Samsung Authorized Store <order@samsung-authorized.co.id>`.
2. **Subjek Email:** `Faktur Resmi Pemesanan [Kode Pesanan] - Samsung Galaxy [Model] Garansi SEIN`.
3. **Isi Email:**
   * Informasi pemesan dan nomor telepon.
   * Rincian spesifikasi varian (Warna, RAM, Kapasitas Memori).
   * Nomor IMEI pra-alokasi terdaftar Kemenperin.
   * Rincian pembayaran (Nomor VA Bank / Panduan QRIS) beserta tenggat waktu pembayaran (2 jam).
   * Alamat gerai SES Mall terpilih atau konfirmasi pengiriman paket kayu.

---

## 4. Halaman Faktur Pembayaran (`Invoice.jsx`)

Menampilkan antarmuka faktur resmi yang bersih dan informatif:
* **Status Badge:** Lencana status real-time (`Menunggu Pembayaran`, `Pembayaran Terverifikasi`, `Siap Diambil di SES`, `Selesai`).
* **Wadah QRIS & Virtual Account:** QR code standar nasional dengan tombol unduh/simpan dan nomor virtual account dengan fitur satu-klik salin (*one-click copy to clipboard*).
* **Hitung Mundur Pembayaran (Countdown Timer):** Timer dinamis 2 jam.
* **Instruksi Pengambilan Gerai SES:** Menampilkan alamat lengkap mall terpilih, jam operasional, dan barcode faktur digital untuk dipindai oleh staf gerai.

---

## 5. Halaman Pelacakan Pesanan Publik (`TrackOrder.jsx`)

Halaman mandiri (`/track`) bagi pembeli untuk memeriksa status unit tanpa harus login:
* **Validasi Dua Faktor Ringan:** Pembeli memasukkan `Kode Pesanan` dan `Nomor WhatsApp` atau `Email` yang digunakan saat transaksi.
* **Linimasa Progres Visual (Milestone Stepper):**
  1. *Pesanan Terkonfirmasi* (Faktur diterbitkan).
  2. *Pembayaran Berhasil* (Verifikasi dana otomatis).
  3. *Penyiapan Unit SEIN* (Pengecekan segel pabrik dan alokasi IMEI).
  4. *Siap Diambil di SES / Dalam Pengiriman Berasuransi*.
* **Lencana Legalitas IMEI:** Tautan validasi nomor IMEI resmi ke sistem purna jual Samsung Electronics Indonesia.
