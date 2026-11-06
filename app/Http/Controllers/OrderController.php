<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Mail\OrderInvoiceMail;
use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Store a newly created order with race-condition safe stock decrement.
     */
    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $order = DB::transaction(function () use ($validated, $request): Order {
            // Lock the selected variant row for update to prevent race conditions
            $variant = ProductVariant::where('id', $validated['variant_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $quantity = (int) $validated['quantity'];

            if ($variant->stock < $quantity) {
                throw ValidationException::withMessages([
                    'variant_id' => "Stok produk tidak mencukupi. Sisa stok tersedia: {$variant->stock} unit.",
                ]);
            }

            // Decrement stock safely
            $variant->decrement('stock', $quantity);

            // Server-side financial calculations
            $unitPrice = (float) $variant->price;
            $uniqueCode = random_int(100, 999);
            $totalPrice = ($unitPrice * $quantity) + $uniqueCode;

            // Generate unique invoice code: INV-YYYYMM-XXXXXX
            $yearMonth = date('Ym');
            $randomString = strtoupper(Str::random(6));
            $orderCode = "INV-{$yearMonth}-{$randomString}";

            // Ensure order_code uniqueness
            while (Order::where('order_code', $orderCode)->exists()) {
                $orderCode = "INV-{$yearMonth}-".strtoupper(Str::random(6));
            }

            return Order::create([
                'user_id' => $request->user()?->id,
                'variant_id' => $variant->id,
                'warranty_type' => $variant->warranty_type ?? 'Garansi Resmi SEIN',
                'order_code' => $orderCode,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'unique_code' => $uniqueCode,
                'insurance_fee' => 0,
                'total_price' => $totalPrice,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'fulfillment_method' => $validated['fulfillment_method'],
                'pickup_store' => $validated['pickup_store'] ?? null,
                'shipping_province' => $validated['shipping_province'] ?? null,
                'shipping_city' => $validated['shipping_city'] ?? null,
                'shipping_district' => $validated['shipping_district'] ?? null,
                'shipping_postal_code' => $validated['shipping_postal_code'] ?? null,
                'shipping_address' => $validated['shipping_address'] ?? null,
                'payment_method' => $validated['payment_method'],
                'status' => 'pending',
                'tracking_number' => null,
                'expires_at' => now()->addHours(24),
            ]);
        });

        // Load variant relationship for email
        $order->load('variant');

        // Send automated invoice email
        try {
            Mail::to($order->customer_email)->send(new OrderInvoiceMail($order));
        } catch (\Throwable $e) {
            Log::warning("Gagal mengirim email invoice ke {$order->customer_email}: ".$e->getMessage());
        }

        return redirect()->route('orders.show', ['order_code' => $order->order_code])
            ->with('success', 'Pesanan berhasil dibuat!');
    }

    /**
     * Display the order invoice page with payment instructions.
     */
    public function show(string $order_code): Response
    {
        $order = Order::with('variant')
            ->where('order_code', $order_code)
            ->firstOrFail();

        // Helper mock payment instructions for Indonesian payment methods
        $paymentDetails = $this->buildPaymentDetails($order);

        return Inertia::render('Invoice', [
            'order' => $order,
            'paymentDetails' => $paymentDetails,
        ]);
    }

    /**
     * Public order tracking page.
     */
    public function track(Request $request): Response
    {
        $order = null;
        $searched = false;
        $errorMessage = null;

        if ($request->filled('order_code') && $request->filled('contact')) {
            $searched = true;
            $code = trim((string) $request->input('order_code'));
            $contact = trim((string) $request->input('contact'));

            $order = Order::with('variant')
                ->where('order_code', $code)
                ->where(function ($query) use ($contact): void {
                    $query->where('customer_email', $contact)
                        ->orWhere('customer_phone', $contact);
                })
                ->first();

            if (! $order) {
                $errorMessage = 'Pesanan tidak ditemukan. Pastikan Kode Pesanan dan Email/Nomor HP sesuai.';
            }
        }

        return Inertia::render('TrackOrder', [
            'order' => $order,
            'searched' => $searched,
            'errorMessage' => $errorMessage,
            'filters' => [
                'order_code' => $request->input('order_code', ''),
                'contact' => $request->input('contact', ''),
            ],
        ]);
    }

    /**
     * Generate simulated payment details (QRIS / VA / E-Wallet) for Indonesian gateways.
     *
     * @return array<string, mixed>
     */
    private function buildPaymentDetails(Order $order): array
    {
        $method = $order->payment_method;
        $bankPrefix = match ($method) {
            'va_bca' => '3901',
            'va_mandiri' => '8950',
            'va_bni' => '8277',
            'va_bri' => '1280',
            default => '7700',
        };

        $digits = preg_replace('/[^0-9]/', '', $order->customer_phone);
        $phoneSuffix = substr($digits, -8);
        $virtualAccount = $bankPrefix.($phoneSuffix ?: '12345678');

        return [
            'method' => $method,
            'virtual_account' => str_starts_with($method, 'va_') ? $virtualAccount : null,
            'qris_payload' => $method === 'qris' ? "00020101021226500016ID.CO.QRIS.WWW0118{$order->order_code}520458125303360540{$order->total_price}5802ID" : null,
            'expiry_time' => $order->expires_at ? $order->expires_at->toIso8601String() : ($order->created_at ? $order->created_at->addHours(24)->toIso8601String() : null),
        ];
    }
}
