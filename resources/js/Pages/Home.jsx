import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

function SearchIcon({ className = 'w-5 h-5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
        </svg>
    );
}

function CartIcon({ className = 'w-5 h-5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    );
}

function UserIcon({ className = 'w-5 h-5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function LogInIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
    );
}

function PackageIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-1.8 0L2.5 6.1a1.8 1.8 0 0 0-.9 1.56v8.68a1.8 1.8 0 0 0 .9 1.56l3.25 1.86a1.78 1.78 0 0 0 1.8 0l8.95-5.16a1.8 1.8 0 0 0 .9-1.56V9.4z" />
            <polyline points="3.29 7 12 12 20.71 7" />
            <line x1="12" y1="22" x2="12" y2="12" />
        </svg>
    );
}

function CloseIcon({ className = 'w-5 h-5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

export default function Home({ models, appName }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const closeTimeoutRef = useRef(null);
    const lastScrollYRef = useRef(0);

    // Right navbar action buttons & modals
    const [hoveredActionId, setHoveredActionId] = useState(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const userMenuEnterTimeoutRef = useRef(null);
    const userMenuLeaveTimeoutRef = useRef(null);

    const handleUserMenuEnter = () => {
        if (userMenuLeaveTimeoutRef.current) {
            clearTimeout(userMenuLeaveTimeoutRef.current);
            userMenuLeaveTimeoutRef.current = null;
        }
        if (isUserMenuOpen) return;

        // Intentional hover-intent delay (140ms) - only schedule once if not already pending
        if (!userMenuEnterTimeoutRef.current) {
            userMenuEnterTimeoutRef.current = setTimeout(() => {
                setIsUserMenuOpen(true);
                userMenuEnterTimeoutRef.current = null;
            }, 140);
        }
    };

    const handleUserMenuLeave = () => {
        // Clear pending enter if user merely brushed past
        if (userMenuEnterTimeoutRef.current) {
            clearTimeout(userMenuEnterTimeoutRef.current);
            userMenuEnterTimeoutRef.current = null;
        }
        // Graceful leave buffer (240ms) so moving cursor between button and dropdown items feels smooth
        if (userMenuLeaveTimeoutRef.current) {
            clearTimeout(userMenuLeaveTimeoutRef.current);
        }
        userMenuLeaveTimeoutRef.current = setTimeout(() => {
            setIsUserMenuOpen(false);
            userMenuLeaveTimeoutRef.current = null;
        }, 240);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (userMenuEnterTimeoutRef.current) clearTimeout(userMenuEnterTimeoutRef.current);
                if (userMenuLeaveTimeoutRef.current) clearTimeout(userMenuLeaveTimeoutRef.current);
                setIsSearchOpen(false);
                setIsCartOpen(false);
                setIsLoginModalOpen(false);
                setIsUserMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (userMenuEnterTimeoutRef.current) clearTimeout(userMenuEnterTimeoutRef.current);
            if (userMenuLeaveTimeoutRef.current) clearTimeout(userMenuLeaveTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (isSearchOpen || isCartOpen || isLoginModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSearchOpen, isCartOpen, isLoginModalOpen]);

    const searchableItems = [
        {
            id: 's26-ultra',
            title: 'Samsung Galaxy S26 Ultra 5G',
            category: 'Smartphone Flagship & S-Pen',
            price: 'Mulai Rp 21.999.000',
            url: '/buy/samsung-galaxy-s26-ultra',
            keywords: 's26 ultra titanium 200mp snapdragon s-pen camera flagship amoled'
        },
        {
            id: 'z-fold8',
            title: 'Samsung Galaxy Z Fold8 5G',
            category: 'Layar Lipat 8.0 Inci Next-Gen',
            price: 'Mulai Rp 28.499.000',
            url: '/buy/samsung-galaxy-z-fold8',
            keywords: 'z fold fold8 lipat foldable armor hinge multitasking amoled'
        },
        {
            id: 'track-order',
            title: 'Lacak Status & Invoice Pesanan',
            category: 'Layanan Pengiriman Resmi SEIN',
            price: 'Layanan Cek Resi',
            url: '/track',
            keywords: 'lacak invoice status pesanan nomor resi tracking kurir garansi'
        },
        {
            id: 'services-sein',
            title: 'Layanan & Jaminan Garansi Resmi SEIN',
            category: 'Garansi 1 Tahun Resmi SEIN Indonesia',
            price: '100% Original',
            url: '/#services',
            keywords: 'garansi sein servis service center sparepart resmi original'
        }
    ];

    const filteredSearchResults = searchQuery.trim() === ''
        ? searchableItems.slice(0, 3)
        : searchableItems.filter((item) =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.keywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.category.toLowerCase().includes(searchQuery.toLowerCase())
          );


    // Carousel state
    const carouselRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);

    const s26Model = models?.find((m) => m.id === 'samsung-galaxy-s26-ultra') || models?.[0];
    const foldModel = models?.find((m) => m.id === 'samsung-galaxy-z-fold8') || models?.[1];

    // Scroll-triggered subtle parallax refs for Showcase banners (100% additive, non-breaking)
    const s26SectionRef = useRef(null);
    const foldSectionRef = useRef(null);

    // Dynamic Hero Cover-to-Fixed-Header Scroll Animation (Bramus Demo + Samsung Floating Header)
    const [heroHeight, setHeroHeight] = useState(640);
    const [activeProduct, setActiveProduct] = useState('s26');

    useEffect(() => {
        const updateHeroHeight = () => {
            const calculated = Math.min(Math.max(window.innerHeight - 64, 520), 680);
            setHeroHeight(calculated);
        };
        updateHeroHeight();
        window.addEventListener('resize', updateHeroHeight);
        return () => window.removeEventListener('resize', updateHeroHeight);
    }, []);

    const { scrollY } = useScroll();
    const collapseDistance = Math.max(heroHeight - 60, 200);

    // Height transforms smoothly from heroHeight down to 60px as user scrolls from 0 to collapseDistance
    const heroCoverHeight = useTransform(
        scrollY,
        [0, collapseDistance],
        [heroHeight, 60],
        { clamp: true }
    );

    // Hero banner & expanded CTA fade away as the cover collapses
    const heroExpandedOpacity = useTransform(
        scrollY,
        [0, collapseDistance * 0.55],
        [1, 0],
        { clamp: true }
    );

    // Fixed product header bar fades in as the cover docks
    const fixedHeaderOpacity = useTransform(
        scrollY,
        [collapseDistance * 0.45, collapseDistance * 0.95],
        [0, 1],
        { clamp: true }
    );

    // Dynamic background transition: from cinematic poster to sleek dark glass
    const fixedHeaderBg = useTransform(
        scrollY,
        [0, collapseDistance],
        ['rgba(18, 16, 30, 1)', 'rgba(18, 16, 30, 0.94)'],
        { clamp: true }
    );

    // Interactive pointer event switching between expanded hero and docked header
    const heroPointerEvents = useTransform(
        scrollY,
        (v) => (v > collapseDistance * 0.5 ? 'none' : 'auto')
    );
    const fixedHeaderPointerEvents = useTransform(
        scrollY,
        (v) => (v > collapseDistance * 0.4 ? 'auto' : 'none')
    );

    // Contextual active product tracking (S26 Ultra vs Z Fold8)
    useEffect(() => {
        const handleProductIntersection = () => {
            if (!foldSectionRef.current) return;
            const rect = foldSectionRef.current.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 120) {
                setActiveProduct('fold8');
            } else if (rect.top > 200) {
                setActiveProduct('s26');
            }
        };
        window.addEventListener('scroll', handleProductIntersection, { passive: true });
        return () => window.removeEventListener('scroll', handleProductIntersection);
    }, []);

    const { scrollYProgress: s26ScrollProgress } = useScroll({
        target: s26SectionRef,
        offset: ['start end', 'end start'],
    });
    const s26ImageY = useTransform(s26ScrollProgress, [0, 1], ['-3%', '3%']);

    const { scrollYProgress: foldScrollProgress } = useScroll({
        target: foldSectionRef,
        offset: ['start end', 'end start'],
    });
    const foldImageY = useTransform(foldScrollProgress, [0, 1], ['-3%', '3%']);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = Math.max(0, window.scrollY);
            const prevScrollY = lastScrollYRef.current;
            const diff = currentScrollY - prevScrollY;

            setIsScrolled(currentScrollY > 20);

            // Always show navbar when near the very top of the page
            if (currentScrollY < 50) {
                setIsNavVisible(true);
            } 
            // Hide when scrolling down past 80px by more than 8px
            else if (diff > 8 && currentScrollY > 80) {
                if (!activeMenuId) {
                    setIsNavVisible(false);
                }
            } 
            // Show immediately when scrolling up by even a small amount (5px)
            else if (diff < -5) {
                setIsNavVisible(true);
            }

            lastScrollYRef.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeMenuId]);

    useEffect(() => {
        updateCarouselStatus();
        window.addEventListener('resize', updateCarouselStatus);
        return () => window.removeEventListener('resize', updateCarouselStatus);
    }, []);

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(num);
    };

    // Navigation hover interaction handlers
    const handleMenuEnter = (menuId) => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
        setActiveMenuId(menuId);
    };

    const handleMenuLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setActiveMenuId(null);
        }, 150);
    };

    const handleMenuLeaveInstant = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
        setActiveMenuId(null);
    };

    // Carousel scroll handlers
    const updateCarouselStatus = () => {
        if (!carouselRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        const maxScroll = scrollWidth - clientWidth;
        const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
        setScrollProgress(progress);
    };

    const scrollCarousel = (direction) => {
        if (!carouselRef.current) return;
        const scrollAmount = carouselRef.current.clientWidth;
        carouselRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };


    // Official authentic Samsung ecosystem recommendation items
    const carouselProducts = [
        {
            id: 's26-ultra',
            category: 'FLAGSHIP SMARTPHONE',
            name: 'Galaxy S26 Ultra 5G',
            subtitle: 'Bodi Armor Aluminum kokoh, kamera 200MP & S Pen bawaan.',
            price: 24999000,
            image: '/images/products/s26-ultra.webp',
            link: '/buy/samsung-galaxy-s26-ultra',
        },
        {
            id: 'z-fold8',
            category: 'LAYAR LIPAT NEXT-GEN',
            name: 'Galaxy Z Fold8 5G',
            subtitle: 'Layar lipat 8.0" Dynamic AMOLED 2X & bodi ultra ramping.',
            price: 26999000,
            image: '/images/products/zfold8.webp',
            link: '/buy/samsung-galaxy-z-fold8',
        },
        {
            id: 'watch-ultra',
            category: 'SMARTWATCH TANGGUH',
            name: 'Galaxy Watch Ultra',
            subtitle: 'Bodi titanium 47mm tangguh, dual GPS & baterai 100 jam.',
            price: 9999000,
            image: '/images/products/watch-ultra.webp',
            link: '/buy/samsung-galaxy-watch-ultra',
        },
        {
            id: 'buds3-pro',
            category: 'AUDIO NIRKABEL HI-FI',
            name: 'Galaxy Buds3 Pro',
            subtitle: 'Blade lights ikonik, audio 24-bit Hi-Fi & Adaptive ANC.',
            price: 3299000,
            image: '/images/products/buds3-pro.webp',
            link: '/buy/samsung-galaxy-buds3-pro',
        },
        {
            id: 'tab-s10-ultra',
            category: 'TABLET PROFESIONAL',
            name: 'Galaxy Tab S10 Ultra',
            subtitle: 'Layar 14.6" Dynamic AMOLED 2X anti-reflektif & S Pen.',
            price: 20999000,
            image: '/images/products/tab-s10-ultra.webp',
            link: '/buy/samsung-galaxy-tab-s10-ultra',
        },
        {
            id: 'galaxy-ring',
            category: 'SMART RING RINGAN',
            name: 'Galaxy Ring',
            subtitle: 'Bodi titanium ultra ringan & pantau kesehatan 24/7.',
            price: 6499000,
            image: '/images/products/galaxy-ring.webp',
            link: '/buy/samsung-galaxy-ring',
        },
    ];

    const springConfig = { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 };
    // Refined, slower, luxury rolling pill spring for smooth, calm gliding
    const rollingPillSpring = { type: 'spring', stiffness: 170, damping: 22, mass: 0.9 };
    // Gentle spring for the user dropdown roll-down
    const dropdownSpring = { type: 'spring', stiffness: 220, damping: 24, mass: 0.8 };

    return (
        <div className="min-h-screen bg-white text-[#111111] antialiased selection:bg-[#2189FF] selection:text-white">
            <Head title="Samsung Authorized Reseller - Toko Resmi Flagship SEIN" />

            {/* Backdrop Dimming Overlay */}
            <AnimatePresence>
                {activeMenuId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleMenuLeaveInstant}
                        className="fixed inset-0 top-16 bg-black/25 backdrop-blur-xs z-40"
                    />
                )}
            </AnimatePresence>

            {/* Apple Clean Typographic Mega-Menu Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
                    isNavVisible ? 'translate-y-0' : '-translate-y-full'
                } ${
                    isScrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_4px_rgba(0,0,0,0.06)] border-b border-gray-200/80'
                        : 'bg-white/90 backdrop-blur-sm border-b border-gray-100'
                }`}
            >
                <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo & Brand Identity (Neutral Zone) */}
                        <div
                            className="flex items-center gap-3"
                            onMouseEnter={handleMenuLeaveInstant}
                        >
                            <Link href="/" className="flex items-center group py-1">
                                <img
                                    src="/images/logo/galax-lockup.svg"
                                    alt="Galax — Samsung Authorized Reseller"
                                    className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                                />
                            </Link>
                        </div>

                        {/* Center Interactive Navigation Links */}
                        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700">
                            {[
                                { id: 'store', label: 'Store' },
                                { id: 's-series', label: 'Galaxy S Series' },
                                { id: 'z-series', label: 'Galaxy Z Series' },
                                { id: 'services', label: 'Layanan & Garansi SEIN' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onMouseEnter={() => handleMenuEnter(item.id)}
                                    className={`relative px-4 py-2 rounded-full transition-colors ${
                                        activeMenuId === item.id
                                            ? 'text-[#1428A0] font-semibold'
                                            : 'hover:text-gray-950'
                                    }`}
                                >
                                    {item.label}
                                    {activeMenuId === item.id && (
                                        <motion.div
                                            layoutId="navbarActivePill"
                                            className="absolute inset-0 bg-gray-100/90 rounded-full -z-10"
                                            transition={rollingPillSpring}
                                        />
                                    )}
                                </button>
                            ))}
                        </nav>

                        {/* Right Quick Actions (Search, Cart, User with Rolling Hover Animation) */}
                        <div
                            className="relative flex items-center gap-1 sm:gap-1.5"
                            onMouseEnter={handleMenuLeaveInstant}
                            onMouseLeave={() => {
                                setHoveredActionId(null);
                                handleUserMenuLeave();
                            }}
                        >
                            {/* Search Button */}
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(true)}
                                onMouseEnter={() => {
                                    setHoveredActionId('search');
                                    handleUserMenuLeave();
                                }}
                                className="relative p-2 sm:p-2.5 rounded-full text-gray-700 hover:text-gray-950 transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
                                aria-label="Cari Produk"
                            >
                                <SearchIcon className="w-5 h-5" />
                                {hoveredActionId === 'search' && (
                                    <motion.div
                                        layoutId="rightNavHoverPill"
                                        className="absolute inset-0 bg-gray-100/90 rounded-full -z-10"
                                        transition={rollingPillSpring}
                                    />
                                )}
                            </button>

                            {/* Cart Button */}
                            <button
                                type="button"
                                onClick={() => setIsCartOpen(true)}
                                onMouseEnter={() => {
                                    setHoveredActionId('cart');
                                    handleUserMenuLeave();
                                }}
                                className="relative p-2 sm:p-2.5 rounded-full text-gray-700 hover:text-gray-950 transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
                                aria-label="Keranjang Belanja"
                            >
                                <CartIcon className="w-5 h-5" />
                                {hoveredActionId === 'cart' && (
                                    <motion.div
                                        layoutId="rightNavHoverPill"
                                        className="absolute inset-0 bg-gray-100/90 rounded-full -z-10"
                                        transition={rollingPillSpring}
                                    />
                                )}
                            </button>

                            {/* User Button with Top-to-Bottom Roll Down Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={handleUserMenuEnter}
                                onMouseLeave={handleUserMenuLeave}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (userMenuEnterTimeoutRef.current) {
                                            clearTimeout(userMenuEnterTimeoutRef.current);
                                        }
                                        setIsUserMenuOpen((prev) => !prev);
                                    }}
                                    onMouseEnter={() => {
                                        setHoveredActionId('user');
                                        handleUserMenuEnter();
                                    }}
                                    className={`relative p-2 sm:p-2.5 rounded-full transition-colors flex items-center justify-center focus:outline-none cursor-pointer ${
                                        isUserMenuOpen ? 'text-gray-950' : 'text-gray-700 hover:text-gray-950'
                                    }`}
                                    aria-label="Akun & Layanan Pengguna"
                                    aria-expanded={isUserMenuOpen}
                                >
                                    <UserIcon className="w-5 h-5" />
                                    {(hoveredActionId === 'user' || isUserMenuOpen) && (
                                        <motion.div
                                            layoutId="rightNavHoverPill"
                                            className="absolute inset-0 bg-gray-100/90 rounded-full -z-10"
                                            transition={rollingPillSpring}
                                        />
                                    )}
                                </button>

                                {/* Simple Samsung.com Style Top-to-Bottom Roll Down Dropdown */}
                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -16, scaleY: 0.94 }}
                                            animate={{ opacity: 1, y: 0, scaleY: 1 }}
                                            exit={{ opacity: 0, y: -10, scaleY: 0.96 }}
                                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                            style={{ transformOrigin: 'top' }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200/90 rounded-xl shadow-[0_12px_28px_rgba(0,0,0,0.08)] py-1.5 z-50 origin-top overflow-hidden before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                                        >
                                            <div className="flex flex-col">
                                                {/* Option 1: Login */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        setIsLoginModalOpen(true);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50/70 transition-colors duration-150 cursor-pointer"
                                                >
                                                    Login
                                                </button>

                                                <div className="my-1 border-t border-gray-100" />

                                                {/* Option 2: Lacak Pesanan */}
                                                <Link
                                                    href="/track"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50/70 transition-colors duration-150 cursor-pointer block"
                                                >
                                                    Lacak Pesanan
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expandable 3-Column Typographic Mega-Menu */}
                <AnimatePresence>
                    {activeMenuId && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={springConfig}
                            onMouseEnter={() => {
                                if (closeTimeoutRef.current) {
                                    clearTimeout(closeTimeoutRef.current);
                                }
                            }}
                            onMouseLeave={handleMenuLeave}
                            className="overflow-hidden bg-white border-t border-gray-100 shadow-xl"
                        >
                            <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-12 xl:px-16 py-9">
                                {activeMenuId === 'store' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Jelajahi Flagship
                                            </span>
                                            <ul className="mt-4 space-y-3">
                                                <li>
                                                    <Link
                                                        href="/buy/samsung-galaxy-s26-ultra"
                                                        className="text-2xl font-bold text-gray-950 hover:text-[#1428A0] transition-colors block"
                                                    >
                                                        Galaxy S26 Ultra 5G
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        href="/buy/samsung-galaxy-z-fold8"
                                                        className="text-2xl font-bold text-gray-950 hover:text-[#1428A0] transition-colors block"
                                                    >
                                                        Galaxy Z Fold8 5G
                                                    </Link>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveMenuId(null);
                                                            document.getElementById('carousel-section')?.scrollIntoView({ behavior: 'smooth' });
                                                        }}
                                                        className="text-lg font-semibold text-gray-800 hover:text-[#1428A0] transition-colors block text-left"
                                                    >
                                                        Galaxy Watch Ultra2
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveMenuId(null);
                                                            document.getElementById('carousel-section')?.scrollIntoView({ behavior: 'smooth' });
                                                        }}
                                                        className="text-lg font-semibold text-gray-800 hover:text-[#1428A0] transition-colors block text-left"
                                                    >
                                                        Galaxy Buds3 Pro
                                                    </button>
                                                </li>
                                                <li>
                                                    <span className="text-sm font-medium text-gray-500 block">
                                                        Aksesoris & S-Pen Original
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Tautan Cepat & Pengambilan
                                            </span>
                                            <ul className="mt-4 space-y-2.5 text-sm text-gray-700">
                                                <li>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveMenuId(null);
                                                            document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                                                        }}
                                                        className="hover:text-[#1428A0] transition-colors text-left font-medium"
                                                    >
                                                        Ambil di Gerai SES Mall (Siap 2 Jam)
                                                    </button>
                                                </li>
                                                <li>
                                                    <Link href="/track" className="hover:text-[#1428A0] transition-colors font-medium">
                                                        Lacak Status Pesanan & Nomor IMEI
                                                    </Link>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveMenuId(null);
                                                            document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                                                        }}
                                                        className="hover:text-[#1428A0] transition-colors text-left font-medium"
                                                    >
                                                        Garansi Resmi SEIN 1 Tahun
                                                    </button>
                                                </li>
                                                <li>
                                                    <span className="text-gray-500">Simulasi Program Trade-In (Tukar Tambah)</span>
                                                </li>
                                                <li>
                                                    <span className="text-gray-500">Lokasi 100+ Samsung Service Center</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Layanan Khusus Retail
                                            </span>
                                            <ul className="mt-4 space-y-2.5 text-sm text-gray-700">
                                                <li className="font-medium text-gray-800">
                                                    Kemasan Kotak Kayu Khusus & Asuransi 100%
                                                </li>
                                                <li className="text-gray-600">
                                                    Samsung Care+ Perlindungan Layar
                                                </li>
                                                <li className="text-gray-600">
                                                    Konsultasi Personal Spesifikasi Perangkat
                                                </li>
                                                <li className="text-emerald-700 font-medium">
                                                    Verifikasi Legalitas IMEI Kemenperin
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeMenuId === 's-series' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Lini Model S-Series
                                            </span>
                                            <ul className="mt-4 space-y-3">
                                                <li>
                                                    <Link
                                                        href="/buy/samsung-galaxy-s26-ultra"
                                                        className="text-2xl font-bold text-gray-950 hover:text-[#1428A0] transition-colors block"
                                                    >
                                                        Galaxy S26 Ultra 5G
                                                    </Link>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveMenuId(null);
                                                            document.getElementById('s26-ultra-section')?.scrollIntoView({ behavior: 'smooth' });
                                                        }}
                                                        className="text-base font-semibold text-gray-800 hover:text-[#1428A0] transition-colors block text-left"
                                                    >
                                                        Pelajari Spesifikasi S26 Ultra
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Pilihan Finis Titanium
                                            </span>
                                            <div className="mt-4 space-y-2 text-sm text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3.5 h-3.5 rounded-full bg-[#8c959e] border border-gray-300"></span>
                                                    <span>Titanium Silver Shadow</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3.5 h-3.5 rounded-full bg-[#161719] border border-gray-300"></span>
                                                    <span>Titanium Phantom Black</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3.5 h-3.5 rounded-full bg-[#3b334a] border border-gray-300"></span>
                                                    <span>Titanium Cobalt Violet</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3.5 h-3.5 rounded-full bg-[#c8b590] border border-gray-300"></span>
                                                    <span>Titanium Amber Gold</span>
                                                </div>
                                                <div className="pt-2 text-xs text-gray-500">
                                                    Kapasitas: 256GB / 512GB / 1TB
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Inovasi Flagship
                                            </span>
                                            <ul className="mt-4 space-y-2.5 text-sm text-gray-700">
                                                <li className="font-semibold text-gray-900">
                                                    Chipset Snapdragon 8 Elite 3nm
                                                </li>
                                                <li>Kamera 200MP Quad-Telephoto 5x/10x</li>
                                                <li>Stylus S-Pen Terintegrasi Bodi</li>
                                                <li>Layar 6.9" Dynamic AMOLED 2X 120Hz</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeMenuId === 'z-series' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Lini Model Z-Series
                                            </span>
                                            <ul className="mt-4 space-y-3">
                                                <li>
                                                    <Link
                                                        href="/buy/samsung-galaxy-z-fold8"
                                                        className="text-2xl font-bold text-gray-950 hover:text-[#1428A0] transition-colors block"
                                                    >
                                                        Galaxy Z Fold8 5G
                                                    </Link>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveMenuId(null);
                                                            document.getElementById('z-fold8-section')?.scrollIntoView({ behavior: 'smooth' });
                                                        }}
                                                        className="text-base font-semibold text-gray-800 hover:text-[#1428A0] transition-colors block text-left"
                                                    >
                                                        Pelajari Fitur Z Fold8
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Pilihan Finis & Kapasitas
                                            </span>
                                            <div className="mt-4 space-y-2 text-sm text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3.5 h-3.5 rounded-full bg-[#121316] border border-gray-300"></span>
                                                    <span>Crafted Black</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3.5 h-3.5 rounded-full bg-[#94a3b8] border border-gray-300"></span>
                                                    <span>Silver Shadow</span>
                                                </div>
                                                <div className="pt-2 text-xs text-gray-500">
                                                    Kapasitas: 512GB / 1TB
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Inovasi Layar Lipat
                                            </span>
                                            <ul className="mt-4 space-y-2.5 text-sm text-gray-700">
                                                <li className="font-semibold text-gray-900">
                                                    Layar Utama 8.0 Inci AMOLED 2X
                                                </li>
                                                <li>Layar Cover 6.5 Inci Ergonomis</li>
                                                <li>Engsel Slim Armor Hinge Tertipis</li>
                                                <li>Sertifikasi IP48 Water Resistant</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeMenuId === 'services' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Jaminan Resmi SEIN
                                            </span>
                                            <p className="mt-4 text-sm text-gray-700 leading-relaxed">
                                                Setiap unit memiliki nomor sertifikasi garansi PT Samsung Electronics Indonesia selama 12 bulan dan terdaftar langsung di basis data Kemenperin.
                                            </p>
                                        </div>

                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Gerai SES Mall Resmi
                                            </span>
                                            <ul className="mt-4 space-y-1.5 text-sm text-gray-700">
                                                <li>Grand Indonesia, Jakarta</li>
                                                <li>Central Park & Senayan City</li>
                                                <li>Pondok Indah Mall 3 & Kota Kasablanka</li>
                                                <li>Paris Van Java Bandung & TP6 Surabaya</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Bantuan Konsumen
                                            </span>
                                            <ul className="mt-4 space-y-2 text-sm text-gray-700">
                                                <li>Hotline WhatsApp Resmi Siaga</li>
                                                <li>Cek Validitas Faktur Pesanan</li>
                                                <li>Kebijakan Penggantian Unit Baru 7 Hari</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Discovery Content */}
            <main>

                {/* Cover Card to Fixed Header (Bramus Scroll-Driven Animation + Samsung Floating Header Pattern) */}
                <motion.section
                    aria-label="Samsung Galaxy S26 Ultra Showcase & Navigasi Produk"
                    className="fixed top-0 left-0 right-0 z-40 overflow-hidden text-white will-change-[height]"
                    style={{
                        height: heroCoverHeight,
                        backgroundColor: fixedHeaderBg,
                    }}
                >
                    {/* EXPANDED HERO LAYER (Full Cinema Canvas, fades & shrinks into fixed header) */}
                    <motion.div
                        style={{
                            opacity: heroExpandedOpacity,
                            pointerEvents: heroPointerEvents,
                        }}
                        className="absolute inset-0 w-full h-full pt-16 overflow-hidden"
                    >
                        {/* Background Hero Banner Image with Parallax Depth */}
                        <motion.div
                            style={{ y: s26ImageY }}
                            className="absolute inset-0 w-full h-full scale-[1.06] will-change-transform"
                        >
                            <picture className="w-full h-full block">
                                <source media="(max-width: 767px)" srcSet="/images/posters/s26-ultra-official-poster-mo.webp" type="image/webp" />
                                <source media="(max-width: 767px)" srcSet="/images/posters/s26-ultra-official-poster-mo.jpg" />
                                <source media="(min-width: 768px)" srcSet="/images/posters/s26-ultra-official-poster.webp" type="image/webp" />
                                <img
                                    src="/images/posters/s26-ultra-official-poster.jpg"
                                    alt="Samsung Galaxy S26 Ultra 5G - Galaxy AI Resmi SEIN"
                                    className="w-full h-full object-cover md:object-fill select-none pointer-events-none"
                                    fetchPriority="high"
                                    decoding="async"
                                />
                            </picture>
                        </motion.div>

                        {/* Negative Space Overlaid Hero Content */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-8 sm:pb-12 lg:pb-16 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                                className="max-w-md lg:max-w-lg space-y-3 pointer-events-auto"
                            >
                                <h1 className="sr-only">Samsung Galaxy S26 Ultra 5G - Galaxy AI</h1>

                                <p className="text-white/85 text-sm sm:text-base font-normal tracking-normal leading-relaxed drop-shadow-sm">
                                    Mulai dari <span className="text-white font-semibold">{formatRupiah(s26Model?.starting_price || 21999000)}</span> atau cicilan 0% hingga 24 bulan.
                                </p>

                                <div className="pt-1 flex items-center gap-5">
                                    <Link
                                        href="/buy/samsung-galaxy-s26-ultra"
                                        className="inline-flex items-center justify-center text-sm font-semibold px-7 py-2.5 rounded-full bg-white text-gray-900 hover:bg-[#0071E3] hover:text-white shadow-sm active:scale-[0.98] transition-all duration-200 ease-out cursor-pointer"
                                    >
                                        Beli
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            document.getElementById('z-fold8-section')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="inline-flex items-center text-sm font-medium text-white hover:text-white/80 transition-colors underline underline-offset-8 decoration-white/40 hover:decoration-white py-1 cursor-pointer"
                                    >
                                        Lebih detail &rsaquo;
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* COLLAPSED SAMSUNG FLOATING PRODUCT NAVIGATION BAR LAYER */}
                    <motion.div
                        style={{
                            opacity: fixedHeaderOpacity,
                            pointerEvents: fixedHeaderPointerEvents,
                        }}
                        className="absolute inset-0 w-full h-[60px] flex items-center border-b border-white/10 backdrop-blur-md z-20"
                    >
                        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
                            {/* Left: Product Headline + Galaxy AI Badge */}
                            <div className="flex items-center gap-2.5">
                                <span className="text-sm sm:text-base font-semibold tracking-tight text-white flex items-center">
                                    {activeProduct === 's26' ? 'Galaxy S26 Ultra 5G' : 'Galaxy Z Fold8 5G'}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 border border-blue-400/35 text-[10px] font-bold tracking-wider text-blue-300 uppercase shadow-2xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                                    Galaxy AI
                                </span>
                            </div>

                            {/* Center: Quick Anchor Tabs (Desktop) */}
                            <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-medium text-white/70">
                                <button
                                    type="button"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className={`transition-colors hover:text-white cursor-pointer ${
                                        activeProduct === 's26' ? 'text-white font-semibold' : ''
                                    }`}
                                >
                                    Galaxy S26 Ultra
                                </button>
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('z-fold8-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className={`transition-colors hover:text-white cursor-pointer ${
                                        activeProduct === 'fold8' ? 'text-white font-semibold' : ''
                                    }`}
                                >
                                    Galaxy Z Fold8
                                </button>
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="transition-colors hover:text-white cursor-pointer"
                                >
                                    Fitur Unggulan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('carousel-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="transition-colors hover:text-white cursor-pointer"
                                >
                                    Ekosistem
                                </button>
                            </nav>

                            {/* Right: Price & CTA Button */}
                            <div className="flex items-center gap-3 sm:gap-5">
                                <div className="text-right hidden sm:block">
                                    <span className="text-[10px] text-white/50 block leading-tight">Harga Resmi</span>
                                    <span className="text-xs sm:text-sm font-semibold text-white">
                                        {activeProduct === 's26'
                                            ? formatRupiah(s26Model?.starting_price || 21999000)
                                            : formatRupiah(foldModel?.starting_price || 26999000)}
                                    </span>
                                </div>
                                <Link
                                    href={activeProduct === 's26' ? '/buy/samsung-galaxy-s26-ultra' : '/buy/samsung-galaxy-z-fold8'}
                                    className="inline-flex items-center justify-center text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2 rounded-full bg-white text-gray-950 hover:bg-[#0071E3] hover:text-white transition-all duration-150 shadow-sm active:scale-95 cursor-pointer"
                                >
                                    Beli
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </motion.section>

                {/* Hero Scroll Spacer Track: Holds physical document height so content scrolls seamlessly */}
                <div
                    id="s26-ultra-section"
                    ref={s26SectionRef}
                    className="w-full relative overflow-hidden scroll-mt-16 pointer-events-none"
                    style={{ height: `${heroHeight}px` }}
                    aria-hidden="true"
                />

                {/* FULLPAGE GALAXY Z FOLD8 SHOWCASE (Official Samsung Keynote Canvas) */}
                <section
                    id="z-fold8-section"
                    ref={foldSectionRef}
                    className="relative w-full bg-[#1b1527] text-white overflow-hidden scroll-mt-14 mb-3 sm:mb-4 lg:mb-6"
                >
                    <div className="relative w-full aspect-[720/1080] md:aspect-[1440/640] max-h-[720px] mx-auto overflow-hidden">
                        {/* Background Hero Banner - Responsive Picture with Subtle Cinematic Parallax */}
                        <motion.div
                            style={{ y: foldImageY }}
                            className="absolute inset-0 w-full h-full scale-[1.06] will-change-transform"
                        >
                            <picture className="w-full h-full block">
                                <source media="(max-width: 767px)" srcSet="/images/posters/zfold8-official-poster-mo.webp" type="image/webp" />
                                <source media="(max-width: 767px)" srcSet="/images/posters/zfold8-official-poster-mo.jpg" />
                                <source media="(min-width: 768px)" srcSet="/images/posters/zfold8-official-poster.webp" type="image/webp" />
                                <img
                                    src="/images/posters/zfold8-official-poster.jpg"
                                    alt="Samsung Galaxy Z Fold8 5G - Galaxy AI Resmi SEIN"
                                    className="w-full h-full object-cover md:object-fill select-none pointer-events-none"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </picture>
                        </motion.div>

                        {/* Negative Space Overlaid Content (Directly below Galaxy Z Fold8 / Galaxy AI on the right) */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 sm:px-12 md:px-0 md:left-[51%] md:right-8 lg:right-16 pb-8 sm:pb-12 lg:pb-16 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                                className="max-w-md lg:max-w-lg space-y-3 pointer-events-auto text-left"
                            >
                                <h2 className="sr-only">Samsung Galaxy Z Fold8 5G - Galaxy AI</h2>

                                <p className="text-white/85 text-sm sm:text-base font-normal tracking-normal leading-relaxed drop-shadow-sm">
                                    Mulai dari <span className="text-white font-semibold">{formatRupiah(foldModel?.starting_price || 26999000)}</span> atau cicilan 0% hingga 24 bulan.
                                </p>

                                <div className="pt-1 flex items-center gap-5">
                                    <Link
                                        href="/buy/samsung-galaxy-z-fold8"
                                        className="inline-flex items-center justify-center text-sm font-semibold px-7 py-2.5 rounded-full bg-white text-gray-900 hover:bg-[#0071E3] hover:text-white shadow-sm active:scale-[0.98] transition-all duration-200 ease-out"
                                    >
                                        Beli
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="inline-flex items-center text-sm font-medium text-white hover:text-white/80 transition-colors underline underline-offset-8 decoration-white/40 hover:decoration-white py-1"
                                    >
                                        Lebih detail &rsaquo;
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* SYMMETRICAL 6-COLUMN BENTO GRID (Samsung One UI Aesthetic, Zero AI-Slop) */}
                <section
                    id="features-section"
                    className="py-20 sm:py-24 bg-white border-b border-[#E5E5EA] scroll-mt-20"
                >
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center max-w-3xl mx-auto mb-16"
                        >
                            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#86868B]">
                                Keuntungan Pembelian Resmi
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F] mt-2">
                                Beli langsung. Dapat lebih banyak.
                            </h2>
                            <p className="text-base text-[#6E6E73] mt-3">
                                Unit bergaransi resmi SEIN dengan jaminan suku cadang nasional, proteksi pengiriman penuh, dan kemudahan pengambilan di Samsung Experience Store.
                            </p>
                        </motion.div>

                        {/* Symmetrical 6-Column Grid: Row 1 (4 + 2 = 6), Row 2 (2 + 2 + 2 = 6) with Staggered Entrance */}
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                            {/* Ubin 1: Galaxy AI (Col span 4) with Official Poster Banner */}
                            <motion.div
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                                className="md:col-span-4 p-8 sm:p-10 rounded-2xl bg-[#F5F5F7] flex flex-col justify-between overflow-hidden"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
                                    <div className="sm:col-span-7 space-y-4 text-left">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                                            Galaxy AI Terintegrasi
                                        </span>
                                        <h3 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
                                            Kecerdasan untuk rutinitas harian.
                                        </h3>
                                        <p className="text-sm text-[#6E6E73] leading-relaxed">
                                            Galaxy AI didesain untuk menyederhanakan aktivitas Anda, mulai dari pencarian visual instan di layar, terjemahan panggilan langsung, hingga penyempurnaan foto pintar. Seluruh data diproses secara privat dan aman di perangkat Galaxy Anda.
                                        </p>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <span className="text-xs font-medium text-[#1D1D1F] bg-white px-3 py-1.5 rounded-lg border border-gray-200/80 shadow-2xs">
                                                Circle to Search with Google
                                            </span>
                                            <span className="text-xs font-medium text-[#1D1D1F] bg-white px-3 py-1.5 rounded-lg border border-gray-200/80 shadow-2xs">
                                                Live Translate
                                            </span>
                                            <span className="text-xs font-medium text-[#1D1D1F] bg-white px-3 py-1.5 rounded-lg border border-gray-200/80 shadow-2xs">
                                                Photo Assist
                                            </span>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-5 flex justify-center">
                                        <div className="rounded-xl overflow-hidden shadow-xs bg-white w-full max-w-[320px]">
                                            <img
                                                src="/images/posters/zfold8-family-banner.webp"
                                                alt="Galaxy AI Official Poster"
                                                className="w-full h-auto object-cover"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-[#E5E5EA] flex flex-wrap items-center justify-between text-xs text-[#86868B] gap-2">
                                    <span>Tersedia standar di lini Galaxy S26 Ultra dan Galaxy Z Fold8</span>
                                    <span className="text-[#0071E3] font-medium">Fitur Resmi Terintegrasi</span>
                                </div>
                            </motion.div>

                            {/* Ubin 2: Ekosistem Galaxy Watch Ultra & Buds3 Pro (Col span 2) */}
                            <motion.div
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                                className="md:col-span-2 p-8 rounded-2xl bg-[#F5F5F7] flex flex-col justify-between"
                            >
                                <div>
                                    <div className="h-44 flex items-center justify-center gap-5 mb-4">
                                        <img
                                            src="/images/products/watch-ultra.webp"
                                            alt="Galaxy Watch Ultra"
                                            className="h-32 sm:h-36 object-contain drop-shadow-sm"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <img
                                            src="/images/products/buds3-pro.webp"
                                            alt="Galaxy Buds3 Pro"
                                            className="h-28 sm:h-30 object-contain drop-shadow-sm"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                                        Ekosistem Terhubung
                                    </span>
                                    <h3 className="text-xl font-semibold text-[#1D1D1F] mt-1 tracking-tight">
                                        Watch Ultra &amp; Buds3 Pro
                                    </h3>
                                    <p className="text-xs text-[#6E6E73] mt-2 leading-relaxed">
                                        Sinkronisasi instan sensor kesehatan presisi dan audio fidelitas 24-bit tanpa jeda untuk menemani mobilitas harian Anda.
                                    </p>
                                </div>
                                <div className="mt-8 pt-4 border-t border-[#E5E5EA] flex items-center justify-between text-xs font-medium">
                                    <span className="text-[#86868B]">Mulai Rp 3.299.000</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            document.getElementById('carousel-section')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-[#0071E3] hover:underline inline-flex items-center gap-1"
                                    >
                                        Jelajahi Aksesoris &rsaquo;
                                    </button>
                                </div>
                            </motion.div>

                            {/* Ubin 3: 100% Garansi Resmi SEIN 1 Tahun (Samsung One UI Shield Icon) */}
                            <motion.div
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                                className="md:col-span-2 p-8 rounded-2xl bg-[#F5F5F7] flex flex-col justify-between hover:bg-[#F0F2F5] transition-colors duration-200"
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-[#EDF4FE] text-[#0071E3] flex items-center justify-center mb-6">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                                        100% Unit Asli SEIN
                                    </span>
                                    <h3 className="text-xl font-semibold text-[#1D1D1F] mt-1 tracking-tight">
                                        Garansi Resmi SEIN 1 Tahun
                                    </h3>
                                    <p className="text-xs text-[#6E6E73] mt-2 leading-relaxed">
                                        Perlindungan suku cadang resmi di 100+ Samsung Service Center nasional dengan nomor IMEI terverifikasi di Kemenperin.
                                    </p>
                                </div>
                                <div className="mt-8 pt-4 border-t border-[#E5E5EA] flex items-center justify-between text-xs font-medium">
                                    <span className="text-[#86868B]">100+ Service Center</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-[#0071E3] hover:underline"
                                    >
                                        Lebih detail &rsaquo;
                                    </button>
                                </div>
                            </motion.div>

                            {/* Ubin 4: Siap Diambil 2 Jam di SES Mall (Samsung One UI Storefront Icon) */}
                            <motion.div
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                                className="md:col-span-2 p-8 rounded-2xl bg-[#F5F5F7] flex flex-col justify-between hover:bg-[#F0F2F5] transition-colors duration-200"
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-[#EDF4FE] text-[#0071E3] flex items-center justify-center mb-6">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.614A2.996 2.996 0 009.75 9.35c.83 0 1.6-.337 2.164-.89a3 3 0 004.336.002c.563.551 1.333.888 2.162.888a3.001 3.001 0 003.75-.614V3.75a.75.75 0 00-.75-.75H2.612a.75.75 0 00-.75.75v5.6z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                                        Ambil di Mall Favorit
                                    </span>
                                    <h3 className="text-xl font-semibold text-[#1D1D1F] mt-1 tracking-tight">
                                        Siap Diambil dalam 2 Jam
                                    </h3>
                                    <p className="text-xs text-[#6E6E73] mt-2 leading-relaxed">
                                        Pesan secara online dan ambil unit baru Anda langsung di gerai Samsung Experience Store mall terkemuka tanpa antre.
                                    </p>
                                </div>
                                <div className="mt-8 pt-4 border-t border-[#E5E5EA] flex items-center justify-between text-xs font-medium">
                                    <span className="text-[#86868B]">8 Mall Flagship</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-[#0071E3] hover:underline"
                                    >
                                        Lebih detail &rsaquo;
                                    </button>
                                </div>
                            </motion.div>

                            {/* Ubin 5: Pengiriman Aman & Proteksi 100% (Samsung One UI Delivery Shield Icon) */}
                            <motion.div
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.55, delay: 0.30, ease: [0.16, 1, 0.3, 1] }}
                                className="md:col-span-2 p-8 rounded-2xl bg-[#F5F5F7] flex flex-col justify-between hover:bg-[#F0F2F5] transition-colors duration-200"
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-[#EDF4FE] text-[#0071E3] flex items-center justify-center mb-6">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V4.5a1.5 1.5 0 00-1.5-1.5H5.25A1.5 1.5 0 003.75 4.5v9.75m10.5-6.75h4.875c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125H14.25m-4.5-1.5l2.25 2.25 3.75-3.75" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                                        Tukar Tambah &amp; Proteksi
                                    </span>
                                    <h3 className="text-xl font-semibold text-[#1D1D1F] mt-1 tracking-tight">
                                        Pengiriman Aman &amp; Proteksi 100%
                                    </h3>
                                    <p className="text-xs text-[#6E6E73] mt-2 leading-relaxed">
                                        Tukar smartphone lama dengan estimasi nilai instan, serta pengiriman khusus kemasan kayu bersegel dengan perlindungan asuransi penuh.
                                    </p>
                                </div>
                                <div className="mt-8 pt-4 border-t border-[#E5E5EA] flex items-center justify-between text-xs font-medium">
                                    <span className="text-[#86868B]">Kemasan Bersegel</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-[#0071E3] hover:underline"
                                    >
                                        Lebih detail &rsaquo;
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* OFFICIAL GALAXY ECOSYSTEM RECOMMENDATION CAROUSEL */}
                <section id="carousel-section" className="py-14 sm:py-16 bg-[#F8F9FA] overflow-hidden">
                    {/* Section Header with Top-Right Navigation Arrows (Aligned with max-w-7xl grid) */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-end justify-between mb-8 sm:mb-10"
                        >
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                                    Eksplorasi Perangkat Galaxy Resmi
                                </h2>
                                <p className="text-sm sm:text-base text-gray-500 mt-1">
                                    Pilih smartphone, tablet, atau aksesoris resmi bergaransi SEIN 1 tahun.
                                </p>
                            </div>

                            {/* Top Right Navigation Arrow Controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => scrollCarousel('left')}
                                    disabled={!canScrollLeft}
                                    aria-label="Gulir ke kiri"
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 bg-white shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:scale-95 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollCarousel('right')}
                                    disabled={!canScrollRight}
                                    aria-label="Gulir ke kanan"
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 bg-white shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:scale-95 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Full-Bleed Horizontal Scroll Track (Responsive across all screen ratios) */}
                    <div
                        ref={carouselRef}
                        onScroll={updateCarouselStatus}
                        className="w-full flex items-stretch gap-4 sm:gap-5 overflow-x-auto pt-2 pb-6 scrollbar-none scroll-smooth snap-x snap-mandatory carousel-track-gutter"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {carouselProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.55, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                className="flex-shrink-0 snap-start"
                            >
                                <Link
                                    href={product.link}
                                    className="relative w-[80vw] sm:w-[280px] md:w-[290px] lg:w-[290px] xl:w-[290px] h-[465px] sm:h-[485px] rounded-3xl bg-white p-5 sm:p-6 flex flex-col justify-between border border-gray-100 shadow-xs hover:shadow-md transition-shadow duration-200 group cursor-pointer block"
                                >
                                    <div>
                                        {/* Large Product Image Centered */}
                                        <div className="py-2 flex items-center justify-center h-52 sm:h-56 w-full overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                loading="lazy"
                                                decoding="async"
                                                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-103"
                                            />
                                        </div>

                                        {/* Product Name & Subtitle */}
                                        <div className="mt-2">
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                                                {product.subtitle}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Visible Divider Line & Non-Bold Price */}
                                    <div className="mt-4 pt-3.5 flex items-end justify-between border-t border-gray-100">
                                        <div>
                                            <span className="block text-[11px] text-gray-400 font-normal">
                                                Harga Resmi
                                            </span>
                                            <span className="text-sm sm:text-base font-normal text-gray-900 leading-tight block">
                                                {formatRupiah(product.price)}
                                            </span>
                                        </div>
                                        <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-medium tracking-tight shadow-xs transition-colors duration-150">
                                            Beli
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Centered Scroll Progress Bar Indicator */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-center mt-6">
                            <div className="w-48 sm:w-56 h-1 bg-gray-200 rounded-full overflow-hidden relative">
                                <div
                                    className="h-full bg-black rounded-full transition-all duration-150"
                                    style={{ width: `${Math.max(16, scrollProgress)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* EXTENDED RETAIL FOOTER */}
            <footer className="bg-[#F8F9FA] border-t border-gray-200 text-gray-600 text-xs py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Legal Notes */}
                    <div className="space-y-2 border-b border-gray-200 pb-8 text-gray-500 leading-relaxed">
                        <p>
                            1. Seluruh perangkat Samsung Galaxy S26 Ultra 5G dan Galaxy Z Fold8 5G yang dijual melalui situs ini adalah unit resmi baru bersegel pabrik dengan nomor sertifikasi garansi PT Samsung Electronics Indonesia (SEIN).
                        </p>
                        <p>
                            2. Layanan purna jual berlaku di seluruh jaringan Samsung Service Center resmi di Indonesia selama 12 bulan sejak tanggal penerbitan faktur pembelian.
                        </p>
                        <p>
                            3. Waktu pengambilan di gerai Samsung Experience Store (SES) dapat dilakukan pada jam operasional mall (10.00 - 21.00 WIB) dengan menunjukkan nomor faktur dan bukti identitas diri.
                        </p>
                    </div>

                    {/* Footer Nav Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
                        <div>
                            <div className="font-semibold text-gray-900 mb-3">Lini Produk</div>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/buy/samsung-galaxy-s26-ultra" className="hover:text-[#1428A0]">
                                        Galaxy S26 Ultra 5G
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/buy/samsung-galaxy-z-fold8" className="hover:text-[#1428A0]">
                                        Galaxy Z Fold8 5G
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('carousel-section')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="hover:text-[#1428A0] text-left"
                                    >
                                        Galaxy Watch Ultra2
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('carousel-section')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="hover:text-[#1428A0] text-left"
                                    >
                                        Galaxy Buds3 Pro
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 mb-3">Layanan Konsumen</div>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/track" className="hover:text-[#1428A0]">
                                        Lacak Status Pesanan
                                    </Link>
                                </li>
                                <li>
                                    <span className="text-gray-400">Verifikasi Garansi SEIN</span>
                                </li>
                                <li>
                                    <span className="text-gray-400">Lokasi Samsung Service Center</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 mb-3">Pengambilan & Kirim</div>
                            <ul className="space-y-2">
                                <li>
                                    <span className="text-gray-400">Samsung Experience Store Mall</span>
                                </li>
                                <li>
                                    <span className="text-gray-400">Asuransi Pengiriman Gadget</span>
                                </li>
                                <li>
                                    <span className="text-gray-400">Ketentuan Retur & Tukar Baru</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 mb-3">Keamanan Transaksi</div>
                            <ul className="space-y-2">
                                <li>
                                    <span className="text-gray-400">Enkripsi Checkout 256-Bit</span>
                                </li>
                                <li>
                                    <span className="text-gray-400">Pemberitahuan Faktur WhatsApp</span>
                                </li>
                                <li>
                                    <span className="text-gray-400">QRIS & Virtual Account Nasional</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright & Disclaimer */}
                    <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo/galax-lockup.svg"
                                alt="Galax — Samsung Authorized Reseller"
                                className="h-8 w-auto opacity-85"
                            />
                            <p>© 2026 Galax Store Indonesia. Rekanan Resmi Berlisensi Samsung Electronics Indonesia.</p>
                        </div>
                        <p>Semua merek dagang Samsung, Galaxy, dan Dynamic AMOLED adalah hak cipta Samsung Electronics Co., Ltd.</p>
                    </div>
                </div>
            </footer>

            {/* Interactive Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.96 }}
                            transition={springConfig}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
                        >
                            {/* Search Input Bar */}
                            <div className="flex items-center gap-3 px-6 py-4.5 border-b border-gray-100">
                                <SearchIcon className="w-5 h-5 text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari Galaxy S26 Ultra, Z Fold8, garansi SEIN..."
                                    className="w-full text-base sm:text-lg bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="text-xs font-semibold text-gray-400 hover:text-gray-700 px-2 py-1 cursor-pointer"
                                    >
                                        Hapus
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                    aria-label="Tutup pencarian"
                                >
                                    <CloseIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Suggestions / Results */}
                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    {searchQuery.trim() ? 'Hasil Pencarian Produk & Layanan' : 'Rekomendasi Cepat'}
                                </div>

                                <div className="space-y-2">
                                    {filteredSearchResults.length > 0 ? (
                                        filteredSearchResults.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={item.url}
                                                onClick={() => setIsSearchOpen(false)}
                                                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                                            >
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900 group-hover:text-[#1428A0] transition-colors">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        {item.category}
                                                    </div>
                                                </div>
                                                <span className="text-xs font-medium text-gray-700 bg-gray-100 group-hover:bg-blue-50 group-hover:text-[#1428A0] px-3 py-1 rounded-full transition-colors">
                                                    {item.price}
                                                </span>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-sm text-gray-500">
                                            Tidak ada hasil untuk "{searchQuery}". Coba kata kunci seperti{' '}
                                            <button type="button" onClick={() => setSearchQuery('S26')} className="text-[#1428A0] underline font-medium cursor-pointer">
                                                S26
                                            </button>
                                            ,{' '}
                                            <button type="button" onClick={() => setSearchQuery('Fold')} className="text-[#1428A0] underline font-medium cursor-pointer">
                                                Fold
                                            </button>
                                            , atau{' '}
                                            <button type="button" onClick={() => setSearchQuery('Lacak')} className="text-[#1428A0] underline font-medium cursor-pointer">
                                                Lacak
                                            </button>
                                            .
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interactive Cart Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end"
                        onClick={() => setIsCartOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
                        >
                            {/* Cart Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <CartIcon className="w-5 h-5 text-gray-900" />
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Keranjang Belanja
                                    </h2>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                        0 item
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                    aria-label="Tutup keranjang"
                                >
                                    <CloseIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Cart Body */}
                            <div className="p-6 flex-1 overflow-y-auto flex flex-col justify-center items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
                                    <CartIcon className="w-8 h-8 stroke-[1.5]" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">
                                    Keranjang Belanja Anda Kosong
                                </h3>
                                <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed">
                                    Pilih produk flagship Samsung Galaxy bergaransi resmi SEIN untuk memulai pemesanan.
                                </p>

                                <div className="w-full mt-6 space-y-3 text-left">
                                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                        Rekomendasi Flagship
                                    </div>

                                    <Link
                                        href="/buy/samsung-galaxy-s26-ultra"
                                        onClick={() => setIsCartOpen(false)}
                                        className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:border-[#2189FF] hover:bg-blue-50/30 transition-all group"
                                    >
                                        <div>
                                            <div className="text-sm font-bold text-gray-900 group-hover:text-[#1428A0] transition-colors">
                                                Galaxy S26 Ultra 5G
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                Mulai Rp 21.999.000 &bull; Titanium
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-white bg-[#2189FF] px-3.5 py-1.5 rounded-full shadow-xs">
                                            Beli
                                        </span>
                                    </Link>

                                    <Link
                                        href="/buy/samsung-galaxy-z-fold8"
                                        onClick={() => setIsCartOpen(false)}
                                        className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:border-[#2189FF] hover:bg-blue-50/30 transition-all group"
                                    >
                                        <div>
                                            <div className="text-sm font-bold text-gray-900 group-hover:text-[#1428A0] transition-colors">
                                                Galaxy Z Fold8 5G
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                Mulai Rp 28.499.000 &bull; 8.0" Fold
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-white bg-[#2189FF] px-3.5 py-1.5 rounded-full shadow-xs">
                                            Beli
                                        </span>
                                    </Link>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 w-full space-y-2 text-xs text-gray-500 text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-600 font-bold">✓</span> Garansi Resmi 1 Tahun SEIN Indonesia
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-600 font-bold">✓</span> Gratis Ongkir & Asuransi Seluruh Indonesia
                                    </div>
                                </div>
                            </div>

                            {/* Cart Footer */}
                            <div className="p-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-900 transition-colors cursor-pointer"
                                >
                                    Lanjutkan Belanja
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interactive Login Modal */}
            <AnimatePresence>
                {isLoginModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsLoginModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 12 }}
                            transition={springConfig}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 relative"
                        >
                            <button
                                type="button"
                                onClick={() => setIsLoginModalOpen(false)}
                                className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                aria-label="Tutup modal"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>

                            <div className="mb-6">
                                <img
                                    src="/images/logo/galax-lockup.svg"
                                    alt="Galax — Samsung Authorized Reseller"
                                    className="h-8 w-auto mb-3"
                                />
                                <h2 className="text-xl font-bold text-gray-950 font-samsung">
                                    Masuk ke Akun Galax
                                </h2>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    Akses riwayat pesanan resmi SEIN, cek invoice digital, dan kemudahan klaim garansi.
                                </p>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    alert('Autentikasi akun demo berhasil. Silakan lanjutkan navigasi atau pelacakan pesanan.');
                                    setIsLoginModalOpen(false);
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                        Email atau No. Handphone
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="nama@email.com atau 0812..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2189FF] focus:ring-2 focus:ring-[#2189FF]/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-semibold text-gray-700">
                                            Kata Sandi
                                        </label>
                                        <a
                                            href="#forgot"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                alert('Tautan reset kata sandi telah dikirimkan ke email terdaftar Anda.');
                                            }}
                                            className="text-xs text-[#2189FF] hover:underline font-medium"
                                        >
                                            Lupa kata sandi?
                                        </a>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2189FF] focus:ring-2 focus:ring-[#2189FF]/20 transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-full bg-[#2189FF] hover:bg-[#1a70d4] text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
                                >
                                    Masuk
                                </button>
                            </form>

                            <div className="my-5 flex items-center gap-3">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                                    atau
                                </span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    alert('Mengalihkan ke verifikasi Samsung Account resmi...');
                                    setIsLoginModalOpen(false);
                                }}
                                className="w-full py-2.5 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-xs font-semibold text-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                </svg>
                                Masuk dengan Samsung Account
                            </button>

                            <p className="mt-5 text-[11px] text-gray-400 text-center leading-relaxed">
                                Belum punya akun? Akun Anda dibuat secara otomatis saat pertama kali menyelesaikan transaksi pesanan di Galax Store.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
