<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// Discovery Homepage (Apple Store Showcase style)
Route::get('/', [ProductController::class, 'index'])->name('products.index');

// Dedicated Buy Studio (Variant configurator & checkout)
Route::get('/buy/{slug}', [ProductController::class, 'buy'])->name('products.buy');

// One-Page Checkout with anti-spam throttle (5 requests per 1 minute)
Route::post('/checkout', [OrderController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('orders.store');

// Order invoice and simulated payment instructions
Route::get('/invoice/{order_code}', [OrderController::class, 'show'])->name('orders.show');

// Public order status tracking
Route::get('/track', [OrderController::class, 'track'])->name('orders.track');
