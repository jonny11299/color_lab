<script>
    import { themeStore } from "$lib/theme.svelte.js";
    import { onMount } from "svelte";

    onMount(() => {
        themeStore.init();
    });
</script>

<slot />
