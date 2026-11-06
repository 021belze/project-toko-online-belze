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
        Schema::table('orders', function (Blueprint $table): void {
            $table->string('warranty_type', 50)->default('Garansi Resmi SEIN')->after('variant_id');
            $table->decimal('insurance_fee', 12, 2)->default(0)->after('unique_code');
            $table->string('imei', 20)->nullable()->after('tracking_number');
            $table->string('serial_number', 50)->nullable()->after('imei');
            $table->timestamp('expires_at')->nullable()->after('updated_at');
            $table->timestamp('paid_at')->nullable()->after('expires_at');
            $table->timestamp('shipped_at')->nullable()->after('paid_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->dropColumn([
                'warranty_type',
                'insurance_fee',
                'imei',
                'serial_number',
                'expires_at',
                'paid_at',
                'shipped_at',
            ]);
        });
    }
};
