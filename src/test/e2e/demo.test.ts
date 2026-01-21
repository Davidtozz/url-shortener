import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});

test('User can register for an account', async ({ page }) => {
	await page.goto('/');
	const username = `user${Date.now()}`;
	const password = 'password123';

	await page.getByTestId('username-input').fill(username);
	await page.getByTestId('password-input').fill(password);
	await page.getByTestId('register-button').click();

	await expect(page.getByText(`You are logged in as ${username}`)).toBeVisible();
});