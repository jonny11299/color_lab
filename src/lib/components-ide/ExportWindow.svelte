<script>
    import { phaseStore } from "$lib/stores/phaseStore.svelte.js";
    import { generateCss } from "$lib/utils/cssGenerator.js";
    import { colorStore } from "$lib/stores/colorStore.svelte.js";
    import { paramStore } from "$lib/stores/paramStore.svelte.js";

    // not really used here, just helpful to see the format that 'settings' takes on
    const defaultSettings = {
        background: "#fafafa",
        surface: "#f0f0f5",
        text: "#1a1a2e",
        primary: "#5c6ac4",
        secondary: "#8892d4",
        accent: "#f49342",
        muteStrength: 1, // 0 = no muting, 1 = full muting
        typeScale: 1.333, // modular scale ratio
        borderWidth: 1, // px
        borderRadius: 10, // px
    };

    // as should be expected, our stores are the source of truth.
    let settings = $derived({
        ...colorStore.colorSettings,
        ...paramStore.paramSettings,
    });

    /* Download the settings from cssGenerator.js. */
    let css = $derived(generateCss(settings));

    let copied = $state(false);
    let copyTimer;

    async function copyCss() {
        try {
            await navigator.clipboard.writeText(css);
            copied = true;
            clearTimeout(copyTimer);
            copyTimer = setTimeout(() => (copied = false), 1600);
        } catch {
            copied = false;
        }
    }

    function downloadCss() {
        const blob = new Blob([css], { type: "text/css" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "styles.css";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
</script>

<div class="container">
    <h2>Export:</h2>
    <button onclick={() => phaseStore.setExportState(false)}>Cancel</button>
    <button onclick={() => copyCss()}>Copy CSS</button>
    <button onclick={() => downloadCss()}>Download CSS</button>
</div>

<style>
    .container {
        padding: 2rem;
        margin: 2rem;
    }
</style>
