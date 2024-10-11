import {test, expect} from 'playwright-test-coverage'

test('docs page', async ({ page }) => {
  await page.goto('http://localhost:5173/docs');
  await expect(page.getByText('JWT Pizza API')).toBeVisible();
});