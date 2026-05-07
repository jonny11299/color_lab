<script>
    import { themeStore } from "$lib/stores/theme.svelte.js";
    import { onMount } from "svelte";

    onMount(() => {
        themeStore.init();
    });
</script>

<slot />
