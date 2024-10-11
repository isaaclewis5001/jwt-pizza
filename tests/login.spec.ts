import {test, expect} from 'playwright-test-coverage'

test('bad login', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.getByPlaceholder('Email address').fill('nawt@a.user');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('fewiopcne');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByText('unknown user').isVisible();
});


test('malformed email', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.getByPlaceholder('Email address').fill('robert tables');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('fewiopcne');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByText("Please include an '@' in the email address.").isVisible();
});


