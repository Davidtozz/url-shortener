import { test, expect } from '@playwright/test';

test.describe("API Operations as Guest", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    })

    const apiBase = '/api';

    test('Guest cannot delete a short URL', async ({ request }) => {
        const response = await request.delete(apiBase + '/randomcode');
        expect(response.status()).toBe(401);
    });
})

test.describe("API Operations as Authenticated User", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');        

        const username = `user${Date.now()}`;
        const password = 'password123';
        
        await page.getByTestId('username-input').pressSequentially(username);
        await page.getByTestId('password-input').pressSequentially(password);
        await page.getByTestId('register-button').click();
        
        await expect(page.getByText(`You are logged in as ${username}`)).toBeVisible();
    });

    test('Authenticated user can delete their short URL', async ({ page }) => {

        // Shorten a URL
        const originalUrl = 'https://example.com/to-delete';
        await page.getByTestId('url-input').fill(originalUrl);
        await page.getByTestId('shorten-button').click();
        const shortUrl = (await page.getByTestId('short-url').textContent())?.trim() ?? '';
        const shortCode = shortUrl.split('/').pop() ?? '';

        const buttonDelete = page.getByTestId('button-delete');
        await expect(buttonDelete).toBeVisible();
    
        await buttonDelete.click();

        // verify the short URL is deleted without api call
        await expect(page.getByTestId(shortCode)).not.toBeVisible();
    })
});