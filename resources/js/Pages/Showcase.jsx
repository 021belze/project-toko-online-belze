import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Showcase({ variants = [], pickupStores = [], authUser = null, appName = 'Samsung Official Partner' }) {
    // Determine unique series available
    const availableSeries = Array.from(new Set(variants.map((v) => v.series || 'Galaxy S26 Series')));
    const [selectedSeries, setSelectedSeries] = useState(availableSeries[0] || 'Galaxy S26 Series');

    // Filter variants belonging to selected series
    const seriesVariants = variants.filter((v) => (v.series || 'Galaxy S26 Series') === selectedSeries);

    // Interactive view angle: 'chassis' (tampak belakang bodi) or 'screen' (tampak depan AMOLED)
    const [viewAngle, setViewAngle] = useState('chassis');

    // Apple Store Roll-Down Navbar States
    const [isNavTrayOpen, setIsNavTrayOpen] = useState(false);
    const [scrolledPastHero, setScrolledPastHero] = useState(false);
    const navTrayTimeoutRef = useRef(null);

    // Form data with Inertia useForm
    const defaultVariant = seriesVariants[0] || variants[0];
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

    // Currently active selected variant object
    const selectedVariant = variants.find((v) => v.id === parseInt(data.variant_id)) || defaultVariant;

    // Available colors for the active series
    const colorsInSeries = [];
    const seenColors = new Set();
    for (const v of seriesVariants) {
        if (!seenColors.has(v.color_name)) {
            seenColors.add(v.color_name);
            colorsInSeries.push({
                name: v.color_name,
                hex: v.color_hex,
                image: v.image_url,
            });
        }
    }

    // Available storage configurations for current series and current color
    const storageOptions = seriesVariants.filter(
        (v) => v.color_name === (selectedVariant?.color_name || colorsInSeries[0]?.name)
    );

    // Sync variant selection when series changes
    const handleSeriesChange = (seriesName) => {
        setSelectedSeries(seriesName);
        const match = variants.find((v) => (v.series || 'Galaxy S26 Series') === seriesName);
        if (match) {
            setData('variant_id', match.id);
        }
    };

    // Color swatch click handler
    const handleColorChange = (colorName) => {
        const match = seriesVariants.find(
            (v) => v.color_name === colorName && v.storage === selectedVariant?.storage
        ) || seriesVariants.find((v) => v.color_name === colorName);

        if (match) {
            setData('variant_id', match.id);
        }
    };

    // Storage option click handler
    const handleStorageChange = (variantId) => {
        setData('variant_id', variantId);
    };

    // Apple Navbar proximity hover handlers
    const handleNavMouseEnter = () => {
        if (navTrayTimeoutRef.current) {
            clearTimeout(navTrayTimeoutRef.current);
        }
        setIsNavTrayOpen(true);
    };

    const handleNavMouseLeave = () => {
        navTrayTimeoutRef.current = setTimeout(() => {
            setIsNavTrayOpen(false);
        }, 180);
    };

    // Scroll listener for sticky sub-nav & floating buy bar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 380) {
                setScrolledPastHero(true);
            } else {
                setScrolledPastHero(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Format Indonesian Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    // Form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/checkout');
    };

    // Smooth scroll helper
    const scrollToSection = (id) => {
        setIsNavTrayOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Resolve active image asset based on angle and model
    const getActiveDisplayImage = () => {
        if (viewAngle === 'screen') {
            return selectedSeries === 'Galaxy Z Fold8 Series'
                ? '/images/products/zfold8.png'
                : '/images/products/s26-ultra.png';
        }
        return selectedVariant?.image_url || '/images/products/s26-ultra.png';
    };

    return (
        <>
            <Head title={`${selectedVariant?.product_name || 'Samsung Galaxy Flagship'} - ${appName}`}>
                <meta name="description" content="Pesan Samsung Galaxy S26 Ultra 5G dan Galaxy Z Fold8 5G Garansi Resmi SEIN. Pengambilan di gerai resmi Samsung Experience Store atau pengiriman berasuransi." />
            </Head>

            <div className="min-h-screen bg-[#07080a] text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white">

                {/* 1. APPLE STORE ROLL-DOWN TOP NAVIGATION BAR */}
                <div 
                    className="fixed top-0 inset-x-0 z-50"
                    onMouseEnter={handleNavMouseEnter}
                    onMouseLeave={handleNavMouseLeave}
                >
                    {/* Primary Top Bar */}
                    <nav className="h-12 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 transition-colors duration-200">
                        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                            {/* Brand & Partner Badge */}
                            <div className="flex items-center gap-3">
                                <span className="font-bold tracking-wider text-sm text-white">SAMSUNG</span>
                                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded">
                                    Reseller Resmi SEIN
                                </span>
                            </div>

                            {/* Centered Quick Links (Desktop) */}
                            <div className="hidden md:flex items-center gap-8 text-[13px] text-slate-300 font-medium">
                                <button 
                                    type="button" 
                                    onClick={() => handleSeriesChange('Galaxy S26 Series')}
                                    className={`transition-colors cursor-pointer ${selectedSeries === 'Galaxy S26 Series' ? 'text-white font-semibold' : 'hover:text-white'}`}
                                >
                                    Galaxy S26 Ultra
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => handleSeriesChange('Galaxy Z Fold8 Series')}
                                    className={`transition-colors cursor-pointer ${selectedSeries === 'Galaxy Z Fold8 Series' ? 'text-white font-semibold' : 'hover:text-white'}`}
                                >
                                    Galaxy Z Fold8
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => scrollToSection('specs')}
                                    className="transition-colors hover:text-white cursor-pointer"
                                >
                                    Komparasi Spesifikasi
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => scrollToSection('stores')}
                                    className="transition-colors hover:text-white cursor-pointer"
                                >
                                    Gerai SES
                                </button>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center gap-3">
                                <Link 
                                    href="/track" 
                                    className="text-xs text-slate-300 hover:text-white transition-colors px-2.5 py-1.5 rounded hover:bg-white/5"
                                >
                                    Lacak Pesanan
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => scrollToSection('configurator')}
                                    className="text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                                >
                                    Beli Sekarang
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* Apple Store Dropdown Tray (Rolls down smoothly when approached) */}
                    <div 
                        className={`transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden bg-[#0c0e14]/95 backdrop-blur-xl border-b border-white/10 ${
                            isNavTrayOpen ? 'max-h-96 opacity-100 shadow-2xl' : 'max-h-0 opacity-0 pointer-events-none'
                        }`}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Model 1: S26 Ultra Card */}
                                <div 
                                    onClick={() => {
                                        handleSeriesChange('Galaxy S26 Series');
                                        scrollToSection('hero');
                                    }}
                                    className="group cursor-pointer p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-sky-500/30 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-20 flex-shrink-0 flex items-center justify-center bg-black/40 rounded-lg p-1">
                                            <img src="/images/products/s26-ultra.png" alt="S26 Ultra" className="max-h-full object-contain" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Flagship Titanium</span>
                                            <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">Galaxy S26 Ultra 5G</h4>
                                            <p className="text-xs text-slate-400 mt-1">Kamera 200MP Quad-Tele dan Slot S-Pen bawaan.</p>
                                            <p className="text-xs font-semibold text-slate-200 mt-2">Mulai {formatRupiah(21999000)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Model 2: Z Fold8 Card */}
                                <div 
                                    onClick={() => {
                                        handleSeriesChange('Galaxy Z Fold8 Series');
                                        scrollToSection('hero');
                                    }}
                                    className="group cursor-pointer p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-sky-500/30 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-20 flex-shrink-0 flex items-center justify-center bg-black/40 rounded-lg p-1">
                                            <img src="/images/products/zfold8.png" alt="Z Fold8" className="max-h-full object-contain" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Flex Dual Screen</span>
                                            <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">Galaxy Z Fold8 5G</h4>
                                            <p className="text-xs text-slate-400 mt-1">Layar lipat 8.0 inci Dynamic AMOLED multitasking ganda.</p>
                                            <p className="text-xs font-semibold text-slate-200 mt-2">Mulai {formatRupiah(26999000)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Service Links */}
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Jaminan Reseller</span>
                                        <h4 className="text-sm font-bold text-white mt-0.5">Layanan Purna Jual SEIN</h4>
                                        <ul className="text-xs text-slate-300 space-y-2 mt-3">
                                            <li className="flex items-center gap-2">
                                                <span className="text-emerald-400">✓</span> Unit 100% Baru Segel Kemenperin
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-emerald-400">✓</span> Ambil Langsung di Samsung Store Mall
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-emerald-400">✓</span> Proteksi Pengiriman dengan Asuransi
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                                        <button 
                                            type="button" 
                                            onClick={() => scrollToSection('configurator')}
                                            className="text-sky-400 font-semibold hover:underline cursor-pointer"
                                        >
                                            Buka Studio Konfigurasi &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Backdrop Dimmer when Top Nav Tray is open */}
                {isNavTrayOpen && (
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300" 
                        onClick={() => setIsNavTrayOpen(false)}
                    />
                )}

                {/* 2. STICKY SUB-NAV BAR (Appears on scroll) */}
                <div 
                    className={`fixed top-12 inset-x-0 z-30 transition-all duration-300 bg-black/90 backdrop-blur-md border-b border-white/10 ${
                        scrolledPastHero ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
                    }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 h-11 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                            <span className="font-semibold text-white">{selectedVariant?.product_name}</span>
                            <span className="text-slate-400 hidden sm:inline">|</span>
                            <span className="text-emerald-400 hidden sm:inline">✓ Garansi Resmi SEIN</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-slate-200">
                                {formatRupiah(selectedVariant?.price || 0)}
                            </span>
                            <button
                                type="button"
                                onClick={() => scrollToSection('configurator')}
                                className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-3 py-1 rounded-full text-xs transition-colors cursor-pointer"
                            >
                                Konfigurasi & Beli
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. CINEMATIC HERO STAGE WITH REACTIVE AMBIENT GLOW */}
                <header id="hero" className="relative pt-24 pb-16 sm:pt-28 sm:pb-24 overflow-hidden border-b border-white/5">
                    {/* Dynamic Ambient Glow matching active color */}
                    <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ease-out"
                        style={{
                            backgroundColor: `${selectedVariant?.color_hex || '#8c959e'}25`,
                        }}
                    />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-8 text-center">
                        {/* Eyebrow badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 mb-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Samsung Authorized Partner Indonesia</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-sky-400 font-medium">Garansi Resmi SEIN</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
                            {selectedSeries === 'Galaxy Z Fold8 Series' ? 'Galaxy Z Fold8 5G' : 'Galaxy S26 Ultra 5G'}
                        </h1>
                        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mt-4 font-normal">
                            {selectedSeries === 'Galaxy Z Fold8 Series'
                                ? 'Desain lipat presisi 8.0 inci Dynamic AMOLED dengan Armor Hinge dan multitasking tanpa hambatan.'
                                : 'Bingkai Titanium kokoh, kamera 200MP Quad-Tele dengan Space Zoom, dan prosesor 3nm Snapdragon 8 Elite.'}
                        </p>

                        {/* Series Switcher Tabs in Hero */}
                        <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 mt-8 gap-1">
                            <button
                                type="button"
                                onClick={() => handleSeriesChange('Galaxy S26 Series')}
                                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                                    selectedSeries === 'Galaxy S26 Series'
                                        ? 'bg-sky-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Galaxy S26 Ultra 5G
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSeriesChange('Galaxy Z Fold8 Series')}
                                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                                    selectedSeries === 'Galaxy Z Fold8 Series'
                                        ? 'bg-sky-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Galaxy Z Fold8 5G
                            </button>
                        </div>

                        {/* Interactive Device Viewport */}
                        <div className="relative mt-12 max-w-md mx-auto">
                            {/* Angle View Switcher (Back Chassis vs Front AMOLED Screen) */}
                            <div className="flex justify-center items-center gap-2 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setViewAngle('chassis')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                                        viewAngle === 'chassis'
                                            ? 'bg-white/15 border-sky-400 text-white'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Tampak Belakang (Chassis Titanium)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewAngle('screen')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                                        viewAngle === 'screen'
                                            ? 'bg-white/15 border-sky-400 text-white'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Tampak Depan (Dynamic AMOLED)
                                </button>
                            </div>

                            {/* Main Render Showcase */}
                            <div className="w-72 sm:w-80 h-[480px] mx-auto flex items-center justify-center relative transition-transform duration-500 ease-out hover:scale-[1.02]">
                                <img
                                    src={getActiveDisplayImage()}
                                    alt={selectedVariant?.product_name || 'Samsung Galaxy'}
                                    className="max-h-full max-w-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]"
                                />
                            </div>

                            {/* Active Color Palette Indicator in Hero */}
                            <div className="mt-6 flex flex-col items-center">
                                <span className="text-xs text-slate-400">
                                    Finis Bodi: <strong className="text-white">{selectedVariant?.color_name}</strong>
                                </span>
                                <div className="flex items-center gap-3 mt-3">
                                    {colorsInSeries.map((c) => {
                                        const isSelected = selectedVariant?.color_name === c.name;
                                        return (
                                            <button
                                                key={c.name}
                                                type="button"
                                                onClick={() => handleColorChange(c.name)}
                                                title={c.name}
                                                className={`w-7 h-7 rounded-full p-0.5 transition-transform cursor-pointer ${
                                                    isSelected ? 'scale-125 ring-2 ring-sky-400 ring-offset-2 ring-offset-[#07080a]' : 'hover:scale-110 opacity-80'
                                                }`}
                                            >
                                                <span
                                                    className="w-full h-full rounded-full block border border-white/20"
                                                    style={{ backgroundColor: c.hex }}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quick Price & Action */}
                            <div className="mt-8">
                                <p className="text-2xl font-bold text-white">
                                    {formatRupiah(selectedVariant?.price || 0)}
                                </p>
                                <p className="text-xs text-emerald-400 mt-1">
                                    ✓ Unit Baru Segel Pabrik • Garansi Resmi SEIN 1 Tahun
                                </p>
                                <div className="mt-5 flex justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => scrollToSection('configurator')}
                                        className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer"
                                    >
                                        Mulai Konfigurasi & Beli
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* 4. THE PROGRESSIVE PURCHASING STUDIO (CONFIGURATOR SECTION) */}
                <section id="configurator" className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Studio Pemesanan Resmi</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                            Pilih dan Konfigurasikan Perangkat Anda
                        </h2>
                        <p className="text-sm text-slate-400 mt-3">
                            Transparansi spesifikasi, ketersediaan stok riil, serta pilihan pengambilan di toko resmi rekanan atau pengiriman berasuransi.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                        {/* LEFT COLUMN: STICKY PRODUCT VIEWPORT */}
                        <div className="lg:col-span-5 lg:sticky lg:top-24 bg-[#0e1017] border border-white/10 rounded-2xl p-6 sm:p-8">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                                    {selectedVariant?.series}
                                </span>
                                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                                    ✓ Garansi SEIN
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white">
                                {selectedVariant?.product_name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                {selectedVariant?.color_name} • {selectedVariant?.ram} / {selectedVariant?.storage}
                            </p>

                            {/* View angle toggle inside sticky card */}
                            <div className="flex justify-center gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setViewAngle('chassis')}
                                    className={`text-[11px] px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                                        viewAngle === 'chassis' ? 'bg-sky-600/30 border-sky-400 text-white' : 'border-white/10 text-slate-400'
                                    }`}
                                >
                                    Chassis
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewAngle('screen')}
                                    className={`text-[11px] px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                                        viewAngle === 'screen' ? 'bg-sky-600/30 border-sky-400 text-white' : 'border-white/10 text-slate-400'
                                    }`}
                                >
                                    Layar
                                </button>
                            </div>

                            {/* Dynamic Device Preview */}
                            <div className="w-48 h-64 mx-auto my-6 flex items-center justify-center">
                                <img
                                    src={getActiveDisplayImage()}
                                    alt={selectedVariant?.product_name}
                                    className="max-h-full max-w-full object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.6)]"
                                />
                            </div>

                            {/* Price Summary Box */}
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 mt-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Harga Satuan Varian:</span>
                                    <span className="text-white font-bold">{formatRupiah(selectedVariant?.price || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                                    <span>Status Persediaan:</span>
                                    <span className={selectedVariant?.stock > 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                                        {selectedVariant?.stock > 5
                                            ? 'Tersedia'
                                            : selectedVariant?.stock > 0
                                            ? `Sisa ${selectedVariant.stock} Unit`
                                            : 'Stok Habis'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                                    <span>Metode Pengambilan:</span>
                                    <span className="text-slate-200">
                                        {data.fulfillment_method === 'pickup' ? 'Ambil di Gerai SES' : 'Kirim Berasuransi'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: STEP-BY-STEP PROGRESSIVE CONFIGURATION */}
                        <div className="lg:col-span-7 space-y-10">

                            {/* STEP 1: PILIH MODEL / SERI */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-white/10 text-xs font-bold flex items-center justify-center text-sky-400">1</span>
                                    <h3 className="text-lg font-bold text-white">Pilih Seri Perangkat</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => handleSeriesChange('Galaxy S26 Series')}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                            selectedSeries === 'Galaxy S26 Series'
                                                ? 'bg-sky-950/30 border-sky-500 shadow-md ring-1 ring-sky-500'
                                                : 'bg-[#0e1017] border-white/10 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-white text-sm">Galaxy S26 Ultra 5G</h4>
                                            <span className="text-[10px] text-sky-400 font-semibold uppercase">Titanium</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">Layar flat 6.9 inci, kamera 200MP Quad-Tele, slot S-Pen terintegrasi.</p>
                                        <p className="text-xs font-bold text-slate-200 mt-3">Mulai {formatRupiah(21999000)}</p>
                                    </div>

                                    <div
                                        onClick={() => handleSeriesChange('Galaxy Z Fold8 Series')}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                            selectedSeries === 'Galaxy Z Fold8 Series'
                                                ? 'bg-sky-950/30 border-sky-500 shadow-md ring-1 ring-sky-500'
                                                : 'bg-[#0e1017] border-white/10 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-white text-sm">Galaxy Z Fold8 5G</h4>
                                            <span className="text-[10px] text-sky-400 font-semibold uppercase">Layar Lipat</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">Layar fleksibel ganda 8.0 inci untuk multitasking profesional.</p>
                                        <p className="text-xs font-bold text-slate-200 mt-3">Mulai {formatRupiah(26999000)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* STEP 2: PILIH WARNA FINIS */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-white/10 text-xs font-bold flex items-center justify-center text-sky-400">2</span>
                                    <h3 className="text-lg font-bold text-white">
                                        Pilih Warna Finis: <span className="text-sky-400 font-normal">{selectedVariant?.color_name}</span>
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {colorsInSeries.map((c) => {
                                        const isSelected = selectedVariant?.color_name === c.name;
                                        return (
                                            <div
                                                key={c.name}
                                                onClick={() => handleColorChange(c.name)}
                                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'bg-sky-950/20 border-sky-400 ring-1 ring-sky-400'
                                                        : 'bg-[#0e1017] border-white/10 hover:border-white/20'
                                                }`}
                                            >
                                                <span
                                                    className="w-8 h-8 rounded-full border border-white/20 shadow-inner"
                                                    style={{ backgroundColor: c.hex }}
                                                />
                                                <span className="text-xs font-medium text-slate-200 text-center leading-tight">
                                                    {c.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* STEP 3: PILIH KAPASITAS MEMORI & PENYIMPANAN */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-white/10 text-xs font-bold flex items-center justify-center text-sky-400">3</span>
                                    <h3 className="text-lg font-bold text-white">Pilih Kapasitas Memori</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {storageOptions.map((opt) => {
                                        const isSelected = selectedVariant?.id === opt.id;
                                        const isOutOfStock = opt.stock === 0;

                                        return (
                                            <div
                                                key={opt.id}
                                                onClick={() => !isOutOfStock && handleStorageChange(opt.id)}
                                                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                                                    isOutOfStock
                                                        ? 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed'
                                                        : isSelected
                                                        ? 'bg-sky-950/30 border-sky-400 ring-1 ring-sky-400 cursor-pointer'
                                                        : 'bg-[#0e1017] border-white/10 hover:border-white/20 cursor-pointer'
                                                }`}
                                            >
                                                <div>
                                                    <span className="text-base font-bold text-white block">
                                                        {opt.storage}
                                                    </span>
                                                    <span className="text-xs text-slate-400 block mt-0.5">
                                                        RAM {opt.ram}
                                                    </span>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-white/10">
                                                    <span className="text-xs font-bold text-slate-100 block">
                                                        {formatRupiah(opt.price)}
                                                    </span>
                                                    <span
                                                        className={`text-[10px] font-semibold mt-1 inline-block ${
                                                            opt.stock === 0
                                                                ? 'text-rose-400'
                                                                : opt.stock <= 5
                                                                ? 'text-amber-400'
                                                                : 'text-emerald-400'
                                                        }`}
                                                    >
                                                        {opt.stock === 0
                                                            ? 'Stok Habis'
                                                            : opt.stock <= 5
                                                            ? `Sisa ${opt.stock} Unit`
                                                            : 'Stok Tersedia'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {errors.variant_id && (
                                    <p className="text-xs text-rose-400 mt-1">{errors.variant_id}</p>
                                )}
                            </div>

                            {/* STEP 4: METODE PENGAMBILAN (STORE PICKUP VS DELIVERY) */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-white/10 text-xs font-bold flex items-center justify-center text-sky-400">4</span>
                                    <h3 className="text-lg font-bold text-white">Metode Pengambilan Barang</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div
                                        onClick={() => setData('fulfillment_method', 'pickup')}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                            data.fulfillment_method === 'pickup'
                                                ? 'bg-sky-950/20 border-sky-400 ring-1 ring-sky-400'
                                                : 'bg-[#0e1017] border-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">📍</span>
                                            <h4 className="font-bold text-white text-sm">Ambil di Gerai Resmi (SES)</h4>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1.5">
                                            Ambil langsung di Samsung Experience Store mall rekanan resmi setelah verifikasi pembayaran.
                                        </p>
                                    </div>

                                    <div
                                        onClick={() => setData('fulfillment_method', 'delivery')}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                            data.fulfillment_method === 'delivery'
                                                ? 'bg-sky-950/20 border-sky-400 ring-1 ring-sky-400'
                                                : 'bg-[#0e1017] border-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">🚚</span>
                                            <h4 className="font-bold text-white text-sm">Kirim ke Alamat Rumah</h4>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1.5">
                                            Pengiriman aman dengan asuransi ekspedisi dan pengemasan kayu terproteksi penuh.
                                        </p>
                                    </div>
                                </div>

                                {/* Form Cabang Store Pickup */}
                                {data.fulfillment_method === 'pickup' ? (
                                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 mt-3">
                                        <label className="block text-xs font-semibold text-slate-300 mb-2">
                                            Pilih Cabang Samsung Experience Store (SES):
                                        </label>
                                        <select
                                            value={data.pickup_store}
                                            onChange={(e) => setData('pickup_store', e.target.value)}
                                            className="w-full bg-[#07080a] border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                                        >
                                            {pickupStores.map((store) => (
                                                <option key={store} value={store} className="bg-[#0e1017] text-white">
                                                    {store}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.pickup_store && (
                                            <p className="text-xs text-rose-400 mt-1">{errors.pickup_store}</p>
                                        )}
                                    </div>
                                ) : (
                                    /* Form Alamat Pengiriman */
                                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 mt-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-300 mb-1">Provinsi</label>
                                                <input
                                                    type="text"
                                                    value={data.shipping_province}
                                                    onChange={(e) => setData('shipping_province', e.target.value)}
                                                    placeholder="Contoh: DKI Jakarta"
                                                    className="w-full bg-[#07080a] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-500"
                                                />
                                                {errors.shipping_province && <p className="text-xs text-rose-400 mt-0.5">{errors.shipping_province}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-300 mb-1">Kota / Kabupaten</label>
                                                <input
                                                    type="text"
                                                    value={data.shipping_city}
                                                    onChange={(e) => setData('shipping_city', e.target.value)}
                                                    placeholder="Contoh: Jakarta Selatan"
                                                    className="w-full bg-[#07080a] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-500"
                                                />
                                                {errors.shipping_city && <p className="text-xs text-rose-400 mt-0.5">{errors.shipping_city}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-300 mb-1">Kecamatan</label>
                                                <input
                                                    type="text"
                                                    value={data.shipping_district}
                                                    onChange={(e) => setData('shipping_district', e.target.value)}
                                                    placeholder="Contoh: Kebayoran Baru"
                                                    className="w-full bg-[#07080a] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-500"
                                                />
                                                {errors.shipping_district && <p className="text-xs text-rose-400 mt-0.5">{errors.shipping_district}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-300 mb-1">Kode Pos</label>
                                                <input
                                                    type="text"
                                                    value={data.shipping_postal_code}
                                                    onChange={(e) => setData('shipping_postal_code', e.target.value)}
                                                    placeholder="Contoh: 12180"
                                                    className="w-full bg-[#07080a] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-500"
                                                />
                                                {errors.shipping_postal_code && <p className="text-xs text-rose-400 mt-0.5">{errors.shipping_postal_code}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat Lengkap & Patokan</label>
                                            <textarea
                                                rows="2"
                                                value={data.shipping_address}
                                                onChange={(e) => setData('shipping_address', e.target.value)}
                                                placeholder="Nama jalan, nomor rumah, RT/RW, dan patokan gedung"
                                                className="w-full bg-[#07080a] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-500"
                                            ></textarea>
                                            {errors.shipping_address && <p className="text-xs text-rose-400 mt-0.5">{errors.shipping_address}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* STEP 5: DATA PEMESAN & PEMBAYARAN LOKAL */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-white/10 text-xs font-bold flex items-center justify-center text-sky-400">5</span>
                                    <h3 className="text-lg font-bold text-white">Data Pemesan & Metode Pembayaran</h3>
                                </div>

                                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                value={data.customer_name}
                                                onChange={(e) => setData('customer_name', e.target.value)}
                                                placeholder="Nama penerima paket / pemesan"
                                                className="w-full bg-[#07080a] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-500"
                                            />
                                            {errors.customer_name && <p className="text-xs text-rose-400 mt-0.5">{errors.customer_name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor WhatsApp / HP</label>
                                            <input
                                                type="text"
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                                placeholder="Contoh: 081234567890"
                                                className="w-full bg-[#07080a] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-500"
                                            />
                                            {errors.customer_phone && <p className="text-xs text-rose-400 mt-0.5">{errors.customer_phone}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat Email (Pengiriman Faktur Resmi)</label>
                                        <input
                                            type="email"
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            placeholder="email@example.com"
                                            className="w-full bg-[#07080a] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-500"
                                        />
                                        {errors.customer_email && <p className="text-xs text-rose-400 mt-0.5">{errors.customer_email}</p>}
                                    </div>

                                    <div className="pt-3 border-t border-white/10">
                                        <label className="block text-xs font-semibold text-slate-300 mb-2">Pilih Cara Pembayaran:</label>
                                        <select
                                            value={data.payment_method}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="w-full bg-[#07080a] border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                                        >
                                            <option value="qris" className="bg-[#0e1017]">QRIS (GoPay, OVO, Dana, ShopeePay, m-Banking)</option>
                                            <option value="va_bca" className="bg-[#0e1017]">BCA Virtual Account</option>
                                            <option value="va_mandiri" className="bg-[#0e1017]">Mandiri Virtual Account</option>
                                            <option value="va_bni" className="bg-[#0e1017]">BNI Virtual Account</option>
                                            <option value="va_bri" className="bg-[#0e1017]">BRI Virtual Account</option>
                                            <option value="gopay" className="bg-[#0e1017]">GoPay E-Wallet Langsung</option>
                                            <option value="dana" className="bg-[#0e1017]">DANA E-Wallet Langsung</option>
                                            <option value="shopeepay" className="bg-[#0e1017]">ShopeePay E-Wallet Langsung</option>
                                        </select>
                                        {errors.payment_method && <p className="text-xs text-rose-400 mt-1">{errors.payment_method}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* SUBMIT BUTTON CARD */}
                            <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-300">Estimasi Total Tagihan:</span>
                                    <span className="text-xl font-extrabold text-white">
                                        {formatRupiah((selectedVariant?.price || 0) * data.quantity)}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400">
                                    *Server akan otomatis menambahkan 3 digit kode verifikasi transfer saat invoice dibuat.
                                </p>

                                <button
                                    type="submit"
                                    disabled={processing || selectedVariant?.stock === 0}
                                    className={`w-full mt-5 py-3.5 px-6 rounded-full font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg ${
                                        processing || selectedVariant?.stock === 0
                                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                            : 'bg-sky-600 hover:bg-sky-500 text-white hover:scale-[1.01]'
                                    }`}
                                >
                                    {processing ? 'Memproses Pesanan...' : selectedVariant?.stock === 0 ? 'Varian Ini Sedang Habis' : 'Selesaikan Pemesanan'}
                                </button>
                            </div>
                        </div>
                    </form>
                </section>

                {/* 5. FACTUAL HARDWARE SPEC COMPARISON TABLE */}
                <section id="specs" className="py-20 border-t border-white/10 bg-[#0a0c10]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Perbandingan Teknis</span>
                            <h2 className="text-3xl font-extrabold text-white mt-2">Komparasi Flagship Samsung 2026</h2>
                            <p className="text-xs text-slate-400 mt-2">Data spesifikasi perangkat resmi dari Samsung Electronics Indonesia.</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300 border-collapse border border-white/10">
                                <thead>
                                    <tr className="bg-white/5 text-white">
                                        <th className="p-3.5 border border-white/10 font-bold">Fitur Utama</th>
                                        <th className="p-3.5 border border-white/10 font-bold text-sky-400">Galaxy S26 Ultra 5G</th>
                                        <th className="p-3.5 border border-white/10 font-bold text-sky-400">Galaxy Z Fold8 5G</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-white/10">
                                        <td className="p-3.5 border border-white/10 font-semibold text-white">Form Factor</td>
                                        <td className="p-3.5 border border-white/10">Flat Titanium Chassis dengan Slot S-Pen bawaan</td>
                                        <td className="p-3.5 border border-white/10">Dual Screen Foldable dengan Armor Hinge</td>
                                    </tr>
                                    <tr className="border-b border-white/10">
                                        <td className="p-3.5 border border-white/10 font-semibold text-white">Layar Utama</td>
                                        <td className="p-3.5 border border-white/10">6.9 inci Dynamic AMOLED 2X, 1-120Hz LTPO</td>
                                        <td className="p-3.5 border border-white/10">8.0 inci Flex Dynamic AMOLED 2X, 120Hz</td>
                                    </tr>
                                    <tr className="border-b border-white/10">
                                        <td className="p-3.5 border border-white/10 font-semibold text-white">Kamera Utama</td>
                                        <td className="p-3.5 border border-white/10">200MP Quad-Tele (Space Zoom 100x, Periskop 5x)</td>
                                        <td className="p-3.5 border border-white/10">50MP Triple Camera (Telephoto 3x)</td>
                                    </tr>
                                    <tr className="border-b border-white/10">
                                        <td className="p-3.5 border border-white/10 font-semibold text-white">Prosesor</td>
                                        <td className="p-3.5 border border-white/10">3nm Snapdragon 8 Elite for Galaxy</td>
                                        <td className="p-3.5 border border-white/10">3nm Snapdragon 8 Elite for Galaxy</td>
                                    </tr>
                                    <tr className="border-b border-white/10">
                                        <td className="p-3.5 border border-white/10 font-semibold text-white">Baterai & Charging</td>
                                        <td className="p-3.5 border border-white/10">5,500mAh dengan 45W Fast Charging</td>
                                        <td className="p-3.5 border border-white/10">4,600mAh dengan 25W Fast Charging</td>
                                    </tr>
                                    <tr className="border-b border-white/10">
                                        <td className="p-3.5 border border-white/10 font-semibold text-white">Jaminan Garansi</td>
                                        <td className="p-3.5 border border-white/10 text-emerald-400 font-semibold">Garansi Resmi SEIN (1 Tahun)</td>
                                        <td className="p-3.5 border border-white/10 text-emerald-400 font-semibold">Garansi Resmi SEIN (1 Tahun)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 6. TRUST ASSURANCE BADGES & STORE NETWORK */}
                <section id="stores" className="py-16 max-w-7xl mx-auto px-4 sm:px-8 border-t border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                            <span className="text-2xl block mb-2">🛡️</span>
                            <h4 className="text-sm font-bold text-white">Garansi Resmi SEIN</h4>
                            <p className="text-xs text-slate-400 mt-1">100% unit baru bergaransi resmi PT Samsung Electronics Indonesia. Bebas servis di seluruh SSC resmi.</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                            <span className="text-2xl block mb-2">⏱️</span>
                            <h4 className="text-sm font-bold text-white">Perlindungan Stok 24 Jam</h4>
                            <p className="text-xs text-slate-400 mt-1">Unit langsung dipisahkan untuk Anda. Pembatalan otomatis tanpa pinalti jika pembayaran tidak diteruskan.</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                            <span className="text-2xl block mb-2">📦</span>
                            <h4 className="text-sm font-bold text-white">Pengiriman Berasuransi</h4>
                            <p className="text-xs text-slate-400 mt-1">Dilindungi asuransi ekspedisi dan pengemasan kayu standar keamanan elektronik bernilai tinggi.</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                            <span className="text-2xl block mb-2">🏬</span>
                            <h4 className="text-sm font-bold text-white">Jaringan Toko Mall Resmi</h4>
                            <p className="text-xs text-slate-400 mt-1">Pengambilan langsung di Samsung Experience Store Grand Indonesia, PIM 3, Central Park, dan kota lainnya.</p>
                        </div>
                    </div>
                </section>

                {/* 7. PERSISTENT STICKY BOTTOM BUY BAR */}
                <div 
                    className={`fixed bottom-0 inset-x-0 z-40 bg-[#0e1017]/95 backdrop-blur-md border-t border-white/15 px-4 sm:px-8 py-3 transition-transform duration-300 ${
                        scrolledPastHero ? 'translate-y-0' : 'translate-y-full'
                    }`}
                >
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-black/50 rounded-lg p-1 border border-white/10 hidden sm:flex">
                                <img src={getActiveDisplayImage()} alt="Thumbnail" className="max-h-full object-contain" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-white block">
                                    {selectedVariant?.product_name}
                                </span>
                                <span className="text-[11px] text-slate-400 block">
                                    {selectedVariant?.color_name} • {selectedVariant?.storage}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <span className="text-[10px] text-slate-400 block uppercase">Harga Tagihan:</span>
                                <span className="text-sm sm:text-base font-extrabold text-white">
                                    {formatRupiah((selectedVariant?.price || 0) * data.quantity)}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => scrollToSection('configurator')}
                                className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
                            >
                                Pesan Sekarang
                            </button>
                        </div>
                    </div>
                </div>

                {/* 8. MINIMALIST FOOTER */}
                <footer className="py-12 border-t border-white/10 bg-[#050608] text-xs text-slate-500 text-center pb-24 sm:pb-20">
                    <div className="max-w-7xl mx-auto px-4 space-y-3">
                        <p>
                            © 2026 {appName}. Hak Cipta Dilindungi Undang-Undang. Seluruh perangkat bergaransi resmi PT Samsung Electronics Indonesia (SEIN).
                        </p>
                        <div className="flex justify-center items-center gap-6 text-slate-400">
                            <Link href="/track" className="hover:text-white transition-colors">Pelacakan Pesanan</Link>
                            <span>•</span>
                            <button type="button" onClick={() => scrollToSection('specs')} className="hover:text-white transition-colors cursor-pointer">Spesifikasi Teknis</button>
                            <span>•</span>
                            <button type="button" onClick={() => scrollToSection('stores')} className="hover:text-white transition-colors cursor-pointer">Lokasi Cabang SES</button>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
