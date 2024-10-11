import {test, expect} from 'playwright-test-coverage'
import { Role } from '../src/service/pizzaService';
import { MockContext, mockAuth, mockOrder } from './mocks';

test('login-register navigtion', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('main').getByText('Login').click();
  await page.getByRole('main').getByText('Register').click();
});

test('admin profile page', async ({ page }) => {
  const ctx = new MockContext([{
    id: "1",
    name: "dadmin",
    email: "a@jwt.com",
    password: "admin",
    roles: [{role: Role.Admin}]
  }]);

  await mockAuth(ctx, page);
  await mockOrder(ctx, page);
  await page.goto('http://localhost:5173/login');
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'd', exact: true}).click();
  await expect(page.getByText('a@jwt.com')).toBeVisible();
  await expect(page.getByText('admin', { exact: true })).toBeVisible();
  await expect(page.getByText('How have you lived this long')).toBeVisible();
});