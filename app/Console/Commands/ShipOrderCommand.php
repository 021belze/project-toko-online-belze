<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('order:ship {order_code : Kode invoice pesanan (contoh: INV-202610-XXXXXX)} {--resi= : Nomor resi kurir/ekspedisi} {--imei= : 15 digit nomor IMEI resmi SEIN} {--sn= : Serial number perangkat}')]
#[Description('Tandai pesanan sebagai dikirim (shipped), catat nomor resi dan IMEI resmi SEIN')]
class ShipOrderCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $code = (string) $this->argument('order_code');
        $resi = (string) $this->option('resi');
        $imei = $this->option('imei') ? (string) $this->option('imei') : null;
        $sn = $this->option('sn') ? (string) $this->option('sn') : null;

        $order = Order::with('variant')->where('order_code', $code)->first();

        if (! $order) {
            $this->error("Pesanan dengan kode #{$code} tidak ditemukan di database.");

            return self::FAILURE;
        }

        if ($order->status === 'cancelled') {
            $this->error("Pesanan #{$code} sudah dibatalkan (cancelled) dan tidak dapat dikirim.");

            return self::FAILURE;
        }

        if (empty($resi)) {
            $resiInput = $this->ask('Masukkan Nomor Resi Ekspedisi (JNE / SiCepat / dsb):');
            if (empty($resiInput)) {
                $this->error('Nomor resi wajib diisi untuk menandai status pengiriman.');

                return self::FAILURE;
            }
            $resi = $resiInput;
        }

        if (empty($imei)) {
            $imeiInput = $this->ask('Masukkan 15-Digit IMEI Resmi SEIN (Opsional, tekan Enter untuk lewati):');
            $imei = $imeiInput ?: null;
        }

        $order->markAsShipped($resi, $imei, $sn);

        $this->info("✓ Pesanan #{$order->order_code} berhasil diperbarui menjadi SHIPPED!");
        $this->table(
            ['Field', 'Nilai'],
            [
                ['Kode Pesanan', $order->order_code],
                ['Pelanggan', $order->customer_name.' ('.$order->customer_phone.')'],
                ['Produk', ($order->variant?->product_name ?? 'Samsung Galaxy').' - '.$order->variant?->color_name],
                ['Nomor Resi', $order->tracking_number],
                ['IMEI SEIN', $order->imei ?: '-'],
                ['Waktu Kirim', $order->shipped_at?->toDateTimeString() ?? '-'],
                ['Status', strtoupper($order->status)],
            ]
        );

        return self::SUCCESS;
    }
}
