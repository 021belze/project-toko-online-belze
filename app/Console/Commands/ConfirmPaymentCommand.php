<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('order:confirm-payment {order_code : Kode invoice pesanan (contoh: INV-202610-XXXXXX)}')]
#[Description('Konfirmasi manual pembayaran pesanan dan perbarui status menjadi PAID')]
class ConfirmPaymentCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $code = (string) $this->argument('order_code');

        $order = Order::with('variant')->where('order_code', $code)->first();

        if (! $order) {
            $this->error("Pesanan dengan kode #{$code} tidak ditemukan di database.");

            return self::FAILURE;
        }

        if ($order->status === 'paid') {
            $this->warn("Pesanan #{$code} sudah berstatus PAID sebelumnya (pada {$order->paid_at}).");

            return self::SUCCESS;
        }

        if ($order->status === 'cancelled') {
            $this->error("Pesanan #{$code} sudah dibatalkan (cancelled). Tidak dapat dikonfirmasi.");

            return self::FAILURE;
        }

        $order->markAsPaid();

        $this->info("✓ Pembayaran pesanan #{$order->order_code} berhasil dikonfirmasi!");
        $this->table(
            ['Field', 'Nilai'],
            [
                ['Kode Pesanan', $order->order_code],
                ['Pelanggan', $order->customer_name],
                ['Total Tagihan', 'Rp '.number_format((float) $order->total_price, 0, ',', '.')],
                ['Metode Bayar', strtoupper($order->payment_method)],
                ['Waktu Bayar', $order->paid_at?->toDateTimeString() ?? '-'],
                ['Status', strtoupper($order->status)],
            ]
        );

        return self::SUCCESS;
    }
}
