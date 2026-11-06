<?php

namespace App\Http\Controllers;

use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display the Clean White Discovery Homepage (Apple Store Showcase style).
     */
    public function index(Request $request): Response
    {
        $cachedData = Cache::remember('store_homepage_data_v1', 3600, function () {
            $allVariants = ProductVariant::orderBy('price', 'asc')->get();

            $models = [
                [
                    'id' => 'samsung-galaxy-s26-ultra',
                    'name' => 'Samsung Galaxy S26 Ultra 5G',
                    'series' => 'Galaxy S26 Series',
                    'tagline' => 'Titanium. Presisi Tanpa Kompromi.',
                    'description' => 'Kamera 200MP Quad-Tele, Snapdragon 8 Elite 3nm, dan S-Pen terintegrasi.',
                    'starting_price' => $allVariants->where('series', 'Galaxy S26 Series')->min('price') ?? 21999000,
                    'hero_image' => '/images/products/s26-ultra-silver.svg',
                    'front_image' => '/images/products/s26-ultra-front.svg',
                    'buy_url' => route('products.buy', ['slug' => 'samsung-galaxy-s26-ultra']),
                    'colors' => [
                        ['name' => 'Titanium Silver Shadow', 'hex' => '#8c959e', 'image' => '/images/products/s26-ultra-silver.svg'],
                        ['name' => 'Titanium Phantom Black', 'hex' => '#161719', 'image' => '/images/products/s26-ultra-black.svg'],
                        ['name' => 'Titanium Cobalt Violet', 'hex' => '#3b334a', 'image' => '/images/products/s26-ultra-violet.svg'],
                        ['name' => 'Titanium Amber Gold', 'hex' => '#c8b590', 'image' => '/images/products/s26-ultra-gold.svg'],
                    ],
                    'specs' => [
                        'Layar' => '6.9" Dynamic AMOLED 2X 120Hz',
                        'Prosesor' => 'Snapdragon 8 Elite (3nm)',
                        'Kamera' => '200MP Quad-Tele 5x & 10x Optical',
                        'Baterai' => '5.000 mAh Fast Charge 45W',
                    ],
                ],
                [
                    'id' => 'samsung-galaxy-z-fold8',
                    'name' => 'Samsung Galaxy Z Fold8 5G',
                    'series' => 'Galaxy Z Fold8 Series',
                    'tagline' => 'Layar Lipat 8.0 Inci. Multitasking Tanpa Batas.',
                    'description' => 'Dual Dynamic AMOLED 2X dengan Armor Hinge tertipis dan Flex Mode generasi terbaru.',
                    'starting_price' => $allVariants->where('series', 'Galaxy Z Fold8 Series')->min('price') ?? 26999000,
                    'hero_image' => '/images/products/zfold8-black.svg',
                    'front_image' => '/images/products/zfold8-front.svg',
                    'buy_url' => route('products.buy', ['slug' => 'samsung-galaxy-z-fold8']),
                    'colors' => [
                        ['name' => 'Crafted Black', 'hex' => '#121316', 'image' => '/images/products/zfold8-black.svg'],
                        ['name' => 'Silver Shadow', 'hex' => '#94a3b8', 'image' => '/images/products/zfold8-silver.svg'],
                    ],
                    'specs' => [
                        'Layar Utama' => '8.0" Dynamic AMOLED 2X 120Hz',
                        'Layar Cover' => '6.5" Dynamic AMOLED 2X',
                        'Prosesor' => 'Snapdragon 8 Elite (3nm)',
                        'Durabilitas' => 'Armor Aluminum & IP48 Water Resistant',
                    ],
                ],
            ];

            return [
                'models' => $models,
                'variants' => $allVariants,
            ];
        });

        return Inertia::render('Home', [
            'models' => $cachedData['models'],
            'variants' => $cachedData['variants'],
            'appName' => config('app.name', 'Samsung Official Partner'),
        ]);
    }

    /**
     * Display the Dedicated Buy Studio for a specific product.
     */
    public function buy(Request $request, string $slug): Response
    {
        $isFold = str_contains(strtolower($slug), 'fold');
        $series = $isFold ? 'Galaxy Z Fold8 Series' : 'Galaxy S26 Series';
        $productName = $isFold ? 'Samsung Galaxy Z Fold8 5G' : 'Samsung Galaxy S26 Ultra 5G';
        $frontImage = $isFold ? '/images/products/zfold8-front.svg' : '/images/products/s26-ultra-front.svg';

        $variants = Cache::remember("store_variants_{$series}", 3600, function () use ($series) {
            $result = ProductVariant::where('series', $series)
                ->orderBy('price', 'asc')
                ->get();

            if ($result->isEmpty()) {
                return ProductVariant::orderBy('price', 'asc')->get();
            }

            return $result;
        });

        $pickupStores = [
            'Samsung Experience Store - Grand Indonesia (East Mall Lt. 3)',
            'Samsung Experience Store - Central Park Mall (Lt. L-2)',
            'Samsung Experience Store - Pondok Indah Mall 3 (Lt. 2)',
            'Samsung Experience Store - Senayan City (Lt. 4)',
            'Samsung Experience Store - Kota Kasablanka (Lt. LG)',
            'Samsung Experience Store - Paris Van Java Bandung (Glamour Level)',
            'Samsung Experience Store - Tunjungan Plaza 6 Surabaya (Lt. 3)',
            'Samsung Experience Store - Pakuwon Mall Surabaya (Lt. 1)',
        ];

        $authUser = $request->user() ? [
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
        ] : null;

        return Inertia::render('Buy', [
            'slug' => $slug,
            'productName' => $productName,
            'series' => $series,
            'frontImage' => $frontImage,
            'variants' => $variants,
            'pickupStores' => $pickupStores,
            'authUser' => $authUser,
            'appName' => config('app.name', 'Samsung Official Partner'),
        ]);
    }
}
