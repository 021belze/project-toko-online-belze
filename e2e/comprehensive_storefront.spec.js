import { test, expect } from '@playwright/test';

test.describe('End-to-End Storefront & Configurator User Flow', () => {
    test('completes full discovery on homepage and configures purchase on Buy Studio', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });

        // 1. Visit homepage
        await page.goto('/');
        await expect(page).toHaveTitle(/Samsung Authorized Reseller/i);

        // 2. Test Mega-Menu hover on all 4 items
        const menuItems = ['Store', 'Galaxy S Series', 'Galaxy Z Series', 'Layanan & Garansi SEIN'];
        for (const item of menuItems) {
            const btn = page.getByRole('button', { name: item, exact: true });
            await btn.hover();
            await page.waitForTimeout(200);
            await expect(page.locator('header').getByText(item)).toBeVisible();
        }

        // Close mega menu by hovering away to logo
        await page.locator('text=SAMSUNG').first().hover();
        await page.waitForTimeout(300);

        // 3. Test Titanium Swatches on S26 Ultra Hero
        const s26Section = page.locator('#s26-ultra-section');
        await s26Section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);

        const violetSwatch = page.locator('button[title="Titanium Cobalt Violet"]');
        const blackSwatch = page.locator('button[title="Titanium Phantom Black"]');
        await expect(violetSwatch).toBeVisible();
        await blackSwatch.click();
        await page.waitForTimeout(200);
        await violetSwatch.click();
        await page.waitForTimeout(200);

        // 4. Test Carousel interaction with official products
        const carousel = page.locator('#carousel-section');
        await carousel.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);

        await expect(page.getByRole('heading', { name: 'Galaxy Watch Ultra', exact: true })).toBeVisible();

        const nextBtn = page.locator('button[aria-label="Gulir ke kanan"]');
        if (await nextBtn.isEnabled()) {
            await nextBtn.click();
            await page.waitForTimeout(400);
        }

        // 5. Click "Beli Sekarang" and navigate to Buy Studio
        const buyBtn = page.locator('header').getByRole('link', { name: 'Beli Sekarang' });
        await buyBtn.click();
        await page.waitForURL(/\/buy\/samsung-galaxy-s26-ultra/);
        await expect(page).toHaveTitle(/Beli Samsung Galaxy S26 Ultra/i);

        // Take Buy Studio Screenshot
        await page.screenshot({ path: 'e2e/screenshots/06_buy_studio_loaded.png' });

        // 6. Test Buy Studio Configurator: Select Color (Cobalt Violet)
        const violetColorOption = page.locator('button:has-text("Titanium Cobalt Violet")');
        if (await violetColorOption.isVisible()) {
            await violetColorOption.click();
            await page.waitForTimeout(200);
        }

        // 7. Select Storage Option (512GB)
        const storage512Option = page.locator('button:has-text("512GB")');
        if (await storage512Option.isVisible()) {
            await storage512Option.click();
            await page.waitForTimeout(200);
        }

        // 8. Select In-Store Pickup (Ambil di Toko Rekanan SES Mall)
        const pickupRadio = page.locator('input[value="pickup"]');
        if (await pickupRadio.isVisible()) {
            await pickupRadio.check();
            await page.waitForTimeout(200);
        }

        // Take Configured Buy Studio Screenshot
        await page.screenshot({ path: 'e2e/screenshots/07_buy_studio_configured.png' });
    });
});
