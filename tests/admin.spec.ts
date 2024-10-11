import { test, expect } from 'playwright-test-coverage';
import { mockAuth, MockContext, mockFranchise, mockStore} from './mocks';
import { Role } from '../src/service/pizzaService';

test('admin', async ({ page }) => {
  const ctx = new MockContext([{
    id: "1",
    name: "dadmin",
    email: "a@jwt.com",
    password: "admin",
    roles: [{role: Role.Admin}]
  }]);

  await mockAuth(ctx, page);
  await mockFranchise(page);
  await mockStore(page);

  await page.goto('http://localhost:5173/login');
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByPlaceholder('franchise name').click();
  await page.getByPlaceholder('franchise name').fill('Da Jawt');
  await page.getByPlaceholder('franchisee admin email').click();
  await page.getByPlaceholder('franchisee admin email').fill('a@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'Da Jawt' })).toBeVisible();
  await page.getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByPlaceholder('store name').click();
  await page.getByPlaceholder('store name').fill('Jawtteria');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('row', { name: 'Jawtteria 0 ₿ Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('link', { name: 'Admin' }).first().click();
  await page.getByRole('row', { name: 'Da Jawt admin Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
});