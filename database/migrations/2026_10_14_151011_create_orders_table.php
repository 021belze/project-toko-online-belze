<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('variant_id')->constrained('product_variants')->cascadeOnDelete();
            $table->string('order_code', 30)->unique();
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('unit_price', 12, 2);
            $table->unsignedInteger('unique_code');
            $table->decimal('total_price', 12, 2);
            $table->string('customer_name', 100);
            $table->string('customer_email', 100);
            $table->string('customer_phone', 25);
            $table->enum('fulfillment_method', ['delivery', 'pickup']);
            $table->string('pickup_store', 100)->nullable();
            $table->string('shipping_province', 100)->nullable();
            $table->string('shipping_city', 100)->nullable();
            $table->string('shipping_district', 100)->nullable();
            $table->string('shipping_postal_code', 10)->nullable();
            $table->text('shipping_address')->nullable();
            $table->string('payment_method', 50);
            $table->enum('status', ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'])->default('pending');
            $table->string('tracking_number', 50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
