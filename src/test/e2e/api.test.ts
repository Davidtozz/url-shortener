import { test, expect } from '@playwright/test';

test.describe("API Operations as Guest", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    })

    const apiBase = '/api';

    test('Guest cannot delete a short URL', async ({ request }) => {
        const response = await request.delete(apiBase + '/randomcode');
        await expect(response.status()).toBe(401);
    });
    
    test('Guest cannot see the delete button for a short URL in the table', async ({ page }) => {
        await page.getByTestId('url-input').fill('https://example.com/guest-delete');
        const response = page.waitForResponse(response => {
            return response.url().endsWith('/api/shorten') 
                && response.request().method() === 'POST'
        })

        await page.getByTestId('shorten-button').click();
        await response;

        await expect(page.getByTestId('short-url')).toBeVisible();
        await expect(page.getByTestId('button-delete')).not.toBeVisible();        
    });

    test('Guest cannot create a short URL with a custom code', async ({ request }) => {
        const resp = await request.post(apiBase + '/shorten', {
            data: { originalUrl: 'https://example.com/guest-custom', code: 'guestcode' }
        });
        expect(resp.status()).toBe(401);
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

    test('Authenticated user can create a short URL with a custom code', async ({ page }) => {
        const originalUrl = 'https://example.com/custom1';
        const customCode = `cstm${Date.now()}`;

        await page.getByTestId('url-input').fill(originalUrl);
        await page.locator('#custom-code').fill(customCode);
        await page.getByTestId('shorten-button').click();

        const shortUrl = (await page.getByTestId('short-url').textContent())?.trim() ?? '';
        const shortCode = shortUrl.split('/').pop() ?? '';
        expect(shortCode).toBe(customCode);
    });

    test('Authenticated user cannot reuse a custom code', async ({ page }) => {
        const code = `dup${Date.now()}`;

        // create first shortlink with custom code
        await page.getByTestId('url-input').fill('https://example.com/first');
        await page.locator('#custom-code').fill(code);
        await page.getByTestId('shorten-button').click();
        await expect(page.getByTestId('short-url')).toBeVisible();

        // attempt to create another with same code
        await page.getByTestId('url-input').fill('https://example.com/second');
        await page.locator('#custom-code').fill(code);
        await page.getByTestId('shorten-button').click();
        const response = await page.waitForResponse(response =>
            response.url().endsWith('/api/shorten') && response.request().method() === 'POST'
        );
        // frontend should show the API error
        expect(response.status()).toBe(409);
    });
});