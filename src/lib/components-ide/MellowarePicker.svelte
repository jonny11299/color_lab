<script>
    import { onMount, onDestroy } from "svelte";
    import "@melloware/coloris/dist/coloris.css";

    let { value = "#000000", onchange } = $props();

    let inputEl;

    onMount(() => {
        // Dynamic import avoids SSR issues (coloris touches `document` on load)
        import("@melloware/coloris").then(({ coloris, init }) => {
            init();
            coloris({
                el: inputEl,
                theme: "default", // 'default' | 'large' | 'polaroid' | 'pill'
                themeMode: "auto", // 'light' | 'dark' | 'auto'
                alpha: true,
                swatches: ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"],
            });
        });
    });

    onDestroy(() => {
        // Coloris doesn't have a destroy API, but removing the input cleans it up
    });
</script>

<input bind:this={inputEl} bind:value oninput={onchange} type="text" readonly />
