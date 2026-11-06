<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Official Favicon -->
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="alternate icon" href="/favicon.ico">

        <!-- LCP Hero Image Preload (Zero Resource Load Delay) -->
        <link rel="preload" as="image" href="/images/posters/s26-ultra-official-poster-mo.webp" type="image/webp" media="(max-width: 767px)" fetchpriority="high">
        <link rel="preload" as="image" href="/images/posters/s26-ultra-official-poster.webp" type="image/webp" media="(min-width: 768px)" fetchpriority="high">

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 min-h-screen">
        @inertia
    </body>
</html>
