<script lang="ts">
  import Github from './Github.svelte';


  import { enhance } from "$app/forms";
  import type { ActionData, PageData, PageServerData } from "./$types";
  import {type URL as Shortlink} from '$lib/server/db/schema'; 

  let originalUrl = $state("");
  let shortUrl = $state("");
  let loading = $state(false);
  let error = $state("");
  let success = $state(false);

  interface Props {
    form: ActionData;
    data: PageServerData;
  }
  let { form, data }: Props = $props();
  let isLoggedIn = $derived(!!data?.user);
  
  let userShortlinks = $derived(data?.links ?? [] as Shortlink[]);

  async function shortenUrl() {
    error = "";
    success = false;
    loading = true;

    try {
      const shortlinkResponse = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl }),
      });

      const shortlink = await shortlinkResponse.json();

      if (!shortlinkResponse.ok) {
        error = shortlink.error || "Failed to shorten URL";
        loading = false;
        return;
      }

      userShortlinks = [shortlink, ...userShortlinks];
      shortUrl = shortlink.shortUrl;
      success = true;
      originalUrl = "";
    } catch (err) {
      error = "An error occurred while shortening the URL";
      console.error(err);
    } finally {
      loading = false;
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(shortUrl);
    alert("Copied to clipboard!");
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") shortenUrl();
  }
</script>

<main class="min-h-screen bg-white flex flex-col items-center justify-center p-4 doodles  gap-5">
  <div class="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
    <h1 class="text-3xl font-bold text-gray-800 mb-2 text-center">
      URL Shortener
    </h1>

    <!-- Login section -->
    <div class="space-y-4">
      <div>
        <label for="url" class="block text-sm font-medium text-gray-700 mb-2">
          Enter your URL
        </label>
        <input
        data-testid="url-input"
          id="url"
          type="url"
          placeholder="https://example.com/very/long/url"
          bind:value={originalUrl}
          onkeydown={handleKeyDown}
          disabled={loading}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      {#if error}
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          {error}
        </div>
      {/if}

      {#if success && shortUrl}
        <div
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
        >
          <p class="font-semibold mb-2">Your short URL:</p>
          <div class="flex items-center gap-2">
            <code 
              data-testid="short-url"
            class="flex-1 bg-green-50 px-2 py-1 rounded break-all"
              >{shortUrl}</code
            >
            <button
              onclick={copyToClipboard}
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
            >
              Copy
            </button>
          </div>
        </div>
      {/if}

      <button
        data-testid="shorten-button"
        onclick={shortenUrl}
        disabled={!originalUrl || loading}
        class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 {loading
          ? 'cursor-not-allowed'
          : 'cursor-pointer'}"
      >
        {loading ? "Shortening..." : "Shorten URL"}
      </button>

      <div class="mt-6">
        <form method="post" action="?/login" use:enhance>
          {#if isLoggedIn}
            <h2 class="text-lg font-medium">
              You are logged in as {data?.user?.username}
            </h2>
            <button
              class="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              formaction="?/logout"
            >
              Logout
            </button>
          {:else}
            <h2 class="text-lg font-medium">Login / Register</h2>
            <label class="block mt-2">
              Username
              <input
                data-testid="username-input"
                type="text"
                name="username"
                class="mt-1 px-3 py-2 w-full border rounded"
              />
            </label>
            <label class="block mt-2">
              Password
              <input
                data-testid="password-input"
                type="password"
                name="password"
                class="mt-1 px-3 py-2 w-full border rounded"
              />
            </label>
            <div class="flex gap-2 mt-3">
              <button
                data-testid="login-button"
                type="submit"
                disabled={isLoggedIn}
                class="bg-blue-600 text-white px-3 py-1 rounded">Login</button
              >
              <button
                data-testid="register-button"
                type="submit"
                formaction="?/register"
                class="bg-blue-600 text-white px-3 py-1 rounded"
                >Register</button
              >
            </div>
          {/if}
        </form>
        <p style="color: red">{form?.message ?? ""}</p>
      </div>
    </div>

    <!-- Shortinks table -->
    <div>
      <h2 class="text-2xl font-bold text-gray-800 mt-8 mb-4 text-center">
        Recently Shortened URLs
      </h2>

      <table>
        <thead>
          <tr>
            <th class="text-left pr-4 py-2 border-b">Original URL</th>
            <th class="text-left py-2 border-b">Short URL</th>
          </tr>
        </thead>
        <tbody>
          {#each userShortlinks as shortlink}
          <tr>
            <td class="pr-4 py-2 border-b">
              <code class="bg-gray-100 px-2 py-1 rounded break-all"
                  >{shortlink.originalUrl}</code
                >
              </td>
              <td class="py-2 border-b">
                <a
                href={shortlink.shortCode}
                target="_blank"
                class="text-blue-600 hover:underline">{shortlink.shortCode}</a
                >
              </td>
            </tr>
            {/each}
          </tbody>
      </table>
    </div>
    
    </div>
    
    <a href="https://github.com/Davidtozz" target="_blank">
      <section class="flex bg-white rounded-lg shadow-md p-4 mt-6 items-center gap-3">
        <Github />
        <p>
          Davidtozz
        </p>
      </section>
    </a>
    </main>
  
<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: "MonoLisa", system-ui;
  }

  .doodles {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 113 114' fill='currentColor' width='24' height='24'%3E%3Cpath d='M34.11 22.5864C36.41 24.5864 39.51 20.9864 37.21 18.9864C34.81 16.9864 31.71 20.5864 34.11 22.5864Z' fill='%23000000' stroke='%23000000'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }
</style>
