<?php

namespace Database\Seeders;

use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class ProductVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'product_name' => 'Samsung Galaxy S26 Ultra 5G',
                'series' => 'Galaxy S26 Series',
                'model_code' => 'SM-S26U',
                'colors' => [
                    [
                        'name' => 'Titanium Silver Shadow',
                        'hex' => '#8c959e',
                        'code' => 'SLV',
                        'image' => '/images/products/s26-ultra.png',
                    ],
                    [
                        'name' => 'Titanium Phantom Black',
                        'hex' => '#161719',
                        'code' => 'BLK',
                        'image' => '/images/products/s26-ultra.png',
                    ],
                    [
                        'name' => 'Titanium Cobalt Violet',
                        'hex' => '#3b334a',
                        'code' => 'VLT',
                        'image' => '/images/products/s26-ultra.png',
                    ],
                    [
                        'name' => 'Titanium Amber Gold',
                        'hex' => '#c8b590',
                        'code' => 'GLD',
                        'image' => '/images/products/s26-ultra.png',
                    ],
                ],
                'configurations' => [
                    [
                        'ram' => '12GB',
                        'storage' => '256GB',
                        'price' => 21999000,
                        'stock_map' => ['SLV' => 15, 'BLK' => 18, 'VLT' => 8, 'GLD' => 10],
                    ],
                    [
                        'ram' => '12GB',
                        'storage' => '512GB',
                        'price' => 24499000,
                        'stock_map' => ['SLV' => 12, 'BLK' => 14, 'VLT' => 4, 'GLD' => 7], // VLT 4 (Stok Terbatas)
                    ],
                    [
                        'ram' => '16GB',
                        'storage' => '1TB',
                        'price' => 28999000,
                        'stock_map' => ['SLV' => 5, 'BLK' => 6, 'VLT' => 2, 'GLD' => 0], // GLD 0 (Habis)
                    ],
                ],
            ],
            [
                'product_name' => 'Samsung Galaxy Z Fold8 5G',
                'series' => 'Galaxy Z Fold8 Series',
                'model_code' => 'SM-F800',
                'colors' => [
                    [
                        'name' => 'Crafted Black',
                        'hex' => '#121316',
                        'code' => 'CBLK',
                        'image' => '/images/products/zfold8.png',
                    ],
                    [
                        'name' => 'Silver Shadow',
                        'hex' => '#94a3b8',
                        'code' => 'FSLV',
                        'image' => '/images/products/zfold8.png',
                    ],
                ],
                'configurations' => [
                    [
                        'ram' => '12GB',
                        'storage' => '256GB',
                        'price' => 26999000,
                        'stock_map' => ['CBLK' => 10, 'FSLV' => 8],
                    ],
                    [
                        'ram' => '16GB',
                        'storage' => '512GB',
                        'price' => 29999000,
                        'stock_map' => ['CBLK' => 7, 'FSLV' => 3], // FSLV 3 (Stok Terbatas)
                    ],
                    [
                        'ram' => '16GB',
                        'storage' => '1TB',
                        'price' => 33999000,
                        'stock_map' => ['CBLK' => 4, 'FSLV' => 0], // FSLV 0 (Habis)
                    ],
                ],
            ],
        ];

        foreach ($products as $prod) {
            foreach ($prod['colors'] as $color) {
                foreach ($prod['configurations'] as $config) {
                    $stock = $config['stock_map'][$color['code']] ?? 5;
                    $ramNum = preg_replace('/[^0-9]/', '', $config['ram']);
                    $storageNum = preg_replace('/[^0-9]/', '', $config['storage']);

                    ProductVariant::updateOrCreate(
                        [
                            'sku' => "{$prod['model_code']}-{$color['code']}-{$ramNum}-{$storageNum}",
                        ],
                        [
                            'product_name' => $prod['product_name'],
                            'series' => $prod['series'],
                            'color_name' => $color['name'],
                            'color_hex' => $color['hex'],
                            'ram' => $config['ram'],
                            'storage' => $config['storage'],
                            'warranty_type' => 'Garansi Resmi SEIN (1 Tahun)',
                            'price' => $config['price'],
                            'stock' => $stock,
                            'image_url' => $color['image'],
                        ]
                    );
                }
            }
        }
    }
}
