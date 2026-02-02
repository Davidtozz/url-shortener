import { expect, test } from '@playwright/test';


test.describe("Main page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    })   
    test('User can register for an account', async ({ page }) => {
        const username = `user${Date.now()}`;
        const password = 'password123';
        
        await page.getByTestId('username-input').fill(username);
        await page.getByTestId('password-input').fill(password);
        await page.getByTestId('register-button').click();
        
        await expect(page.getByText(`You are logged in as ${username}`)).toBeVisible();
    });
    test('guest can shorten a valid URL and see the short link', async ({ page }) => {
        const original = 'https://example.com/path?x=1';
        
        const urlInput = page.getByTestId('url-input');
        await urlInput.fill(original);
        
        const shortenButton = page.getByTestId('shorten-button');
        await shortenButton.click();
        
        const shortLink = page.getByTestId('short-url');
        await expect(shortLink).toBeVisible();
    });
    
    test('shortening same URL twice returns the same code', async ({ page }) => {
        const original = 'https://example.com/duplicate-test';
        
        await page.getByTestId('url-input').fill(original);
        await page.getByTestId('shorten-button').click();
        const first = (await page.getByTestId('short-url').textContent())?.trim() ?? '';
        
        await page.goto('/');
        await page.getByTestId('url-input').fill(original);
        await page.getByTestId('shorten-button').click();
        const second = (await page.getByTestId('short-url').textContent())?.trim() ?? '';
        
        expect(first).toBeTruthy();
        expect(second).toBeTruthy();
        expect(first).toEqual(second);
    });

    test('Shortlink correclty redirects to original URL', async ({ page }) => {
        const exampleOriginalUrl = 'https://www.youtube.com/';
        
        await page.getByTestId('url-input').fill(exampleOriginalUrl);
        await page.getByTestId('shorten-button').click();
        const shortUrl = (await page.getByTestId('short-url').textContent())?.trim() ?? '';
        const response = await page.goto(shortUrl, { waitUntil: 'load' });

        expect(response?.url()).toBe(exampleOriginalUrl);
    })
})