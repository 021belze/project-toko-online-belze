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
        Schema::table('product_variants', function (Blueprint $table): void {
            $table->string('product_name', 100)->default('Galaxy S26 Ultra 5G')->after('id');
            $table->string('series', 50)->default('Galaxy S26 Series')->after('product_name');
            $table->string('warranty_type', 50)->default('Garansi Resmi SEIN (1 Tahun)')->after('storage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table): void {
            $table->dropColumn(['product_name', 'series', 'warranty_type']);
        });
    }
};
