<script lang="ts">
  import { enhance } from "$app/forms";

  let { form, data }: { form?: any; data: any } = $props();
  let isLoggedIn = $derived(!!data?.user);

</script>

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
                name="username"
                class="mt-1 px-3 py-2 w-full border rounded"
              />
            </label>
            <label class="block mt-2">
              Password
              <input
                type="password"
                name="password"
                class="mt-1 px-3 py-2 w-full border rounded"
              />
            </label>
            <div class="flex gap-2 mt-3">
              <button
                type="submit"
                disabled={isLoggedIn}
                class="bg-blue-600 text-white px-3 py-1 rounded">Login</button
              >
              <button
                formaction="?/register"
                class="bg-blue-600 text-white px-3 py-1 rounded"
                >Register</button
              >
            </div>
          {/if}
        </form>
        <p style="color: red">{form?.message ?? ""}</p>
      </div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: "MonoLisa", system-ui;
  }
</style>

