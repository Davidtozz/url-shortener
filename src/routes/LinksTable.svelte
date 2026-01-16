<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData, PageServerData } from "./$types";

  let originalUrl = $state("");
  let shortUrl = $state("");
  let loading = $state(false);
  let error = $state("");
  let success = $state(false);

  let { form, data }: { form?: any; data: any } = $props();
  let isLoggedIn = $derived(!!data?.user);

  async function shortenUrl() {
    error = "";
    success = false;
    loading = true;

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl }),
      });

      const resp = await response.json();

      if (!response.ok) {
        error = resp.error || "Failed to shorten URL";
        loading = false;
        return;
      }

      shortUrl = resp.shortUrl;
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

{#if data.links.length > 0}
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
          {#each data.links as link}
            <tr>
              <td class="pr-4 py-2 border-b">
                <code class="bg-gray-100 px-2 py-1 rounded break-all"
                  >{link.originalUrl}</code
                >
              </td>
              <td class="py-2 border-b">
                <a
                  href={link.shortCode}
                  target="_blank"
                  class="text-blue-600 hover:underline">{link.shortCode}</a
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: "MonoLisa", system-ui;
  }
</style>

