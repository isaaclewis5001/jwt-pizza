import {test, expect} from 'playwright-test-coverage'
import { mockAuth, MockContext } from './mocks';


test('newcomer tests', async ({ page }) => {
    const ctx = new MockContext([]);

    await mockAuth(ctx, page);

    await page.goto('http://localhost:5173/');
    await expect(page.getByText('JWT Pizza', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Order now' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();
    await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('supasecret');
    await page.getByPlaceholder('Full name').click();
    await page.getByPlaceholder('Full name').fill('testuser1000000');
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('playwrightmorelikeplaywrong@gmail.com');
    await page.locator('div').filter({ hasText: /^Password$/ }).getByRole('button').click();
    await page.locator('div').filter({ hasText: /^Password$/ }).getByRole('button').click();
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByRole('link', { name: 't', exact: true}).click();
    await page.getByRole('link', { name: 'Logout' }).click();
});