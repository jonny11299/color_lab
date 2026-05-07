<script>
    import "../app.css";
    import { themeStore } from "$lib/theme.svelte.js";
    import ImageLoader from "$lib/components/ImageLoader.svelte";
</script>

<h1>Color Lab</h1>

<!--
<h1>Welcome to your library project</h1>
<p>
    Create your package using @sveltejs/package and preview/showcase your work
    with SvelteKit
</p>
<p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
    documentation
</p>
-->

<button onclick={() => themeStore.setTheme("dark")}>Dark</button>
<button onclick={() => themeStore.setTheme("light")}>Light</button>
<button onclick={() => themeStore.setTheme("system")}>System</button>

<p>Current: {themeStore.theme}</p>

<ImageLoader />
