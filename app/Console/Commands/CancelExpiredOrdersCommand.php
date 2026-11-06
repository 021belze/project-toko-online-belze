<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

#[Signature('orders:cancel-expired')]
#[Description('Cancel pending orders that have passed their 24-hour expiration window and return stock')]
class CancelExpiredOrdersCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $expiredOrders = Order::where('status', 'pending')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->get();

        if ($expiredOrders->isEmpty()) {
            $this->info('Tidak ada pesanan kadaluarsa yang perlu dibatalkan.');

            return self::SUCCESS;
        }

        $this->info("Menemukan {$expiredOrders->count()} pesanan kadaluarsa. Memproses pembatalan dan pengembalian stok...");

        $cancelledCount = 0;

        foreach ($expiredOrders as $order) {
            DB::transaction(function () use ($order, &$cancelledCount): void {
                $variant = ProductVariant::where('id', $order->variant_id)
                    ->lockForUpdate()
                    ->first();

                if ($variant) {
                    $variant->increment('stock', $order->quantity);
                }

                $order->update([
                    'status' => 'cancelled',
                ]);

                $cancelledCount++;
            });

            Log::info("Pesanan #{$order->order_code} dibatalkan otomatis karena melewati batas waktu bayar. Stok dikembalikan ({$order->quantity} unit).");
        }

        $this->info("Selesai! {$cancelledCount} pesanan berhasil dibatalkan dan stok dikembalikan.");

        return self::SUCCESS;
    }
}
