<?php

namespace Tests\Feature;

use App\Mail\OrderInvoiceMail;
use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private ProductVariant $variant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->variant = ProductVariant::create([
            'product_name' => 'Samsung Galaxy S26 Ultra 5G',
            'series' => 'Galaxy S26 Series',
            'sku' => 'SM-S26U-BLK-12-256',
            'color_name' => 'Titanium Phantom Black',
            'color_hex' => '#161719',
            'ram' => '12GB',
            'storage' => '256GB',
            'warranty_type' => 'Garansi Resmi SEIN (1 Tahun)',
            'price' => 21999000,
            'stock' => 10,
            'image_url' => '/images/products/s26-ultra-black.svg',
        ]);
    }

    public function test_showcase_page_renders_successfully(): void
    {
        $response = $this->get(route('products.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->has('models')
            ->has('variants')
        );
    }

    public function test_buy_page_renders_successfully(): void
    {
        $response = $this->get(route('products.buy', ['slug' => 'samsung-galaxy-s26-ultra']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Buy')
            ->has('variants')
            ->has('pickupStores')
        );
    }

    public function test_user_can_place_order_with_delivery(): void
    {
        Mail::fake();

        $payload = [
            'variant_id' => $this->variant->id,
            'quantity' => 1,
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'customer_phone' => '081234567890',
            'fulfillment_method' => 'delivery',
            'shipping_province' => 'DKI Jakarta',
            'shipping_city' => 'Jakarta Selatan',
            'shipping_district' => 'Kebayoran Baru',
            'shipping_postal_code' => '12180',
            'shipping_address' => 'Jl. Sudirman No. 10',
            'payment_method' => 'qris',
        ];

        $response = $this->post(route('orders.store'), $payload);

        $order = Order::first();
        $this->assertNotNull($order);
        $this->assertEquals('John Doe', $order->customer_name);
        $this->assertEquals(21999000, $order->unit_price);
        $this->assertGreaterThan(21999000, $order->total_price);
        $this->assertLessThanOrEqual(21999000 + 999, $order->total_price);
        $this->assertEquals('Garansi Resmi SEIN (1 Tahun)', $order->warranty_type);
        $this->assertNotNull($order->expires_at);

        // Check stock decremented
        $this->assertEquals(9, $this->variant->fresh()->stock);

        // Check mail sent
        Mail::assertSent(OrderInvoiceMail::class, function ($mail) use ($order) {
            return $mail->hasTo('john@example.com') && $mail->order->id === $order->id;
        });

        $response->assertRedirect(route('orders.show', ['order_code' => $order->order_code]));
    }

    public function test_user_can_place_order_with_pickup(): void
    {
        Mail::fake();

        $payload = [
            'variant_id' => $this->variant->id,
            'quantity' => 2,
            'customer_name' => 'Jane Smith',
            'customer_email' => 'jane@example.com',
            'customer_phone' => '089876543210',
            'fulfillment_method' => 'pickup',
            'pickup_store' => 'Samsung Experience Store - Grand Indonesia (East Mall Lt. 3)',
            'payment_method' => 'va_bca',
        ];

        $response = $this->post(route('orders.store'), $payload);

        $order = Order::first();
        $this->assertNotNull($order);
        $this->assertEquals('pickup', $order->fulfillment_method);
        $this->assertEquals('Samsung Experience Store - Grand Indonesia (East Mall Lt. 3)', $order->pickup_store);
        $this->assertEquals(8, $this->variant->fresh()->stock);

        $response->assertRedirect(route('orders.show', ['order_code' => $order->order_code]));
    }

    public function test_checkout_fails_if_stock_is_insufficient(): void
    {
        $this->variant->update(['stock' => 1]);

        $payload = [
            'variant_id' => $this->variant->id,
            'quantity' => 2,
            'customer_name' => 'Jane Smith',
            'customer_email' => 'jane@example.com',
            'customer_phone' => '089876543210',
            'fulfillment_method' => 'pickup',
            'pickup_store' => 'Samsung Experience Store - Grand Indonesia (East Mall Lt. 3)',
            'payment_method' => 'va_bca',
        ];

        $response = $this->post(route('orders.store'), $payload);

        $response->assertSessionHasErrors(['variant_id']);
        $this->assertEquals(0, Order::count());
        $this->assertEquals(1, $this->variant->fresh()->stock);
    }

    public function test_checkout_validates_required_fields(): void
    {
        $response = $this->post(route('orders.store'), []);

        $response->assertSessionHasErrors([
            'variant_id',
            'quantity',
            'customer_name',
            'customer_email',
            'customer_phone',
            'fulfillment_method',
            'payment_method',
        ]);
    }

    public function test_invoice_page_renders_with_order_details(): void
    {
        $order = Order::create([
            'variant_id' => $this->variant->id,
            'warranty_type' => 'Garansi Resmi SEIN (1 Tahun)',
            'order_code' => 'INV-202610-TEST01',
            'quantity' => 1,
            'unit_price' => 21999000,
            'unique_code' => 521,
            'total_price' => 21999521,
            'customer_name' => 'Alice',
            'customer_email' => 'alice@example.com',
            'customer_phone' => '081122334455',
            'fulfillment_method' => 'delivery',
            'shipping_province' => 'Jawa Barat',
            'shipping_city' => 'Bandung',
            'shipping_district' => 'Coblong',
            'shipping_postal_code' => '40132',
            'shipping_address' => 'Jl. Dago No. 50',
            'payment_method' => 'va_bca',
            'status' => 'pending',
            'expires_at' => now()->addHours(24),
        ]);

        $response = $this->get(route('orders.show', ['order_code' => $order->order_code]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Invoice')
            ->has('order')
            ->where('order.order_code', 'INV-202610-TEST01')
            ->has('paymentDetails')
            ->where('paymentDetails.virtual_account', fn ($va) => ! empty($va))
        );
    }

    public function test_public_tracking_works_with_order_code_and_email_or_phone(): void
    {
        $order = Order::create([
            'variant_id' => $this->variant->id,
            'warranty_type' => 'Garansi Resmi SEIN (1 Tahun)',
            'order_code' => 'INV-202610-TEST02',
            'quantity' => 1,
            'unit_price' => 21999000,
            'unique_code' => 312,
            'total_price' => 21999312,
            'customer_name' => 'Bob',
            'customer_email' => 'bob@example.com',
            'customer_phone' => '082233445566',
            'fulfillment_method' => 'delivery',
            'shipping_province' => 'Jawa Timur',
            'shipping_city' => 'Surabaya',
            'shipping_district' => 'Tegalsari',
            'shipping_postal_code' => '60262',
            'shipping_address' => 'Jl. Basuki Rahmat No. 12',
            'payment_method' => 'qris',
            'status' => 'processing',
        ]);

        // Search using email
        $responseEmail = $this->get(route('orders.track', [
            'order_code' => 'INV-202610-TEST02',
            'contact' => 'bob@example.com',
        ]));

        $responseEmail->assertOk();
        $responseEmail->assertInertia(fn (Assert $page) => $page
            ->component('TrackOrder')
            ->where('order.order_code', 'INV-202610-TEST02')
            ->where('order.status', 'processing')
        );

        // Search using phone
        $responsePhone = $this->get(route('orders.track', [
            'order_code' => 'INV-202610-TEST02',
            'contact' => '082233445566',
        ]));

        $responsePhone->assertOk();
        $responsePhone->assertInertia(fn (Assert $page) => $page
            ->component('TrackOrder')
            ->where('order.order_code', 'INV-202610-TEST02')
        );

        // Search with wrong contact
        $responseWrong = $this->get(route('orders.track', [
            'order_code' => 'INV-202610-TEST02',
            'contact' => 'wrong@example.com',
        ]));

        $responseWrong->assertOk();
        $responseWrong->assertInertia(fn (Assert $page) => $page
            ->component('TrackOrder')
            ->where('order', null)
            ->where('searched', true)
        );
    }

    public function test_cancel_expired_orders_command_cancels_and_restores_stock(): void
    {
        $this->variant->update(['stock' => 5]);

        $expiredOrder = Order::create([
            'variant_id' => $this->variant->id,
            'order_code' => 'INV-202610-EXPIRED',
            'quantity' => 2,
            'unit_price' => 21999000,
            'unique_code' => 123,
            'total_price' => 43998123,
            'customer_name' => 'Charlie',
            'customer_email' => 'charlie@example.com',
            'customer_phone' => '085544332211',
            'fulfillment_method' => 'delivery',
            'payment_method' => 'va_bca',
            'status' => 'pending',
            'expires_at' => now()->subHour(), // Expired 1 hour ago
        ]);

        $this->artisan('orders:cancel-expired')
            ->expectsOutputToContain('1 pesanan berhasil dibatalkan')
            ->assertSuccessful();

        $this->assertEquals('cancelled', $expiredOrder->fresh()->status);
        $this->assertEquals(7, $this->variant->fresh()->stock); // Stock restored: 5 + 2 = 7
    }

    public function test_ship_order_command_records_tracking_and_imei(): void
    {
        $order = Order::create([
            'variant_id' => $this->variant->id,
            'order_code' => 'INV-202610-SHIPME',
            'quantity' => 1,
            'unit_price' => 21999000,
            'unique_code' => 444,
            'total_price' => 21999444,
            'customer_name' => 'David',
            'customer_email' => 'david@example.com',
            'customer_phone' => '087788990011',
            'fulfillment_method' => 'delivery',
            'payment_method' => 'qris',
            'status' => 'paid',
        ]);

        $this->artisan('order:ship', [
            'order_code' => 'INV-202610-SHIPME',
            '--resi' => 'JNE-SEIN-998877',
            '--imei' => '358912345678901',
        ])->assertSuccessful();

        $fresh = $order->fresh();
        $this->assertEquals('shipped', $fresh->status);
        $this->assertEquals('JNE-SEIN-998877', $fresh->tracking_number);
        $this->assertEquals('358912345678901', $fresh->imei);
        $this->assertNotNull($fresh->shipped_at);
    }

    public function test_confirm_payment_command_marks_order_as_paid(): void
    {
        $order = Order::create([
            'variant_id' => $this->variant->id,
            'order_code' => 'INV-202610-PAYME',
            'quantity' => 1,
            'unit_price' => 21999000,
            'unique_code' => 555,
            'total_price' => 21999555,
            'customer_name' => 'Emma',
            'customer_email' => 'emma@example.com',
            'customer_phone' => '083322110099',
            'fulfillment_method' => 'pickup',
            'pickup_store' => 'Samsung Experience Store - Grand Indonesia (East Mall Lt. 3)',
            'payment_method' => 'va_bca',
            'status' => 'pending',
            'expires_at' => now()->addHours(24),
        ]);

        $this->artisan('order:confirm-payment', [
            'order_code' => 'INV-202610-PAYME',
        ])->assertSuccessful();

        $fresh = $order->fresh();
        $this->assertEquals('paid', $fresh->status);
        $this->assertNotNull($fresh->paid_at);
    }
}
