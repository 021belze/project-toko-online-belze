# 🗄️ Dokumen Spesifikasi 04: Skema Database, Model Eloquent & Data Seeder

> **Arsitektur:** MySQL Relational Database  
> **ORM:** Laravel Eloquent (PHP 8.3 / Laravel 11/13)  
> **Prinsip:** Normalisasi Database, Integritas Foreign Key, Matriks SKU Lengkap  

---

## 1. Diagram Relasi Entitas (ERD)

```
+------------------------------------+
|             products               |
+------------------------------------+
| PK  id               BIGINT        |
|     name             VARCHAR(100)  |
|     slug             VARCHAR(100)  | (UNIQUE)
|     tagline          VARCHAR(255)  |
|     description      TEXT          |
|     starting_price   DECIMAL(12,2) |
|     hero_image       VARCHAR(255)  |
|     created_at / updated_at        |
+-----------------+------------------+
                  | 1
                  |
                  | hasMany
                  |
                  | *
+-----------------+------------------+
|         product_variants           |
+------------------------------------+
| PK  id               BIGINT        |
| FK  product_id       BIGINT        | (Indexed)
|     sku              VARCHAR(50)   | (UNIQUE)
|     color_name       VARCHAR(50)   |
|     color_hex        VARCHAR(10)   |
|     ram              VARCHAR(20)   |
|     storage          VARCHAR(20)   |
|     price            DECIMAL(12,2) |
|     stock            INT UNSIGNED  |
|     image_chassis    VARCHAR(255)  | (Tampak Belakang)
|     image_display    VARCHAR(255)  | (Tampak Depan AMOLED)
|     created_at / updated_at        |
+-----------------+------------------+
                  | 1
                  |
                  | hasMany
                  |
                  | *
+-----------------+------------------+
|              orders                |
+------------------------------------+
| PK  id               BIGINT        |
| FK  user_id          BIGINT        | (NULLABLE, FK ke users.id)
| FK  variant_id       BIGINT        | (FK ke product_variants.id)
|     order_code       VARCHAR(30)   | (UNIQUE, Indexed)
|     customer_name    VARCHAR(100)  |
|     customer_email   VARCHAR(100)  | (Indexed)
|     customer_phone   VARCHAR(30)   | (Indexed)
|     fulfillment_type VARCHAR(20)   | ('pickup' / 'delivery')
|     pickup_location  VARCHAR(150)  | (NULLABLE)
|     shipping_address TEXT          | (NULLABLE)
|     unit_price       DECIMAL(12,2) |
|     unique_code      INT UNSIGNED  |
|     total_amount     DECIMAL(12,2) |
|     payment_method   VARCHAR(30)   | ('qris', 'va_bca', 'va_mandiri', dll)
|     status           VARCHAR(30)   | ('pending', 'paid', 'ready_pickup', 'completed')
|     imei_number      VARCHAR(20)   | (NULLABLE, Terdaftar SEIN)
|     created_at / updated_at        |
+------------------------------------+
```

---

## 2. Struktur Tabel & Spesifikasi Kolom

### A. Tabel `products`
Menyimpan data master lini produk unggulan yang tampil di etalase.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Primary Key |
| `name` | `VARCHAR(100)` | Nama lini produk (contoh: `Samsung Galaxy S26 Ultra 5G`) |
| `slug` | `VARCHAR(100) UNIQUE` | URL-friendly identifier (`samsung-galaxy-s26-ultra`) |
| `tagline` | `VARCHAR(255)` | Tagline kampanye (`Titanium. Presisi Tanpa Kompromi.`) |
| `description` | `TEXT` | Rincian ringkas fitur dan keunggulan SEIN |
| `starting_price` | `DECIMAL(12,2)` | Harga terendah varian untuk label "Mulai dari" |
| `hero_image` | `VARCHAR(255)` | Path aset render utama produk di folder public |

