import { test, expect } from '@playwright/test';

test.describe('Samsung Authorized Storefront Redesign E2E', () => {
    test('verifies Apple/Samsung unified layout, keynote stage, bento grid, and enlarged responsive carousel', async ({ page }) => {
        // Set standard desktop viewport (1440x900)
        await page.setViewportSize({ width: 1440, height: 900 });

        // 1. Navigate to homepage
        await page.goto('/');
        await expect(page).toHaveTitle(/Samsung Authorized Reseller/i);

        // Verify Brand Logo
        const brandLogo = page.locator('text=SAMSUNG');
        await expect(brandLogo.first()).toBeVisible();

        // 2. Verify Unified Keynote Theater Stage (Apple Pro Black #000000)
        const s26Section = page.locator('#s26-ultra-section');
        await expect(s26Section).toBeVisible();
        await expect(s26Section.getByText('Galaxy S26 Ultra')).toBeVisible();
        await expect(s26Section.getByRole('heading', { name: /Presisi Titanium/i })).toBeVisible();

        // Check official October 2026 campaign poster
        const campaignImg = page.locator('img[alt="Samsung Galaxy S26 Ultra Poster Resmi SEIN"]');
        await expect(campaignImg).toBeVisible();

        // Check Apple-style pill action buttons
        await expect(s26Section.getByRole('link', { name: /Beli Sekarang/i })).toBeVisible();
        await expect(s26Section.getByRole('button', { name: /Jelajahi Seri Lipat Z Fold8/i })).toBeVisible();

        await page.screenshot({ path: 'e2e/screenshots/00_unified_keynote_stage.png' });

        // 3. Test Apple Clean Typographic Mega-Menu
        const storeNavBtn = page.getByRole('button', { name: 'Store', exact: true });
        await expect(storeNavBtn).toBeVisible();

        // Hover over Store button to trigger mega-menu expansion
        await storeNavBtn.hover();
        await page.waitForTimeout(400);

        // Verify 3 columns of Store mega-menu
        await expect(page.getByText('Jelajahi Flagship')).toBeVisible();
        await expect(page.getByText('Tautan Cepat & Pengambilan')).toBeVisible();
        await expect(page.getByText('Layanan Khusus Retail')).toBeVisible();

        // Take screenshot of open Mega-Menu
        await page.screenshot({ path: 'e2e/screenshots/01_mega_menu_open.png' });

        // Move mouse to logo to close mega-menu cleanly
        await brandLogo.first().hover();
        await page.waitForTimeout(400);

        // 4. Test Hero Section 2: Galaxy Z Fold8 (Apple High-Key Canvas #F5F5F7)
        const foldSection = page.locator('#z-fold8-section');
        await foldSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);

        const foldHeadline = foldSection.getByRole('heading', { name: /Layar Lipat 8.0 Inci/i });
        await expect(foldHeadline).toBeVisible();

        // Check official Z Fold8 Ultra horizontal poster
        const zFoldPosterImg = page.locator('img[alt="Samsung Galaxy Z Fold8 Ultra Poster Resmi SEIN"]');
        await expect(zFoldPosterImg).toBeVisible();

        await page.screenshot({ path: 'e2e/screenshots/02_hero_zfold8_showcase.png' });

        // 5. Test Symmetrical Bento Grid (Zero Border Pollution, Clean SVGs)
        const bentoSection = page.locator('#features-section');
        await bentoSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);

        await expect(page.getByText('Kecerdasan Buatan yang Nyata')).toBeVisible();
        await expect(page.locator('img[alt="Galaxy AI Official Poster"]')).toBeVisible();
        await expect(page.getByText('Watch Ultra & Buds3 Pro')).toBeVisible();
        await expect(page.getByText('Garansi Resmi SEIN 1 Tahun').first()).toBeVisible();
        await expect(page.getByText('Siap Diambil dalam 2 Jam')).toBeVisible();
        await expect(page.getByText('Trade-In & Asuransi 100%')).toBeVisible();

        await page.screenshot({ path: 'e2e/screenshots/03_bento_grid.png' });

        // 6. Test Apple-Style Rekomendasi Horizontal Carousel with Enlarged Auto-Layout
        const carouselSection = page.locator('#carousel-section');
        await carouselSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);

        await expect(page.getByText('Rekomendasi Produk:')).toBeVisible();
        await expect(page.getByText(/The latest\. Take a look at what/i)).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Galaxy S26 Ultra 5G' })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Galaxy Z Fold8/i })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Galaxy Watch Ultra' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Galaxy Buds3 Pro' })).toBeVisible();

        // Verify authentic 2026 product images are referenced
        const s26CarouselImg = carouselSection.locator('img[alt="Galaxy S26 Ultra 5G"]');
        await expect(s26CarouselImg).toBeVisible();
        const s26Src = await s26CarouselImg.getAttribute('src');
        expect(s26Src).toContain('s26-ultra-2026.jpg');

        const foldCarouselImg = carouselSection.locator('img[alt*="Galaxy Z Fold8"]');
        await expect(foldCarouselImg).toBeVisible();
        const foldSrc = await foldCarouselImg.getAttribute('src');
        expect(foldSrc).toContain('zfold8-2026.jpg');

        // Scroll carousel into view perfectly aligned at top
        await page.evaluate(() => document.getElementById('carousel-section').scrollIntoView({ block: 'start' }));
        await page.waitForTimeout(400);

        // Capture initial carousel view showing S26 Ultra 5G and Fold8 Ultra 5G
        await page.screenshot({ path: 'e2e/screenshots/04_carousel_initial_1440.png' });

        // Log carousel layout coordinates
        const debugData = await page.evaluate(() => {
            const track = document.getElementById('carousel-section').querySelector('.overflow-x-auto');
            const cards = Array.from(track.children);
            return {
                trackClientWidth: track.clientWidth,
                trackScrollWidth: track.scrollWidth,
                paddingLeft: getComputedStyle(track).paddingLeft,
                paddingRight: getComputedStyle(track).paddingRight,
                cards: cards.map((c, i) => ({
                    index: i,
                    offsetLeft: c.offsetLeft,
                    offsetWidth: c.offsetWidth,
                    rightEdge: c.offsetLeft + c.offsetWidth,
                })),
            };
        });
        console.log('CAROUSEL_DEBUG:', JSON.stringify(debugData));

        // Hover over the fourth card (Galaxy Buds3 Pro) to verify cutoff behavior
        const budsCard = carouselSection.locator('.group').nth(3);
        await budsCard.hover();
        await page.waitForTimeout(400);
        await page.screenshot({ path: 'e2e/screenshots/04_carousel_buds_card_hover.png' });

        // Hover over the first card (Galaxy S26 Ultra) to verify full-card Apple Store hover scale animation
        const firstCard = carouselSection.locator('.group').first();
        await firstCard.hover();
        await page.waitForTimeout(400);
        await page.screenshot({ path: 'e2e/screenshots/04_carousel_card_hover.png' });

        // Test Carousel Scroll Buttons
        const nextButton = page.locator('button[aria-label="Gulir ke kanan"]');
        await expect(nextButton).toBeVisible();
        if (await nextButton.isEnabled()) {
            await nextButton.click();
            await page.waitForTimeout(600);
        }

        await page.screenshot({ path: 'e2e/screenshots/04_carousel_scrolled_1440.png' });

        // Reset scroll position to start
        const prevButton = page.locator('button[aria-label="Gulir ke kiri"]');
        if (await prevButton.isEnabled()) {
            await prevButton.click();
            await page.waitForTimeout(600);
        }

        // 7. Test Responsive Auto-Layout at 1920x1080 (1080p Desktop Full HD)
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.evaluate(() => document.getElementById('carousel-section').scrollIntoView({ block: 'start' }));
        await page.waitForTimeout(400);
        await page.screenshot({ path: 'e2e/screenshots/04_carousel_section_1920.png' });

        // 8. Test Responsive Auto-Layout at 2560x1080 (Ultrawide 21:9)
        await page.setViewportSize({ width: 2560, height: 1080 });
        await page.evaluate(() => document.getElementById('carousel-section').scrollIntoView({ block: 'start' }));
        await page.waitForTimeout(400);
        await page.screenshot({ path: 'e2e/screenshots/04_carousel_section_2560_ultrawide.png' });

        // 9. Test Responsive Auto-Layout at 768x1024 (Tablet)
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.evaluate(() => document.getElementById('carousel-section').scrollIntoView({ block: 'start' }));
        await page.waitForTimeout(400);
        await page.screenshot({ path: 'e2e/screenshots/04_carousel_section_768_tablet.png' });

        // 10. Test Responsive Auto-Layout at 390x844 (Mobile Smartphone)
        await page.setViewportSize({ width: 390, height: 844 });
        await page.evaluate(() => document.getElementById('carousel-section').scrollIntoView({ block: 'start' }));
        await page.waitForTimeout(400);
        await page.screenshot({ path: 'e2e/screenshots/04_carousel_section_390_mobile.png' });

        // 11. Full page screenshot at 1440
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForTimeout(400);
        await page.screenshot({ path: 'e2e/screenshots/05_full_page_v3.png', fullPage: true });
    });
});
