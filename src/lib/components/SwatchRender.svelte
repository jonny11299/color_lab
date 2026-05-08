<script>
    import { imageStore } from "$lib/stores/imageStore.svelte.js";
    import { colorStore } from "$lib/stores/colorStore.svelte.js";

    let swatches = $derived(imageStore.swatches);
    let copied = $state(null);
    let hoveredHex = $state(null);

    let selection = $derived(colorStore.curIndex);

    function handleClick(hex) {
        copyHex(hex);
        colorStore.setColor(selection, hex);
        colorStore.iterate();

        console.log("selection now " + selection);
    }
    function copyHex(hex) {
        navigator.clipboard.writeText(hex);
        copied = hex;
        setTimeout(() => (copied = null), 1500);
    }
</script>

<div class="container">
    <h3>Swatches</h3>
    <div class="swatch-preview-wrapper">
        <div
            class="swatch-preview"
            style="background-color: {hoveredHex ?? 'var(--color-bg'}"
        ></div>
        <div
            class="copiedHex"
            style="visibility: {hoveredHex ? 'visible' : 'hidden'}"
        >
            {copied ? "Copied!" : (hoveredHex ?? "l")}
        </div>
    </div>
    <div class="swatchpalette">
        {#each swatches as s}
            <div
                class="swatch"
                style="background-color: {s.hex}"
                onclick={() => handleClick(s.hex)}
                onmouseenter={() => (hoveredHex = s.hex)}
                onmouseleave={() => (hoveredHex = null)}
                role="button"
                tabindex="0"
            ></div>
        {:else}
            <p>Empty for now. Upload an image to view its color swatches.</p>
        {/each}
    </div>
</div>

<style>
    .container {
        border: 2px solid var(--color-border);
        border-radius: 1.5rem;
        padding: 1rem;
        max-width: 100%;
        min-width: 50%;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .swatchpalette {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 0px;
        width: 100%;
        padding: 0px;
        margin: 0px;

        justify-content: center;
    }
    .swatch {
        /* border: 1px solid var(--color-border);*/
        width: 100%;
        aspect-ratio: 1;
        padding: 0px;
        margin: 0px;
        cursor: pointer;
    }

    .tooltip {
        display: none;
        position: absolute;
        bottom: 110%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.75);
        color: white;
        font-size: 0.65rem;
        padding: 2px 5px;
        border-radius: 4px;
        white-space: nowrap;
        pointer-events: none;
        z-index: 10;
    }

    .swatch:hover .tooltip {
        display: block;
    }

    .swatch-preview-wrapper {
        width: 100%;
        display: block;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0rem;
        margin-bottom: 1rem;

        font-size: 0.85rem;
        font-family: monospace;
    }

    .swatch-preview {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 3px;
        border: 0px solid var(--color-border);
        margin-bottom: 0.5rem;
    }
    .copiedHex {
        text-align: center;
        color: var(--color-text);
    }
</style>
