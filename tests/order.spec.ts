import {test, expect} from 'playwright-test-coverage'
import { mockListFranchises, mockMenu, mockAuth, MockContext, mockOrder, mockVerify } from './mocks';
import { Role } from '../src/service/pizzaService';

test('order', async ({ page }) => {
  const ctx = new MockContext([
    {
      id: "1",
      name: "samwise",
      email: 'playwrightmorelikeplaywrong@gmail.com',
      password: 'supasecret',
      roles: [{role: Role.Diner}]
    }
  ]);

  await mockMenu(page);
  await mockListFranchises(page);
  await mockAuth(ctx, page);
  await mockOrder(ctx, page);
  await mockVerify(ctx, page);

  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Order now' }).click();
  await page.getByRole('combobox').selectOption('2');
  await page.getByRole('link', { name: 'Image Description Test Pizza 1' }).click();
  await page.getByRole('link', { name: 'Image Description Test Pizza 2' }).click();
  await page.getByRole('link', { name: 'Image Description Test Pizza 2' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('playwrightmorelikeplaywrong@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('supasecret');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Send me those 3 pizzas right now')).toBeVisible();
  await page.getByRole('button', { name: 'Pay now' }).click();
  await expect(page.getByText('Here is your JWT Pizza!')).toBeVisible();
  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page.getByRole('heading', { name: 'JWT Pizza - valid' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});


test('order after login', async ({ page }) => {
  const ctx = new MockContext([
    {
      id: "1",
      name: "samwise",
      email: 'playwrightmorelikeplaywrong@gmail.com',
      password: 'supasecret',
      roles: [{role: Role.Diner}]
    }
  ]);

  await mockMenu(page);
  await mockListFranchises(page);
  await mockAuth(ctx, page);
  await mockOrder(ctx, page);
  await mockVerify(ctx, page);

  await page.goto('http://localhost:5173/login');
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('playwrightmorelikeplaywrong@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('supasecret');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('button', { name: 'Order now' }).click();
  await page.getByRole('combobox').selectOption('2');
  await page.getByRole('link', { name: 'Image Description Test Pizza 1' }).click();
  await page.getByRole('link', { name: 'Image Description Test Pizza 2' }).click();
  await page.getByRole('link', { name: 'Image Description Test Pizza 2' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await expect(page.getByText('Send me those 3 pizzas right now')).toBeVisible();
  await page.getByRole('button', { name: 'Pay now' }).click();
  await expect(page.getByText('Here is your JWT Pizza!')).toBeVisible();
  await page.getByRole('button', { name: 'Order more' }).click();
  await page.getByRole('link', { name: 's', exact: true}).click();
});