### B. Tabel `product_variants`
Menyimpan kombinasi SKU spesifik yang dapat dibeli oleh konsumen.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Primary Key |
| `product_id` | `BIGINT UNSIGNED` | Relasi ke `products.id` dengan opsi `onDelete('cascade')` |
| `sku` | `VARCHAR(50) UNIQUE` | Kode unik SKU gudang (contoh: `S26U-VLT-12-512`) |
| `color_name` | `VARCHAR(50)` | Nama resmi finis (`Titanium Cobalt Violet`) |
| `color_hex` | `VARCHAR(10)` | Kode warna visual untuk swatch tombol (`#3b334a`) |
| `ram` | `VARCHAR(20)` | Kapasitas RAM (`12GB`, `16GB`) |
| `storage` | `VARCHAR(20)` | Kapasitas penyimpanan (`256GB`, `512GB`, `1TB`) |
| `price` | `DECIMAL(12,2)` | Harga resmi varian bersangkutan |
| `stock` | `INT UNSIGNED DEFAULT 0` | Jumlah unit siap jual |
| `image_chassis` | `VARCHAR(255)` | Render sudut belakang menonjolkan bodi |
| `image_display` | `VARCHAR(255)` | Render sudut depan menonjolkan layar Dynamic AMOLED |

### C. Tabel `orders`
Menyimpan rekaman transaksi pemesanan unit.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Primary Key |
| `variant_id` | `BIGINT UNSIGNED` | Relasi ke `product_variants.id` |
| `order_code` | `VARCHAR(30) UNIQUE` | Kode faktur unik (contoh: `INV-202610-882193`) |
| `customer_name` | `VARCHAR(100)` | Nama lengkap pembeli sesuai KTP |
| `customer_email` | `VARCHAR(100)` | Email penerima faktur digital |
| `customer_phone` | `VARCHAR(30)` | Nomor WhatsApp aktif untuk konfirmasi |
| `fulfillment_type` | `ENUM('pickup', 'delivery')` | Metode penerimaan barang |
| `pickup_location` | `VARCHAR(150) NULL` | Nama gerai SES Mall (jika opsi pickup) |
| `shipping_address` | `TEXT NULL` | Alamat lengkap tujuan pengiriman kayu |
| `unit_price` | `DECIMAL(12,2)` | Harga satuan varian saat transaksi dibuat |
| `unique_code` | `INT UNSIGNED` | 3 digit kode pembayaran acak |
| `total_amount` | `DECIMAL(12,2)` | Total tagihan resmi (`unit_price + unique_code`) |
| `payment_method` | `VARCHAR(30)` | Metode pembayaran yang dipilih |
| `status` | `VARCHAR(30)` | Status pesanan (`pending`, `paid`, `ready_pickup`, dll) |
| `imei_number` | `VARCHAR(20) NULL` | Nomor IMEI resmi dialokasikan saat unit disiapkan |

---

## 3. Matriks Data Seeder Resmi

### A. Samsung Galaxy S26 Ultra 5G (12 SKU Varian)
* **Pilihan Finis Bodi (4 Warna):**
  1. `Titanium Silver Shadow` (`#8c959e`)
  2. `Titanium Phantom Black` (`#161719`)
  3. `Titanium Cobalt Violet` (`#3b334a`)
  4. `Titanium Amber Gold` (`#c8b590`)
* **Pilihan Kapasitas Memori (3 Tingkat):**
  1. `256GB / 12GB RAM` : Rp 21.999.000 (Stok: 15 per warna)
  2. `512GB / 12GB RAM` : Rp 24.999.000 (Stok: 10 per warna)
  3. `1TB / 16GB RAM` : Rp 29.999.000 (Stok: 5 per warna)

### B. Samsung Galaxy Z Fold8 5G (4 SKU Varian)
* **Pilihan Finis Bodi (2 Warna):**
  1. `Crafted Black` (`#121316`)
  2. `Silver Shadow` (`#94a3b8`)
* **Pilihan Kapasitas Memori (2 Tingkat):**
  1. `512GB / 12GB RAM` : Rp 26.999.000 (Stok: 8 per warna)
  2. `1TB / 16GB RAM` : Rp 31.999.000 (Stok: 4 per warna)

---

## 4. Definisi Model Eloquent & Relasi

```php
// app/Models/Product.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $guarded = [];

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }
}

// app/Models/ProductVariant.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariant extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'variant_id');
    }
}
```
