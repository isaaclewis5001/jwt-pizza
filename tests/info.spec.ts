import {test, expect} from 'playwright-test-coverage'

test('info pages', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'History' }).click();
    await expect(page.getByRole('link', { name: 'home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'history', exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'About' }).click();
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByRole('link', { name: 'franchise-dashboard' })).toBeVisible();
    await page.goto('http://localhost:5173/el-banyo');
    await expect(page.getByText('Oops')).toBeVisible();
});