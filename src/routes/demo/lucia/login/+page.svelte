<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData, PageServerData } from "./$types";

  interface Props {
    form: ActionData;
    data: PageServerData;
  }

  let { form, data }: Props = $props();
  let isLoggedIn = $derived(!!data?.session);
</script>

<form method="post" action="?/login" use:enhance>
  {#if isLoggedIn}
    <h1>You are logged in as {data?.user?.username}</h1>
    <button
      class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
      formaction="?/logout"
    >
      Logout
    </button>
  {:else}
    <h1>Login/Register</h1>
    <label>
      Username
      <input
        name="username"
        class="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </label>
    <label>
      Password
      <input
        type="password"
        name="password"
        class="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </label>
    <button
      type="submit"
      disabled={isLoggedIn}
      class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    >
      Login
    </button>
    <button
      formaction="?/register"
      class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    >
      Register
    </button>
  {/if}
</form>
<p style="color: red">{form?.message ?? ""}</p>
