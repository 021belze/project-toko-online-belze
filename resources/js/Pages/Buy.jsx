import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Buy({
    slug,
    productName,
    series,
    frontImage,
    variants,
    pickupStores = [],
    authUser = null,
    appName = 'Samsung Official Partner',
}) {
    // Determine initial variant
    const defaultVariant = variants[0] || null;

    // View angle: 'back' (chassis finish) or 'front' (AMOLED display)
    const [viewAngle, setViewAngle] = useState('back');

    // Form setup with Inertia useForm
    const { data, setData, post, processing, errors } = useForm({
        variant_id: defaultVariant?.id || '',
        quantity: 1,
        customer_name: authUser?.name || '',
        customer_email: authUser?.email || '',
        customer_phone: '',
        fulfillment_method: 'pickup',
        pickup_store: pickupStores[0] || '',
        shipping_province: '',
        shipping_city: '',
        shipping_district: '',
        shipping_postal_code: '',
        shipping_address: '',
        payment_method: 'qris',
    });

    // Currently selected variant object
    const selectedVariant =
        variants.find((v) => v.id === parseInt(data.variant_id)) || defaultVariant;

    // Distinct colors for this product
    const colors = [];
    const seenColors = new Set();
    for (const v of variants) {
        if (!seenColors.has(v.color_name)) {
            seenColors.add(v.color_name);
            colors.push({
                name: v.color_name,
                hex: v.color_hex,
                image: v.image_url,
            });
        }
    }

    // Available storage options for the currently selected color
    const storageOptions = variants.filter(
        (v) => v.color_name === (selectedVariant?.color_name || colors[0]?.name)
    );

    // Color switch handler (tries to preserve selected storage)
    const handleColorChange = (colorName) => {
        const match =
            variants.find(
                (v) => v.color_name === colorName && v.storage === selectedVariant?.storage
            ) || variants.find((v) => v.color_name === colorName);

        if (match) {
            setData('variant_id', match.id);
        }
    };

    // Storage switch handler
    const handleStorageChange = (variantId) => {
        setData('variant_id', variantId);
    };

    // Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    // Submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/checkout');
    };

    const isFold = slug?.includes('fold');

    return (
        <div className="min-h-screen bg-white text-[#111111] antialiased selection:bg-[#2189FF] selection:text-white">
            <Head title={`Beli ${productName} - Samsung Authorized Reseller`} />

            {/* Top Bar Navigation */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
                <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center group py-1">
                                <img
                                    src="/images/logo/galax-lockup.svg"
                                    alt="Galax — Samsung Authorized Reseller"
                                    className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                                />
                            </Link>
                            <span className="hidden sm:inline text-gray-300 self-center">/</span>
                            <span className="hidden sm:inline text-sm font-semibold text-gray-900 self-center">
                                Studio Pembelian
                            </span>
                        </div>

                        {/* Model Switcher Tabs */}
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full border border-gray-200 text-xs font-semibold">
                            <Link
                                href="/buy/samsung-galaxy-s26-ultra"
                                className={`px-3.5 py-1.5 rounded-full transition-all ${
                                    !isFold
                                        ? 'bg-white text-gray-900 shadow-xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Galaxy S26 Ultra
                            </Link>
                            <Link
                                href="/buy/samsung-galaxy-z-fold8"
                                className={`px-3.5 py-1.5 rounded-full transition-all ${
                                    isFold
                                        ? 'bg-white text-gray-900 shadow-xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Galaxy Z Fold8
                            </Link>
                        </div>

                        {/* Quick Exit to Discovery */}
                        <Link
                            href="/"
                            className="text-xs sm:text-sm font-medium text-gray-600 hover:text-[#1428A0] transition-colors"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Studio Two-Column Split Layout */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                    {/* LEFT COLUMN: STICKY INTERACTIVE PRODUCT SHOWCASE */}
                    <div className="w-full lg:w-7/12 lg:sticky lg:top-24 flex flex-col items-center">
                        {/* View Angle Switcher */}
                        <div className="mb-6 inline-flex p-1 bg-gray-100 rounded-full border border-gray-200 text-xs font-medium text-gray-700">
                            <button
                                type="button"
                                onClick={() => setViewAngle('back')}
                                className={`px-4 py-1.5 rounded-full transition-all ${
                                    viewAngle === 'back'
                                        ? 'bg-white text-gray-950 font-semibold shadow-xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Tampak Belakang (Chassis)
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewAngle('front')}
                                className={`px-4 py-1.5 rounded-full transition-all ${
                                    viewAngle === 'front'
                                        ? 'bg-white text-gray-950 font-semibold shadow-xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Tampak Depan (Layar AMOLED)
                            </button>
                        </div>

                        {/* Device Vector Mockup */}
                        <div className="relative w-full max-w-md h-[300px] sm:h-[350px] flex items-center justify-center p-4">
                            <img
                                src={viewAngle === 'back' ? selectedVariant?.image_url : frontImage}
                                alt={`${productName} - ${selectedVariant?.color_name}`}
                                className="max-w-full max-h-full object-contain transition-all duration-300 drop-shadow-md"
                            />
                        </div>

                        {/* Natural Ground Contact Shadow */}
                        <div className="w-3/4 max-w-sm h-6 bg-gradient-to-r from-transparent via-black/15 to-transparent blur-md rounded-full -mt-2"></div>

                        {/* Active Configuration Summary Pill */}
                        <div className="mt-6 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-700">
                                <span
                                    className="w-3 h-3 rounded-full border border-black/20"
                                    style={{ backgroundColor: selectedVariant?.color_hex }}
                                ></span>
                                <span className="font-semibold text-gray-900">
                                    {selectedVariant?.color_name}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span>{selectedVariant?.storage}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-emerald-700 font-medium">Garansi Resmi SEIN</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PROGRESSIVE STEP-BY-STEP CONFIGURATOR */}
                    <div className="w-full lg:w-5/12">
                        {/* Title and Trust Badge */}
                        <div className="border-b border-gray-200 pb-5 mb-6">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold mb-2.5">
                                <span>✓</span>
                                Unit Resmi SEIN 100% Original
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
                                Konfigurasi {productName}
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1.5">
                                Sesuaikan warna bodi, kapasitas memori, dan pilih metode pengambilan barang di toko atau pengiriman berasuransi.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* STEP 1: PILIH WARNA FINIS */}
                            <section>
                                <div className="flex items-center justify-between mb-2.5">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                                        1. Pilih Warna Finis
                                    </h2>
                                    <span className="text-xs font-medium text-gray-600">
                                        Warna:{' '}
                                        <strong className="text-gray-900 font-semibold">
                                            {selectedVariant?.color_name}
                                        </strong>
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {colors.map((color) => {
                                        const isSelected = selectedVariant?.color_name === color.name;
                                        return (
                                            <button
                                                key={color.name}
                                                type="button"
                                                onClick={() => handleColorChange(color.name)}
                                                className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                                                    isSelected
                                                        ? 'border-[#2189FF] bg-blue-50/40 ring-1 ring-[#2189FF] shadow-2xs'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                            >
                                                <span
                                                    className={`w-5 h-5 rounded-full flex-shrink-0 border ${
                                                        isSelected
                                                            ? 'ring-2 ring-offset-1 ring-[#2189FF]'
                                                            : 'border-black/20'
                                                    }`}
                                                    style={{ backgroundColor: color.hex }}
                                                ></span>
                                                <span className="text-xs font-semibold text-gray-900 truncate">
                                                    {color.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* STEP 2: PILIH KAPASITAS MEMORI & PENYIMPANAN */}
                            <section>
                                <div className="flex items-center justify-between mb-2.5">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                                        2. Pilih Kapasitas Memori & Penyimpanan
                                    </h2>
                                    <span className="text-[11px] text-gray-500">Harga Resmi SEIN</span>
                                </div>
                                <div className="space-y-2.5">
                                    {storageOptions.map((opt) => {
                                        const isSelected = selectedVariant?.id === opt.id;
                                        const isOutOfStock = opt.stock <= 0;
                                        const isLowStock = opt.stock > 0 && opt.stock <= 5;

                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                disabled={isOutOfStock}
                                                onClick={() => handleStorageChange(opt.id)}
                                                className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                                                    isOutOfStock
                                                        ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                                                        : isSelected
                                                        ? 'border-[#2189FF] bg-blue-50/40 ring-1 ring-[#2189FF] shadow-2xs'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base font-bold text-gray-900">
                                                            {opt.storage}
                                                        </span>
                                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                            RAM {opt.ram}
                                                        </span>
                                                        {isOutOfStock ? (
                                                            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                                                Habis
                                                            </span>
                                                        ) : isLowStock ? (
                                                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                                Sisa {opt.stock} unit
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                                                Stok Tersedia
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        SKU: {opt.sku}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-base font-bold text-gray-900">
                                                        {formatRupiah(opt.price)}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* STEP 3: METODE PENGAMBILAN BARANG */}
                            <section>
                                <div className="mb-2.5">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                                        3. Metode Pengambilan Barang
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                                    <button
                                        type="button"
                                        onClick={() => setData('fulfillment_method', 'pickup')}
                                        className={`p-3 rounded-lg border text-left transition-all ${
                                            data.fulfillment_method === 'pickup'
                                                ? 'border-[#2189FF] bg-blue-50/40 ring-1 ring-[#2189FF] shadow-2xs'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                    >
                                        <div className="text-xs sm:text-sm font-bold text-gray-900">
                                            Ambil di Gerai SES
                                        </div>
                                        <div className="text-[11px] text-gray-500 mt-0.5">
                                            Siap dalam 2 jam (Gratis)
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('fulfillment_method', 'delivery')}
                                        className={`p-3 rounded-lg border text-left transition-all ${
                                            data.fulfillment_method === 'delivery'
                                                ? 'border-[#2189FF] bg-blue-50/40 ring-1 ring-[#2189FF] shadow-2xs'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                    >
                                        <div className="text-xs sm:text-sm font-bold text-gray-900">
                                            Kirim ke Alamat
                                        </div>
                                        <div className="text-[11px] text-gray-500 mt-0.5">
                                            Kemasan kayu + asuransi
                                        </div>
                                    </button>
                                </div>

                                {/* Pickup Store Dropdown */}
                                {data.fulfillment_method === 'pickup' && (
                                    <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-2.5">
                                        <label
                                            htmlFor="pickup_store"
                                            className="block text-[11px] font-semibold uppercase tracking-wider text-gray-700"
                                        >
                                            Pilih Cabang Samsung Experience Store (SES):
                                        </label>
                                        <select
                                            id="pickup_store"
                                            value={data.pickup_store}
                                            onChange={(e) => setData('pickup_store', e.target.value)}
                                            className="w-full rounded-md border-gray-300 bg-white text-xs focus:border-[#2189FF] focus:ring-[#2189FF] py-2 px-3"
                                        >
                                            {pickupStores.map((store) => (
                                                <option key={store} value={store}>
                                                    {store}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-[11px] text-gray-500 leading-normal">
                                            Pemberitahuan nomor pengambilan dan verifikasi akan dikirimkan langsung ke nomor WhatsApp dan email pemesan.
                                        </p>
                                    </div>
                                )}

                                {/* Delivery Address Inputs */}
                                {data.fulfillment_method === 'delivery' && (
                                    <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-2.5">
                                        <div>
                                            <label
                                                htmlFor="shipping_address"
                                                className="block text-xs font-semibold text-gray-700 mb-1"
                                            >
                                                Alamat Lengkap & Nomor Rumah
                                            </label>
                                            <textarea
                                                id="shipping_address"
                                                rows="2"
                                                value={data.shipping_address}
                                                onChange={(e) => setData('shipping_address', e.target.value)}
                                                placeholder="Contoh: Jl. Sudirman No. 10, RT 02 / RW 05"
                                                className="w-full rounded-md border-gray-300 bg-white text-xs focus:border-[#2189FF] focus:ring-[#2189FF] py-2 px-3"
                                                required
                                            ></textarea>
                                            {errors.shipping_address && (
                                                <p className="text-xs text-rose-600 mt-1">{errors.shipping_address}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div>
                                                <label
                                                    htmlFor="shipping_province"
                                                    className="block text-[11px] font-semibold text-gray-700 mb-1"
                                                >
                                                    Provinsi
                                                </label>
                                                <input
                                                    id="shipping_province"
                                                    type="text"
                                                    value={data.shipping_province}
                                                    onChange={(e) => setData('shipping_province', e.target.value)}
                                                    placeholder="DKI Jakarta"
                                                    className="w-full rounded-md border-gray-300 bg-white text-xs focus:border-[#2189FF] focus:ring-[#2189FF] py-2 px-3"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="shipping_city"
                                                    className="block text-[11px] font-semibold text-gray-700 mb-1"
                                                >
                                                    Kota / Kabupaten
                                                </label>
                                                <input
                                                    id="shipping_city"
                                                    type="text"
                                                    value={data.shipping_city}
                                                    onChange={(e) => setData('shipping_city', e.target.value)}
                                                    placeholder="Jakarta Selatan"
                                                    className="w-full rounded-md border-gray-300 bg-white text-xs focus:border-[#2189FF] focus:ring-[#2189FF] py-2 px-3"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div>
                                                <label
                                                    htmlFor="shipping_district"
                                                    className="block text-[11px] font-semibold text-gray-700 mb-1"
                                                >
                                                    Kecamatan
                                                </label>
                                                <input
                                                    id="shipping_district"
                                                    type="text"
                                                    value={data.shipping_district}
                                                    onChange={(e) => setData('shipping_district', e.target.value)}
                                                    placeholder="Kebayoran Baru"
                                                    className="w-full rounded-md border-gray-300 bg-white text-xs focus:border-[#2189FF] focus:ring-[#2189FF] py-2 px-3"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="shipping_postal_code"
                                                    className="block text-[11px] font-semibold text-gray-700 mb-1"
                                                >
                                                    Kode Pos
                                                </label>
                                                <input
                                                    id="shipping_postal_code"
                                                    type="text"
                                                    value={data.shipping_postal_code}
                                                    onChange={(e) => setData('shipping_postal_code', e.target.value)}
                                                    placeholder="12180"
                                                    className="w-full rounded-md border-gray-300 bg-white text-xs focus:border-[#2189FF] focus:ring-[#2189FF] py-2 px-3"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* STEP 4: DATA PEMESAN & PEMBAYARAN */}
                            <section>
                                <div className="mb-2.5">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                                        4. Data Pemesan & Pembayaran
                                    </h2>
                                </div>
                                <div className="space-y-2.5">
                                    <div>
                                        <label
                                            htmlFor="customer_name"
                                            className="block text-xs font-semibold text-gray-700 mb-1"
                                        >
                                            Nama Lengkap (Sesuai KTP untuk klaim garansi)
                                        </label>
                                        <input
                                            id="customer_name"
                                            type="text"
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            placeholder="Contoh: Budi Santoso"
                                            className="w-full rounded-md border-gray-300 bg-white text-xs focus:border-[#2189FF] focus:ring-[#2189FF] py-2 px-3"
                                            required
                                        />
                                        {errors.customer_name && (
                                            <p className="text-xs text-rose-600 mt-1">{errors.customer_name}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <div>
                                            <label
                                                htmlFor="customer_phone"
                                                className="block text-xs font-semibold text-gray-700 mb-1"
                                            >
                                                Nomor WhatsApp Aktif
                                            </label>
                                            <input
                                                id="customer_phone"
                                                type="tel"
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                                placeholder="081234567890"
                                                className="w-full rounded-md border-gray-300 bg-white text-xs focus:border-[#2189FF] focus:ring-[#2189FF] py-2 px-3"
                                                required
                                            />
                                            {errors.customer_phone && (
                                                <p className="text-xs text-rose-600 mt-1">{errors.customer_phone}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="customer_email"
                                                className="block text-xs font-semibold text-gray-700 mb-1"
                                            >
                                                Email Pengiriman Faktur
                                            </label>
                                            <input
                                                id="customer_email"
                                                type="email"
                                                value={data.customer_email}
                                                onChange={(e) => setData('customer_email', e.target.value)}
                                                placeholder="budi@example.com"
                                                className="w-full rounded-md border-gray-300 bg-white text-xs focus:border-[#2189FF] focus:ring-[#2189FF] py-2 px-3"
                                                required
                                            />
                                            {errors.customer_email && (
                                                <p className="text-xs text-rose-600 mt-1">{errors.customer_email}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Payment Method Selector */}
                                    <div className="pt-1.5">
                                        <label
                                            htmlFor="payment_method"
                                            className="block text-xs font-semibold text-gray-700 mb-2"
                                        >
                                            Pilih Metode Pembayaran Resmi:
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {[
                                                { id: 'qris', name: 'QRIS', desc: 'BCA, Mandiri, GoPay, OVO, DANA' },
                                                { id: 'va_bca', name: 'BCA Virtual Account', desc: 'Verifikasi instan otomatis' },
                                                { id: 'va_mandiri', name: 'Mandiri Virtual Account', desc: 'Verifikasi instan otomatis' },
                                                { id: 'va_bni', name: 'BNI Virtual Account', desc: 'Verifikasi instan otomatis' },
                                                { id: 'va_bri', name: 'BRI Virtual Account', desc: 'Verifikasi instan otomatis' },
                                            ].map((m) => {
                                                const isSelected = data.payment_method === m.id;
                                                return (
                                                    <button
                                                        key={m.id}
                                                        type="button"
                                                        onClick={() => setData('payment_method', m.id)}
                                                        className={`p-2.5 rounded-lg border text-left transition-all ${
                                                            isSelected
                                                                ? 'border-[#2189FF] bg-blue-50/40 ring-1 ring-[#2189FF] shadow-2xs'
                                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                        }`}
                                                    >
                                                        <div className="text-xs font-bold text-gray-900">{m.name}</div>
                                                        <div className="text-[11px] text-gray-500 mt-0.5">{m.desc}</div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* ORDER SUMMARY & SUBMIT */}
                            <div className="p-4 sm:p-5 rounded-lg bg-gray-50 border border-gray-200 space-y-3.5">
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Perangkat</span>
                                        <span className="font-medium text-gray-900">{productName}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Varian</span>
                                        <span className="font-medium text-gray-900">
                                            {selectedVariant?.color_name} ({selectedVariant?.storage})
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Garansi Purna Jual</span>
                                        <span className="font-medium text-emerald-700">Resmi SEIN 1 Tahun</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Pengambilan</span>
                                        <span className="font-medium text-gray-900">
                                            {data.fulfillment_method === 'pickup' ? 'Ambil di Gerai SES' : 'Kirim Berasuransi'}
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                                        <span className="text-xs sm:text-sm font-bold text-gray-900">Total Pembayaran</span>
                                        <span className="text-lg font-bold text-[#1428A0]">
                                            {formatRupiah(selectedVariant?.price || 0)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !selectedVariant || selectedVariant?.stock <= 0}
                                    className={`w-full py-3 px-5 rounded-full text-sm font-semibold text-white shadow-2xs transition-all ${
                                        processing || !selectedVariant || selectedVariant?.stock <= 0
                                            ? 'opacity-60 cursor-not-allowed bg-gray-400'
                                            : 'bg-[#2189FF] hover:bg-[#1a70d4] hover:shadow-xs'
                                    }`}
                                >
                                    {processing ? 'Memproses Pesanan Resmi...' : 'Selesaikan Pemesanan & Dapatkan Faktur'}
                                </button>
                                <p className="text-[11px] text-center text-gray-500">
                                    Faktur resmi dan nomor rekening pembayaran virtual diterbitkan langsung setelah konfirmasi.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
